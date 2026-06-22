: '
@echo off
docker compose up -d
echo ========================================================
echo   TODOS LOS SERVICIOS ESTAN EN LINEA (Windows)
echo ========================================================
echo   * Landing Page (React):    http://localhost:5173
echo   * App Web (Flutter PWA):   http://localhost:5174
echo   * API (Node.js):           http://localhost:3000
echo   * IA (Python FastAPI):     http://localhost:8000/docs
echo   * Base de Datos (Adminer): http://localhost:8080
echo ========================================================
pause >nul
exit /b
'

#!/bin/bash
echo "========================================================"
echo "  Iniciando los servidores de RetiScan en Docker (Linux)..."
echo "========================================================"
docker compose up -d
echo ""
echo "========================================================"
echo "  TODOS LOS SERVICIOS ESTAN EN LINEA"
echo "========================================================"
echo "  * Landing Page (React):    http://localhost:5173"
echo "  * App Web (Flutter PWA):   http://localhost:5174"
echo "  * API (Node.js):           http://localhost:3000"
echo "  * IA (Python FastAPI):     http://localhost:8000/docs"
echo "  * Base de Datos (Adminer): http://localhost:8080"
echo "========================================================"
echo ""
read -p "Presiona Enter para cerrar..."