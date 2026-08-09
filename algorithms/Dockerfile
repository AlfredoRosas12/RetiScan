# ============================================================
#  RetiScan - AI Microservice (FastAPI + PyTorch)
#  Multi-stage build para reducir tamaño de imagen final
# ============================================================

# ── Stage 1: Dependencias ──────────────────────────────────
FROM python:3.10-slim AS deps

WORKDIR /app

COPY requirements.txt .

# PyTorch CPU: imagen ~1GB en vez de ~5GB con GPU
RUN pip install --no-cache-dir -r requirements.txt \
    --extra-index-url https://download.pytorch.org/whl/cpu

# ── Stage 2: Imagen final de producción ─────────────────────
FROM python:3.10-slim AS runner

WORKDIR /app

# Copiar dependencias instaladas
COPY --from=deps /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

# Crear usuario sin privilegios
RUN groupadd -r retiscan && useradd -r -g retiscan -d /app -s /sbin/nologin retiscan

# Copiar código de la aplicación
COPY . .

# Asegurar permisos
RUN chown -R retiscan:retiscan /app

USER retiscan

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=30s \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/')" || exit 1

# Levantar FastAPI con uvicorn
# workers=1: modelo PyTorch es pesado en memoria, 1 worker es suficiente
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
