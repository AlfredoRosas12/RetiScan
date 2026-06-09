# Manual de Colaboración y Flujo de Trabajo

Este documento describe el estándar de trabajo en Git para el proyecto RetiScan. Seguir estas pautas asegura una integración limpia de los componentes de IA, backend y las aplicaciones de usuario.

---

## 🛠️ 1. Configuración Inicial

Para comenzar a trabajar y sincronizar tu entorno local con el repositorio principal, ejecuta los siguientes comandos en tu terminal:

```bash
git fetch origin
git checkout develop
```

---

## 💻 2. Ciclo de Trabajo Diario

Antes de iniciar cualquier desarrollo (nueva función, diseño o corrección), sigue este flujo para evitar conflictos:

1.  **Cambia a tu rama de trabajo asignada:**
    *   **Frontend (Flutter):** `git checkout feature/app`
    *   **Backend (API):** `git checkout feature/api`
    *   **IA (Algoritmos):** `git checkout feature/algorithms`
    *   **Landing Page:** `git checkout feature/page`

2.  **Sincroniza tu rama local:**
    Obtén los últimos cambios antes de empezar a programar:
    ```bash
    git pull origin feature/NOMBRE_DE_TU_RAMA
    ```

3.  **Realiza tus cambios y guarda el progreso:**
    ```bash
    git add .
    git commit -m "Descripción breve y clara del cambio realizado"
    ```

4.  **Sube tus avances al servidor:**
    ```bash
    git push origin feature/NOMBRE_DE_TU_RAMA
    ```

---

## 🚀 3. Integración de Código (Pull Request)

Cuando una funcionalidad esté terminada y deba unirse al proyecto general:

1.  Dirígete al repositorio en GitHub y selecciona **"Compare & pull request"**.
2.  **Configuración de destino:**
    *   **Base:** `develop` (Aquí se integran todas las pruebas).
    *   **Compare:** Tu rama de trabajo (ej. `feature/app`).
3.  **Revisión en Equipo:** Asigna al menos a un compañero como **Reviewer**. El código solo se integrará una vez que haya sido revisado y aprobado por otro miembro del equipo.

---

## 🔄 4. Sincronización con cambios del equipo

Si un compañero ha integrado código nuevo en `develop` y necesitas incorporarlo a tu trabajo actual:

```bash
# 1. Actualiza tu rama develop local
git checkout develop
git pull origin develop

# 2. Integra los cambios en tu rama de trabajo
git checkout feature/NOMBRE_DE_TU_RAMA
git merge develop
```

*Nota: Si se presentan conflictos, resuélvelos en tu editor de código, realiza un commit de confirmación y continúa con tu desarrollo.*

---

## 📌 Gestión de Ramas

*   **`main`**: Rama de producción. Solo se utiliza para versiones finales y entregas definitivas.
*   **`develop`**: Nuestro laboratorio de integración. Aquí es donde se fusiona el trabajo de todo el equipo para validar el funcionamiento global del sistema.
