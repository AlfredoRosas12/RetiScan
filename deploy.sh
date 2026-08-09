# ============================================================
#  RetiScan - Script de Despliegue para Producción (VPS)
#  Docker Compose V2
#
#  Uso: sudo bash deploy.sh [comando]
#  Comandos: start | stop | restart | build | logs | status | backup
# ============================================================

set -euo pipefail

COMPOSE_FILE="compose.prod.yml"
ENV_FILE=".env.production"
PROJECT_NAME="retiscan"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step()  { echo -e "${BLUE}[STEP]${NC} $1"; }

# ── Verificaciones previas ──────────────────────────────────
check_prerequisites() {
    log_step "Verificando prerrequisitos..."

    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado. Instálalo con:"
        echo "  curl -fsSL https://get.docker.com | sh"
        exit 1
    fi

    # Verificar Docker Compose V2
    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose V2 no está disponible."
        echo "  Instala la última versión de Docker."
        exit 1
    fi

    # Verificar archivo .env.production
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Archivo ${ENV_FILE} no encontrado."
        echo "  Copia .env.production.example a .env.production y configúralo."
        exit 1
    fi

    # Verificar compose.prod.yml
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Archivo ${COMPOSE_FILE} no encontrado."
        exit 1
    fi

    log_info "Prerrequisitos OK."
}

# ── Comando: start ──────────────────────────────────────────
cmd_start() {
    check_prerequisites
    log_step "Actualizando código desde el repositorio..."
    git pull origin main || log_warn "No se pudo hacer git pull (¿sin conexión o sin cambios?)"

    log_step "Iniciando RetiScan en producción..."

    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

    # Limpiar imágenes Docker huérfanas para liberar disco
    log_step "Limpiando imágenes Docker huérfanas..."
    docker image prune -f --filter "until=24h" 2>/dev/null || true

    log_info "RetiScan iniciado correctamente."
    echo ""
    echo "  Landing:  https://retiscan.com"
    echo "  PWA:      https://app.retiscan.com"
    echo "  API:      https://api.retiscan.com"
    echo "  Swagger:  https://api.retiscan.com/api/docs"
    echo ""
    echo "  Para ver logs: sudo bash deploy.sh logs"
}

# ── Comando: stop ───────────────────────────────────────────
cmd_stop() {
    log_step "Deteniendo RetiScan..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    log_info "RetiScan detenido."
}

# ── Comando: restart ────────────────────────────────────────
cmd_restart() {
    cmd_stop
    sleep 2
    cmd_start
}

# ── Comando: build ──────────────────────────────────────────
cmd_build() {
    check_prerequisites
    log_step "Reconstruyendo imágenes Docker..."

    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --no-cache

    log_info "Imágenes reconstruidas. Usa 'restart' para aplicar."
}

# ── Comando: logs ───────────────────────────────────────────
cmd_logs() {
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f --tail=100
}

# ── Comando: status ─────────────────────────────────────────
cmd_status() {
    log_step "Estado de los servicios:"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    echo ""
    log_step "Uso de recursos:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" \
        $(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps -q) 2>/dev/null || true
}

# ── Comando: backup ─────────────────────────────────────────
cmd_backup() {
    BACKUP_DIR="/var/backups/retiscan/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"

    log_step "Creando backup en ${BACKUP_DIR}..."

    # Backup PostgreSQL
    log_info "Respaldando base de datos PostgreSQL..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T db \
        pg_dump -U "${DB_USER:-retiscan_prod}" "${DB_NAME:-retiscan_sql}" \
        | gzip > "$BACKUP_DIR/postgres.sql.gz"

    # Backup MinIO (solo metadata, los datos están en el volumen)
    log_info "Respaldando configuración de MinIO..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T minio \
        mc alias set local http://localhost:9000 "${S3_ACCESS_KEY}" "${S3_SECRET_KEY}" 2>/dev/null || true

    # Comprimir volumen de MinIO
    docker run --rm \
        -v retiscan_minio_data:/data:ro \
        -v "$BACKUP_DIR":/backup \
        alpine tar czf /backup/minio_data.tar.gz -C /data .

    # Comprimir volumen de PostgreSQL
    docker run --rm \
        -v retiscan_pg_data:/data:ro \
        -v "$BACKUP_DIR":/backup \
        alpine tar czf /backup/pg_data.tar.gz -C /data .

    # Crear manifiesto
    echo "Backup RetiScan - $(date)" > "$BACKUP_DIR/manifest.txt"
    echo "Fecha: $(date -Iseconds)" >> "$BACKUP_DIR/manifest.txt"
    echo "Archivos:" >> "$BACKUP_DIR/manifest.txt"
    ls -lh "$BACKUP_DIR" >> "$BACKUP_DIR/manifest.txt"

    log_info "Backup completado: ${BACKUP_DIR}"
    ls -lh "$BACKUP_DIR"
}

# ── Comando: ssl-init ───────────────────────────────────────
cmd_ssl_init() {
    EMAIL="${1:-}"
    if [ -z "$EMAIL" ]; then
        log_error "Uso: sudo bash deploy.sh ssl-init <email>"
        exit 1
    fi
    bash nginx/init-ssl.sh "$EMAIL"
}

# ── Comando: ssl-renew ──────────────────────────────────────
cmd_ssl_renew() {
    bash nginx/renew-ssl.sh
}

# ── Menú de ayuda ───────────────────────────────────────────
show_help() {
    echo "RetiScan - Script de Despliegue para Producción"
    echo ""
    echo "Uso: sudo bash deploy.sh <comando>"
    echo ""
    echo "Comandos:"
    echo "  start       Iniciar todos los servicios"
    echo "  stop        Detener todos los servicios"
    echo "  restart     Reiniciar todos los servicios"
    echo "  build       Reconstruir imágenes Docker"
    echo "  logs        Ver logs en tiempo real"
    echo "  status      Ver estado y recursos"
    echo "  backup      Crear backup de DB + MinIO"
    echo "  ssl-init    Inicializar certificados SSL"
    echo "  ssl-renew   Renovar certificados SSL"
    echo "  help        Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  sudo bash deploy.sh start"
    echo "  sudo bash deploy.sh ssl-init admin@retiscan.com"
    echo "  sudo bash deploy.sh backup"
}

# ── Punto de entrada ────────────────────────────────────────
case "${1:-help}" in
    start)      cmd_start ;;
    stop)       cmd_stop ;;
    restart)    cmd_restart ;;
    build)      cmd_build ;;
    logs)       cmd_logs ;;
    status)     cmd_status ;;
    backup)     cmd_backup ;;
    ssl-init)   cmd_ssl_init "${2:-}" ;;
    ssl-renew)  cmd_ssl_renew ;;
    help|--help|-h) show_help ;;
    *)
        log_error "Comando desconocido: $1"
        show_help
        exit 1
        ;;
esac
