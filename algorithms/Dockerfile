FROM python:3.10-slim

WORKDIR /app

# Copiamos primero el archivo de dependencias
COPY requirements.txt .

# Instalamos las dependencias. 
# Usamos el repositorio de CPU para PyTorch para que la imagen de Docker pese ~1GB en vez de ~5GB
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copiamos el resto del código
COPY . .

EXPOSE 8000

# Comando para arrancar el servidor de FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
