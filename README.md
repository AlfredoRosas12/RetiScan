# RetiScan

Sistema de asistencia médica para la detección temprana de retinopatía diabética a través de imágenes de fondo de ojo. El proyecto utiliza un pipeline híbrido con visión por computadora (OpenCV) y un modelo de aprendizaje profundo (EfficientNetB0 en PyTorch) para validar la calidad de la toma y generar diagnósticos preliminares en segundo plano.

---

## Módulos del Sistema

- **`app/`**: Aplicación web progresiva (PWA en Flutter) para médicos y pacientes.
- **`api/`**: API REST en Node.js/Express para autenticación, gestión de expedientes, cola de tareas y almacenamiento de objetos S3 (MinIO).
- **`algorithms/`**: Microservicio en Python/FastAPI con OpenCV y PyTorch para el análisis de retinografías.
- **`page/`**: Landing page informativa desarrollada en React + Vite.

---

## Tecnologías

- **Frontend App:** Flutter (PWA)
- **Landing Page:** React, Vite, TypeScript
- **Backend:** Node.js, Express, PostgreSQL
- **Almacenamiento:** MinIO (S3)
- **Procesamiento e IA:** Python, OpenCV, FastAPI, PyTorch
- **Contenedores:** Docker / Docker Compose

---

## Despliegue Local

Requisitos: Docker y Docker Compose.

```bash
git clone https://github.com/AlfredoRosas12/RetiScan.git
cd RetiScan
docker compose up -d
```

### URLs de los servicios

| Servicio | Dirección |
|----------|-----------|
| Landing Page | http://localhost:5173 |
| PWA App | http://localhost:5174 |
| Backend API | http://localhost:3000 |
| Swagger API Docs | http://localhost:3000/api/docs |
| Servicio IA (FastAPI Docs) | http://localhost:8000/docs |
| MinIO Console | http://localhost:9001 |
| Base de Datos (Adminer) | http://localhost:8080 |

Las variables de entorno y credenciales por defecto se encuentran en el archivo `.env`.