#!/bin/bash
# ============================================================
#  RetiScan - Inicialización SSL con Let's Encrypt
#  Ejecutar en el VPS después del primer deploy
#  Uso: sudo bash nginx/init-ssl.sh tu-email@dominio.com
# ============================================================

set -euo pipefail

EMAIL="${1:-}"
DOMAIN="retiscan.com"
SUBDOMAINS="-d app.retiscan.com -d api.retiscan.com -d storage.retiscan.com"
WEBROOT="/var/www/certbot"
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"

if [ -z "$EMAIL" ]; then
    echo "Uso: sudo bash $0 <email-letsencrypt>"
    echo "Ejemplo: sudo bash $0 admin@retiscan.com"
    exit 1
fi

echo "=== RetiScan - Inicialización SSL ==="
echo "Dominio: ${DOMAIN}"
echo "Subdominios: app, api, storage"
echo "Email: ${EMAIL}"
echo ""

# Verificar que Docker esté corriendo
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker no está corriendo. Inicia Docker primero."
    exit 1
fi

# Crear directorios de certbot
echo "1. Creando directorios para certificados..."
mkdir -p "${WEBROOT}"
mkdir -p "$(pwd)/certbot-conf"

# Verificar si ya existen certificados
if [ -d "${CERT_DIR}" ]; then
    echo "ADVERTENCIA: Ya existen certificados en ${CERT_DIR}"
    read -p "¿Deseas renovarlos? (y/N): " CONFIRM
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
        echo "Omitido."
        exit 0
    fi
fi

# Paso 1: Obtener certificados con certbot standalone
echo ""
echo "2. Deteniendo nginx temporalmente para obtain cert..."
docker compose -f compose.prod.yml stop nginx 2>/dev/null || true

echo "3. Obteniendo certificados con Certbot..."
docker run --rm \
    -v "$(pwd)/certbot-conf:/etc/letsencrypt" \
    -v "${WEBROOT}:${WEBROOT}" \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    -d "${DOMAIN}" \
    ${SUBDOMAINS}

echo "4. Reiniciando nginx con certificados..."
docker compose -f compose.prod.yml up -d nginx

echo ""
echo "=== SSL inicializado correctamente ==="
echo "Certificados en: ${CERT_DIR}"
echo ""
echo "Para renovación automática, el servicio certbot ya está configurado."
echo "Para renovar manualmente: sudo bash nginx/renew-ssl.sh"
