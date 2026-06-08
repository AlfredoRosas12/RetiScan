# 📘 Manual de Git: Flujo de Trabajo en RetiScan

¡Hola, equipo! Para mantener el proyecto integrador organizado, evitar que borremos código por accidente y asegurar que la integración de la IA, el backend y la app sea limpia, las ramas \`main\` y \`develop\` ahora están protegidas. Nadie puede hacer push directo a ellas; todo cambio debe pasar por revisión en GitHub.

---

## 🛠️ 1. Configuración Inicial (Solo una vez)
Para bajarte la rama de pruebas a tu máquina local y estar en sintonía con el repositorio general, ejecuta en tu terminal:
\`\`\`bash
git fetch origin
git checkout develop
\`\`\`

---

## 💻 2. Ciclo de Trabajo Diario
Cuando vayas a programar una función, diseñar una interfaz o avanzar en tu módulo (\`app\`, \`api\`, \`algorithms\`, \`page\`):

1. **Muévete a tu rama de trabajo asignada:**
   * Si trabajas en la app de Flutter: \`git checkout feature/app\`
   * Si trabajas en el backend: \`git checkout feature/api\`
   * Si trabajas en los modelos de IA: \`git checkout feature/algorithms\`
   * Si trabajas en la Landing Page: \`git checkout feature/page\`

2. **Sincronízala antes de tirar una sola línea de código (Evita trabajar sobre ramas viejas):**
   \`\`\`bash
   git pull origin feature/TU_RAMA
   \`\`\`

3. **Programa de forma normal y haz tus commits:**
   \`\`\`bash
   git add .
   git commit -m "Explicación breve de lo que programaste o corregiste"
   \`\`\`

4. **Sube tus avances al servidor de GitHub:**
   \`\`\`bash
   git push origin feature/TU_RAMA
   \`\`\`

---

## 🚀 3. Cómo Integrar tu Código al Proyecto (Crear un Pull Request)
Cuando termines una funcionalidad y desees que se una al resto de RetiScan, entra a GitHub desde el navegador:

1. Verás un banner con un botón verde que dice **"Compare & pull request"**. Dale clic.
2. **CONFIGURACIÓN CRUCIAL (Fíjate bien):**
   * **Base:** cambia \`main\` por **\`develop\`** 👈 (Aquí juntamos todo para calar el software).
   * **Compare:** Elige **tu rama de trabajo** (ej. \`feature/app\`).
3. Ponle un título descriptivo (ej. *“Integración de endpoints de la API”*), asigna a tus compañeros como **Reviewers** en el panel derecho y dale a **"Create pull request"**.
4. 🔒 **Aprobación en equipo:** El botón de *Merge* estará gris para ti. Otro miembro del equipo debe entrar a la pestaña *Files changed*, revisar que el código compile bien y darle al botón **Approve**. Una vez aprobado, ya se puede hacer el Merge final.

---

## 🔄 4. Sincronizar tu Rama Local con los Cambios del Equipo
Cuando el Pull Request de un compañero se apruebe (por ejemplo, si se suben cambios al backend o a la IA), la rama \`develop\` remota tendrá código nuevo que tú no tienes. Para inyectarle lo nuevo a tu rama sin romper lo que tú estás programando, ejecuta:

\`\`\`bash
# 1. Ve a develop y jala lo nuevo que se fusionó
git checkout develop
git pull origin develop

# 2. Regresa a tu rama e inyéctale la actualización
git checkout feature/TU_RAMA
git merge develop
\`\`\`
Si el sistema detecta conflictos, los resuelves directamente en tu editor (VS Code, Android Studio, etc.), haces un commit normal y sigues desarrollando.

---
🎯 **develop:** Nuestro laboratorio. Aquí uniremos la App de Flutter, la API de PostgreSQL y los algoritmos de IA para validar que el sistema funcione al 100%.
🎯 **main:** Versión de producción congelada. Sólo se tocará al final del cuatrimestre para la entrega definitiva con los profesores de la UTCV.
