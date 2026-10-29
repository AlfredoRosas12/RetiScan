"""
Genera las figuras del artículo a partir del dataset real y del modelo de la app.

  fig1.png  Muestras del dataset (una por clase) tras recorte de bordes + CLAHE
  fig2.png  Matriz de confusión normalizada (5x5) sobre el conjunto de prueba
  fig3.png  Curvas ROC one-vs-rest por clase + AUC macro
  metrics.json      Métricas reales para citar en el texto del documento
  predictions.csv   Predicción por imagen del conjunto de prueba

Dataset esperado (Kaggle: sovitrath/diabetic-retinopathy-224x224-2019-data):
  <data-dir>/colored_images/{No_DR,Mild,Moderate,Severe,Proliferate_DR}/*.png

Uso:
  python algorithms/scripts/generate_figures.py --data-dir <ruta> --out-dir docs/figures
"""
import argparse
import json
import os
from pathlib import Path

import cv2
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import torch
from PIL import Image
from sklearn.metrics import (accuracy_score, auc, classification_report,
                             cohen_kappa_score, confusion_matrix, roc_curve)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import label_binarize
from torchvision import transforms

DEFAULT_MODEL = Path(__file__).resolve().parent.parent / "models" / "retiscan_efficientnetb0_completo.pt"

# Carpeta del dataset -> grado clínico (escala APTOS 0-4)
FOLDER_TO_GRADE = {"No_DR": 0, "Mild": 1, "Moderate": 2, "Severe": 3, "Proliferate_DR": 4}
GRADE_LABELS = ["0 · Sin RD", "1 · Leve", "2 · Moderada", "3 · Severa", "4 · Proliferativa"]

# El modelo se entrenó con ImageFolder, que ordena las clases alfabéticamente:
# [Mild, Moderate, No_DR, Proliferate_DR, Severe]. Este índice reordena sus
# salidas a la escala clínica 0-4.
MODEL_IDX_FOR_GRADE = [2, 0, 1, 4, 3]

# Mismo preprocesamiento que algorithms/main.py usa en producción
PREPROCESS = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def load_dataset(data_dir):
    root = Path(data_dir) / "colored_images"
    paths, grades = [], []
    for folder, grade in FOLDER_TO_GRADE.items():
        for p in sorted((root / folder).glob("*.png")):
            paths.append(str(p))
            grades.append(grade)
    if not paths:
        raise SystemExit(f"No se encontraron imágenes en {root}")
    return np.array(paths), np.array(grades)


def split_test(paths, grades, seed, val_size, test_size):
    # División estratificada train / val / test con semilla fija
    rest_p, test_p, rest_g, test_g = train_test_split(
        paths, grades, test_size=test_size, stratify=grades, random_state=seed)
    train_p, val_p, _, _ = train_test_split(
        rest_p, rest_g, test_size=val_size / (1 - test_size), stratify=rest_g, random_state=seed)
    return test_p, test_g, len(train_p), len(val_p)


def crop_and_clahe(path):
    # Recorte del borde negro alrededor de la retina + CLAHE sobre la luminancia
    img = cv2.cvtColor(cv2.imread(path), cv2.COLOR_BGR2RGB)
    mask = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY) > 7
    if mask.any():
        rows, cols = np.where(mask.any(axis=1))[0], np.where(mask.any(axis=0))[0]
        img = img[rows[0]:rows[-1] + 1, cols[0]:cols[-1] + 1]
    lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    lab[:, :, 0] = clahe.apply(lab[:, :, 0])
    return cv2.resize(cv2.cvtColor(lab, cv2.COLOR_LAB2RGB), (224, 224))


def fig1_samples(paths, grades, seed, out):
    rng = np.random.default_rng(seed)
    fig, axes = plt.subplots(1, 5, figsize=(15, 3.6))
    for grade, ax in enumerate(axes):
        ax.imshow(crop_and_clahe(rng.choice(paths[grades == grade])))
        ax.set_title(f"Clase {GRADE_LABELS[grade]}", fontsize=11)
        ax.axis("off")
    fig.tight_layout()
    fig.savefig(out, dpi=300, bbox_inches="tight")
    plt.close(fig)


@torch.no_grad()
def predict(model, paths, batch_size=32):
    probs = []
    for i in range(0, len(paths), batch_size):
        batch = torch.stack([PREPROCESS(Image.open(p).convert("RGB")) for p in paths[i:i + batch_size]])
        probs.append(torch.softmax(model(batch), dim=1).numpy())
    return np.concatenate(probs)[:, MODEL_IDX_FOR_GRADE]


def fig2_confusion(y_true, y_pred, out):
    cm = confusion_matrix(y_true, y_pred, labels=range(5), normalize="true")
    fig, ax = plt.subplots(figsize=(7, 6))
    sns.heatmap(cm, annot=True, fmt=".2f", cmap="Blues", vmin=0, vmax=1,
                xticklabels=GRADE_LABELS, yticklabels=GRADE_LABELS, ax=ax)
    ax.set_xlabel("Clase predicha")
    ax.set_ylabel("Clase real")
    plt.setp(ax.get_xticklabels(), rotation=30, ha="right")
    fig.tight_layout()
    fig.savefig(out, dpi=300, bbox_inches="tight")
    plt.close(fig)
    return cm


def fig3_roc(y_true, probs, out):
    y_bin = label_binarize(y_true, classes=range(5))
    fig, ax = plt.subplots(figsize=(7, 6))
    per_class = {}
    for grade in range(5):
        fpr, tpr, _ = roc_curve(y_bin[:, grade], probs[:, grade])
        per_class[grade] = auc(fpr, tpr)
        ax.plot(fpr, tpr, lw=2, label=f"Clase {GRADE_LABELS[grade]} (AUC = {per_class[grade]:.3f})")
    macro = float(np.mean(list(per_class.values())))
    ax.plot([0, 1], [0, 1], "k--", lw=1)
    ax.set_xlabel("Tasa de falsos positivos (1 − Especificidad)")
    ax.set_ylabel("Tasa de verdaderos positivos (Sensibilidad)")
    ax.set_title(f"Curvas ROC one-vs-rest · AUC macro = {macro:.3f}")
    ax.legend(loc="lower right", fontsize=9)
    fig.tight_layout()
    fig.savefig(out, dpi=300, bbox_inches="tight")
    plt.close(fig)
    return per_class, macro


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--data-dir", required=True)
    ap.add_argument("--model", default=str(DEFAULT_MODEL))
    ap.add_argument("--out-dir", default="figures")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--val-size", type=float, default=0.15)
    ap.add_argument("--test-size", type=float, default=0.15)
    ap.add_argument("--split-json", help="JSON con los nombres de archivo de train/val/test del entrenamiento")
    args = ap.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    out = Path(args.out_dir)

    paths, grades = load_dataset(args.data_dir)
    if args.split_json:
        # División exacta usada en el entrenamiento: {"train": [...], "val": [...], "test": [...]}
        split = json.loads(Path(args.split_json).read_text())
        is_test = np.isin([Path(p).name for p in paths], split["test"])
        test_p, test_g = paths[is_test], grades[is_test]
        n_train, n_val = len(split["train"]), len(split["val"])
    else:
        test_p, test_g, n_train, n_val = split_test(paths, grades, args.seed, args.val_size, args.test_size)
    print(f"Dataset: {len(paths)} imágenes | train {n_train} · val {n_val} · test {len(test_p)}")

    fig1_samples(test_p, test_g, args.seed, out / "fig1.png")

    model = torch.load(args.model, weights_only=False, map_location="cpu")
    if hasattr(model, "module"):
        model = model.module
    model.eval()
    probs = predict(model, test_p)
    y_pred = probs.argmax(axis=1)

    cm = fig2_confusion(test_g, y_pred, out / "fig2.png")
    per_class_auc, macro_auc = fig3_roc(test_g, probs, out / "fig3.png")

    report = classification_report(test_g, y_pred, labels=range(5), target_names=GRADE_LABELS,
                                   output_dict=True, zero_division=0)
    metrics = {
        "model": Path(args.model).name,
        "split": {"seed": args.seed, "train": n_train, "val": n_val, "test": len(test_p),
                  "method": args.split_json or "stratified train_test_split (scikit-learn)"},
        "accuracy": accuracy_score(test_g, y_pred),
        "quadratic_kappa": cohen_kappa_score(test_g, y_pred, weights="quadratic"),
        "roc_auc_macro_ovr": macro_auc,
        "roc_auc_per_class": {GRADE_LABELS[g]: v for g, v in per_class_auc.items()},
        "confusion_matrix_normalized": cm.round(4).tolist(),
        "per_class": {k: v for k, v in report.items() if k in GRADE_LABELS},
    }
    (out / "metrics.json").write_text(json.dumps(metrics, indent=2, ensure_ascii=False))

    with open(out / "predictions.csv", "w") as f:
        f.write("image,true_grade,pred_grade," + ",".join(f"p{g}" for g in range(5)) + "\n")
        for p, t, y, pr in zip(test_p, test_g, y_pred, probs):
            f.write(f"{Path(p).name},{t},{y}," + ",".join(f"{x:.5f}" for x in pr) + "\n")

    print(json.dumps({k: metrics[k] for k in ("accuracy", "quadratic_kappa", "roc_auc_macro_ovr")}, indent=2))
    print(f"Figuras guardadas en {out.resolve()}")


if __name__ == "__main__":
    main()
