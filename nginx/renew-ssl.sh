#!/bin/bash
# ============================================================
#  RetiScan - Renovación de certificados SSL
#  Ejecutar periódicamente o como cron job
#  Uso: sudo bash nginx/renew-ssl.sh
# ============================================================

set -euo pipefail

DOMAIN="retiscan.com"
WEBROOT="/var/www/certbot"
LOG_FILE="/var/log/retiscan-ssl-renewal.log"

echo "$(date '+%Y-%m-%d %H:%M:%S') - Iniciando renovación SSL..." >> "${LOG_FILE}" 2>/dev/null || true

# Verificar si hay certificados por renovar
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
if [ ! -d "${CERT_DIR}" ]; then
    echo "ERROR: No se encontraron certificados en ${CERT_DIR}"
    echo "Ejecuta primero: sudo bash nginx/init-ssl.sh <email>"
    exit 1
fi

# Verificar si el certificado expira en menos de 30 días
EXPIRY=$(openssl x509 -enddate -noout -in "${CERT_DIR}/fullchain.pem" | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "${EXPIRY}" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "${EXPIRY}" +%s 2>/dev/null)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

echo "Días hasta expiración: ${DAYS_LEFT}"

if [ "${DAYS_LEFT}" -gt 30 ]; then
    echo "Certificado válido por ${DAYS_LEFT} días más. No es necesario renovar."
    exit 0
fi

echo "Certificado expira en ${DAYS_LEFT} días. Renovando..."

# Renovar con certbot webroot
docker compose -f compose.prod.yml exec -T certbot certbot renew \
    --webroot \
    -w "${WEBROOT}" \
    --quiet

# Recargar nginx para aplicar nuevos certificados
echo "Recargando nginx..."
docker compose -f compose.prod.yml exec -T nginx nginx -s reload

echo "$(date '+%Y-%m-%d %H:%M:%S') - Renovación completada exitosamente" >> "${LOG_FILE}" 2>/dev/null || true
echo "Renovación SSL completada."
