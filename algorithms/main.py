# pyrefly: ignore [missing-import]
from fastapi import FastAPI, UploadFile, File, HTTPException
# pyrefly: ignore [missing-import]
import uvicorn
from io import BytesIO
# pyrefly: ignore [missing-import]
from PIL import Image
# pyrefly: ignore [missing-import]
import torch
# pyrefly: ignore [missing-import]
from torchvision import transforms
import datetime
import os

app = FastAPI(title="AI-RetiScan", description="Microservicio de Inferencia de Retinopatía Diabética", version="1.0")

# 1. Cargar el modelo en memoria al iniciar el servidor
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
        # Si el modelo fue guardado con DataParallel (entrenado en GPU),
        # necesitamos extraer el modelo base para que funcione en CPU
        if hasattr(model, 'module'):
            model = model.module
        model = model.to(torch.device("cpu"))
        model.eval()
        print("Modelo cargado exitosamente.")
except Exception as e:
    print(f"Error al cargar el modelo: {e}")
    model = None

# 2. Definir preprocesamiento exacto
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# 3. Definir nombres de clases
CLASS_NAMES = {
    0: "Mild",
    1: "Moderate",
    2: "No_DR",
    3: "Proliferate_DR",
    4: "Severe"
}

def format_class_name(raw_name: str) -> str:
    """Adapta el nombre de la clase para que sea idéntico al que esperaba Node.js"""
    if raw_name == "No_DR":
        return "No DR"
    elif raw_name == "Proliferate_DR":
        return "Proliferative DR"
    return raw_name

def generate_recommendation(grade: str) -> str:
    if grade == "No DR":
        return "Seguimiento anual recomendado."
    return "Referir al oftalmólogo en menos de 4 semanas."

@app.get("/")
def read_root():
    return {"status": "AI-RetiScan Service is Running"}

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="El modelo no está cargado en el servidor.")
    
    try:
        # Leer imagen
        contents = await image.read()
        pil_image = Image.open(BytesIO(contents)).convert("RGB")
        
        # Preprocesar (agrega una dimensión extra para el batch_size=1)
        input_tensor = preprocess(pil_image).unsqueeze(0)
        
        # Inferencia sin calcular gradientes (más rápido y consume menos RAM)
        with torch.no_grad():
            output = model(input_tensor)
            # Aplicar Softmax para obtener probabilidades
            probabilities = torch.nn.functional.softmax(output[0], dim=0)
            
            # Obtener la clase con mayor probabilidad
            predicted_idx = torch.argmax(probabilities).item()
            confidence = probabilities[predicted_idx].item()
            
            # Validación de "Out of Distribution"
            if confidence < 0.45:
                raise HTTPException(
                    status_code=400, 
                    detail="La imagen no parece ser un fondo de ojo válido (confianza muy baja). Intente con una imagen médica clara."
                )
            
            raw_grade = CLASS_NAMES.get(predicted_idx, "Unknown")
            formatted_grade = format_class_name(raw_grade)
            
        return {
            "model_version": "EfficientNetB0-PyTorch v1.0",
            "processed_at": datetime.datetime.now().isoformat(),
            "grade": formatted_grade,
            "confidence": float(round(confidence, 4)),
            "recommendation": generate_recommendation(formatted_grade),
            "lesions_detected": {
                # Mantenemos las lesiones generadas de forma mock o por defecto 
                # ya que el modelo EfficientNetB0 básico clasifica la imagen global
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
