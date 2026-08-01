FROM python:3.10-slim

WORKDIR /app

# Primero las dependencias, así Docker puede cachear la capa
# y no re-instalar todo cada vez que cambiamos el código.
COPY requirements.txt .

# PyTorch en CPU: de esta forma la imagen pesa ~1GB en vez de ~5GB.
# Para esta app no necesitamos GPU porque la inferencia es por petición.
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Ahora sí copiamos el resto del proyecto
COPY . .

EXPOSE 8000

# Levantamos el microservicio de FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
