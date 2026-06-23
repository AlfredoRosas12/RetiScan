# RetiScan

![Status](https://img.shields.io/badge/Status-En__Desarrollo-orange?style=flat-for-the-badge)
![Plataforma](https://img.shields.io/badge/Plataforma-Multiplataforma__PWA-blue?style=flat-for-the-badge)

**RetiScan** es un sistema médico avanzado diseñado para la detección temprana de la retinopatía diabética. Utilizando inteligencia artificial, la plataforma analiza imágenes de fondo de ojo para identificar signos de la enfermedad de manera rápida y eficiente, facilitando el trabajo de los profesionales de la salud.

---

## 🌟 Funciones Principales

*   **Detección Asíncrona:** El sistema procesa las imágenes en segundo plano, permitiendo que el médico continúe con otras tareas mientras se genera el diagnóstico.
*   **Gestión de Expedientes:** Acceso seguro y organizado a la información clínica de los pacientes.
*   **Acceso Multidispositivo:** Funciona como una aplicación web progresiva (PWA), permitiendo su uso tanto en computadoras como en dispositivos móviles sin necesidad de instalaciones complejas.
*   **Seguridad y Privacidad:** Protección de datos sensibles mediante sistemas de autenticación de dos pasos y control estricto de accesos según el rol (médico o paciente).

---

## 🏗️ Estructura del Proyecto

El ecosistema RetiScan se divide en cuatro componentes clave que trabajan en conjunto:

1.  **Portal Informativo (`/page`):** Sitio web de presentación donde se explica el propósito del proyecto y sus beneficios.
2.  **Aplicación de Escaneo (`/app`):** La herramienta principal para médicos y pacientes, optimizada para la captura de imágenes y consulta de resultados.
3.  **Núcleo del Sistema (`/api`):** El cerebro que coordina la base de datos, la seguridad y el procesamiento inteligente de las imágenes.
4.  **Motor de Inteligencia Artificial (`/algorithms`):** Servicio de inferencia basado en PyTorch y FastAPI para el análisis de imágenes retinianas mediante el modelo EfficientNetB0.

---

## 🛠️ Herramientas Utilizadas

*   **Frontend Aplicativo:** Flutter (Dart).
*   **Página Web:** React, Vite, TypeScript.
*   **Backend y Lógica:** Node.js, Express.js.
*   **Inteligencia Artificial:** Python, FastAPI, PyTorch (EfficientNetB0).
*   **Base de Datos:** PostgreSQL.
*   **Administración de BD:** Adminer.
*   **Infraestructura:** Docker y Docker Compose.

---

## 🚀 Cómo Iniciar el Proyecto

Para ejecutar todo el ecosistema de RetiScan de manera local, solo necesitas tener instalados **Docker** y **Docker Compose**.

1.  **Clonar este repositorio:**
    ```bash
    git clone https://github.com/AlfredoRosas12/RetiScan.git
    cd RetiScan
    ```

2.  **Levantar los servicios:**
    ```bash
    docker compose up -d
    ```

3.  **Acceder a las aplicaciones:**

    | Servicio | URL |
    |----------|-----|
    | Landing Page (React) | http://localhost:5173 |
    | App Web (Flutter PWA) | http://localhost:5174 |
    | API (Node.js) | http://localhost:3000 |
    | IA (Python FastAPI) | http://localhost:8000/docs |
    | Base de Datos (Adminer) | http://localhost:8080 |

---

## 📝 Notas de Desarrollo

Cada módulo cuenta con su propio archivo `README.md` detallado para desarrolladores que deseen profundizar en la configuración técnica específica de cada capa.