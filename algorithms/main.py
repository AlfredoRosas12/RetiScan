from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import uvicorn
from io import BytesIO
from PIL import Image
import torch
from torchvision import transforms
import datetime
import os
import numpy as np
import cv2

app = FastAPI(
    title="AI-RetiScan",
    description="Microservicio de Inferencia de Retinopatía Diabética con Evaluación Híbrida (OpenCV + PyTorch)",
    version="2.0"
)

# ---------------------------------------------------------------------------
# Cargamos el modelo una sola vez al levantar el servidor.
# Así las peticiones que lleguen después no tienen que esperar a que pese el .pt
# ---------------------------------------------------------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "retiscan_efficientnetb0_completo.pt")

try:
    if not os.path.exists(MODEL_PATH):
        print(f"ADVERTENCIA: El archivo del modelo '{MODEL_PATH}' no se encontró. Asegúrate de colocarlo en la misma carpeta.")
        model = None
    else:
        print(f"Cargando modelo desde {MODEL_PATH}...")
        model = torch.load(
            MODEL_PATH,
            weights_only=False,
            map_location=torch.device("cpu")
        )
        # Si alguien lo guardó como DataParallel, lo envolvemos de vuelta
        if hasattr(model, 'module'):
            model = model.module
        model = model.to(torch.device("cpu"))
        model.eval()
        print("Modelo cargado exitosamente.")
except Exception as e:
    # Mejor dejar el servicio vivo y responder 503 que tumbar todo el proceso
    print(f"Error al cargar el modelo: {e}")
    model = None

# ---------------------------------------------------------------------------
# Preprocesamiento: tiene que ser EXACTAMENTE el mismo que se usó en el
# entrenamiento, si no las activaciones ya no significan lo mismo.
# ---------------------------------------------------------------------------
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# Índice de clase -> nombre legible (el orden viene del dataset usado)
CLASS_NAMES = {
    0: "Mild",
    1: "Moderate",
    2: "No_DR",
    3: "Proliferate_DR",
    4: "Severe"
}

def format_class_name(raw_name: str) -> str:
    # El dataset usa guiones bajos, pero para mostrárselo al doctor
    # queda mejor con un espacio.
    if raw_name == "No_DR":
        return "No DR"
    elif raw_name == "Proliferate_DR":
        return "Proliferative DR"
    return raw_name

def generate_recommendation(grade: str) -> str:
    # Recomendación simple según la gravedad. La parte fina la decide el médico.
    if grade == "No DR":
        return "Seguimiento anual recomendado."
    return "Referir al oftalmólogo en menos de 4 semanas."

# ---------------------------------------------------------------------------
# Validaciones con OpenCV (sin red neuronal, puro procesamiento de imagen)
# ---------------------------------------------------------------------------

def validate_fundus_structure(pil_img: Image.Image) -> dict:
    """
    Revisa si la imagen de verdad parece una retinografía médica
    comparando su perfil de color y la textura que dejan los vasos.
    """
    img_np = np.array(pil_img)
    if img_np.ndim < 3 or img_np.shape[2] < 3:
        return {"is_fundus": False, "reason": "La imagen no contiene canales de color RGB válidos."}

    h, w, _ = img_np.shape

    # 1) Perfil cromático: una retina sana tiende a tonos rojos/naranjas,
    #    así que medimos qué tanto de la imagen cae en esas zonas del HSV.
    hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)
    lower_red1 = np.array([0, 20, 20])
    upper_red1 = np.array([35, 255, 255])
    lower_red2 = np.array([150, 20, 20])
    upper_red2 = np.array([180, 255, 255])

    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    fundus_mask = cv2.bitwise_or(mask1, mask2)
    red_ratio = float(np.sum(fundus_mask > 0) / (h * w))

    # 2) Estructura: los vasos sanguíneos se ven mejor en el canal verde.
    #    Aplicamos CLAHE para mejorarlos y contamos los bordes con Canny.
    green = img_np[:, :, 1]
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    contrast_green = clahe.apply(green)
    edges = cv2.Canny(contrast_green, 30, 90)
    vessel_density = float(np.sum(edges > 0) / (h * w))

    # Umbrales permisivos a propósito: preferimos dejar pasar una foto dudosa
    # y que la red decida, antes que rechazar una retinografía real.
    is_chromatic_ok = red_ratio >= 0.15
    is_vessel_ok = vessel_density >= 0.003

    is_fundus = is_chromatic_ok and is_vessel_ok

    reason = None
    if not is_chromatic_ok:
        reason = "La imagen no corresponde a una retinografía médica (perfil cromático no retiniano)."
    elif not is_vessel_ok:
        reason = "La nitidez o estructura de la imagen no es suficiente para evaluación médica."

    return {
        "is_fundus": is_fundus,
        "red_ratio": round(red_ratio, 3),
        "vessel_density": round(vessel_density, 3),
        "reason": reason
    }

def evaluate_image_quality(pil_img: Image.Image) -> dict:
    """
    Califica la calidad física de la toma antes de mandarla a la red:
      - ¿es fondo de ojo? (estructura + color)
      - ¿está enfocada? (varianza del Laplaciano)
      - ¿tiene buena exposición? (brillo promedio del canal verde)
    """
    # Primero descartamos lo que ni siquiera es una retinografía
    structure_eval = validate_fundus_structure(pil_img)
    if not structure_eval["is_fundus"]:
        return {
            "is_usable": False,
            "sharpness_score": 0.0,
            "brightness_score": 0.0,
            "rejection_reason": structure_eval["reason"]
        }

    img_np = np.array(pil_img)
    if img_np.ndim == 2:
        gray = img_np
        green = img_np
    else:
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        green = img_np[:, :, 1]  # el canal verde es el que mejor contraste da

    # Nitidez: un Laplaciano con varianza alta = hay detalle, no está borrosa
    sharpness_score = float(round(cv2.Laplacian(gray, cv2.CV_64F).var(), 2))

    # Exposición: medimos el brillo medio del canal verde
    brightness_score = float(round(np.mean(green), 2))

    is_sharp = sharpness_score >= 30.0
    is_well_lit = 15.0 <= brightness_score <= 245.0

    is_usable = is_sharp and is_well_lit
    rejection_reason = None

    if not is_sharp:
        rejection_reason = f"La imagen está desenfocada o borrosa (Puntaje de nitidez: {sharpness_score}). Por favor capture una imagen más clara."
    elif not is_well_lit:
        if brightness_score < 15.0:
            rejection_reason = f"La imagen es demasiado oscura para ser evaluada (Brillo: {brightness_score}). Verifique la iluminación."
        else:
            rejection_reason = f"La imagen está sobreexpuesta por deslumbramiento (Brillo: {brightness_score}). Ajuste el flash."

    return {
        "is_usable": is_usable,
        "sharpness_score": sharpness_score,
        "brightness_score": brightness_score,
        "rejection_reason": rejection_reason
    }

def detect_eye_laterality(pil_img: Image.Image, selected_eye: str = None) -> dict:
    """
    Intenta deducir si la retina es del ojo derecho (OD) o izquierdo (OS)
    según dónde esté el disco óptico: el punto más brillante de la imagen.
    """
    img_np = np.array(pil_img)
    if img_np.ndim == 3:
        green = img_np[:, :, 1]
    else:
        green = img_np

    height, width = green.shape
    blurred = cv2.GaussianBlur(green, (15, 15), 0)

    # El nervio óptico suele ser la zona más iluminada de la retinografía
    _, _, _, max_loc = cv2.minMaxLoc(blurred)
    optic_disc_x = max_loc[0]

    # Regla anatómica clásica:
    #   disco a la izquierda de la imagen (x < width/2)  => ojo derecho (OD)
    #   disco a la derecha de la imagen (x > width/2)    => ojo izquierdo (OS)
    if optic_disc_x < width / 2:
        detected_eye = "RIGHT"
    else:
        detected_eye = "LEFT"

    matches = (selected_eye == detected_eye) if selected_eye else True

    return {
        "detected_eye": detected_eye,
        "optic_disc_x_percent": float(round((optic_disc_x / width) * 100, 1)),
        "matches_selected_eye": matches,
        "warning": None if matches else f"Atención: La anatomía sugiere que la imagen corresponde al Ojo {'Derecho' if detected_eye == 'RIGHT' else 'Izquierdo'}, pero se seleccionó Ojo {'Derecho' if selected_eye == 'RIGHT' else 'Izquierdo'}."
    }

@app.get("/")
def read_root():
    return {"status": "AI-RetiScan Service is Running (OpenCV + PyTorch)"}

@app.post("/predict")
async def predict(image: UploadFile = File(...), eye: str = Form(None)):
    if model is None:
        raise HTTPException(status_code=503, detail="El modelo no está cargado en el servidor.")

    try:
        contents = await image.read()
        pil_image = Image.open(BytesIO(contents)).convert("RGB")

        # 1) Validamos calidad con OpenCV antes de gastar una inferencia
        quality_eval = evaluate_image_quality(pil_image)
        if not quality_eval["is_usable"]:
            raise HTTPException(
                status_code=400,
                detail=quality_eval["rejection_reason"]
            )

        # 2) Tratamos de saber si es ojo derecho o izquierdo
        anatomy_eval = detect_eye_laterality(pil_image, selected_eye=eye)

        # 3) Inferencia con EfficientNetB0
        input_tensor = preprocess(pil_image).unsqueeze(0)

        with torch.no_grad():
            output = model(input_tensor)
            probabilities = torch.nn.functional.softmax(output[0], dim=0)

            predicted_idx = torch.argmax(probabilities).item()
            confidence = probabilities[predicted_idx].item()

            # Confianza muy baja = la red "no se atreve" a opinar; mejor devolverla
            if confidence < 0.40:
                raise HTTPException(
                    status_code=400,
                    detail="La imagen no parece ser un fondo de ojo válido (confianza del modelo muy baja). Intente con una imagen médica clara."
                )

            raw_grade = CLASS_NAMES.get(predicted_idx, "Unknown")
            formatted_grade = format_class_name(raw_grade)

        return {
            "model_version": "EfficientNetB0-PyTorch v2.0 (OpenCV Quality Pipeline)",
            "processed_at": datetime.datetime.now().isoformat(),
            "grade": formatted_grade,
            "confidence": float(round(confidence, 4)),
            "recommendation": generate_recommendation(formatted_grade),
            "image_quality": {
                "sharpness_score": quality_eval["sharpness_score"],
                "brightness_score": quality_eval["brightness_score"],
                "status": "PASS"
            },
            "anatomy_validation": {
                "detected_eye": anatomy_eval["detected_eye"],
                "matches_selected_eye": anatomy_eval["matches_selected_eye"],
                "warning": anatomy_eval["warning"]
            },
            "lesions_detected": {
                # Estimación burda a partir de la clase: no sustituye al oftalmólogo
                "microaneurysms": raw_grade not in ["No_DR"],
                "hemorrhages": raw_grade in ["Moderate", "Severe", "Proliferate_DR"],
                "hard_exudates": raw_grade in ["Moderate", "Severe", "Proliferate_DR"],
                "neovascularization": raw_grade == "Proliferate_DR"
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error procesando la imagen: {e}")
        raise HTTPException(status_code=500, detail=f"Error en el procesamiento: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
