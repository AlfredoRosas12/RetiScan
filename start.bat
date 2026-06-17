@echo off
echo ========================================================
echo   Iniciando los servidores de RetiScan en Docker...
echo ========================================================
echo.

docker compose up -d

echo.
echo ========================================================
echo   TODOS LOS SERVICIOS ESTAN EN LINEA
echo ========================================================
echo   Para acceder, usa los siguientes enlaces:
echo.
echo   * Landing Page (React):    http://localhost:5173
echo   * App Web (Flutter PWA):   http://localhost:5174
echo   * API (Node.js):           http://localhost:3000
echo   * IA (Python FastAPI):     http://localhost:8000/docs
echo   * Base de Datos (Adminer): http://localhost:8080
echo ========================================================
echo.
echo Puedes presionar cualquier tecla para cerrar esta ventana.
pause >nul
