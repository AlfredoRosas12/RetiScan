: '
@echo off
echo ========================================================
echo   Deteniendo los servicios de RetiScan (Windows)...
echo ========================================================
docker compose down
echo ========================================================
echo   TODOS LOS SERVICIOS SE HAN DETENIDO CON EXITO (Win)
echo ========================================================
pause >nul
exit /b
'

#!/bin/bash
echo "========================================================"
echo "  Deteniendo los servicios de RetiScan en Docker (Linux)..."
echo "========================================================"
docker compose down
echo ""
echo "========================================================"
echo "  TODOS LOS SERVICIOS SE HAN DETENIDO CON EXITO"
echo "========================================================"
echo ""
read -p "Presiona Enter para cerrar..."