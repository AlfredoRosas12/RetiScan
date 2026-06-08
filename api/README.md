# RetiScan API — Núcleo de Operaciones

Este repositorio contiene el motor lógico y la gestión de datos de la plataforma RetiScan. La API actúa como el puente central entre las aplicaciones de usuario y la base de datos, garantizando la seguridad y fluidez del sistema.

---

## 🛠️ Funciones del Servicio

*   **Seguridad y Acceso:** Gestiona el registro, inicio de sesión y la protección de datos mediante llaves de acceso digitales.
*   **Gestión Clínica:** Control y organización de los expedientes médicos, pacientes y resultados de escaneo.
*   **Comunicación:** Sistema de notificaciones por correo para informar a los usuarios sobre eventos importantes.
*   **Documentación Interactiva:** Incluye un portal para que los desarrolladores puedan consultar y probar los canales de comunicación de la API.

---

## 🏗️ Tecnologías Clave

*   **Motor:** Node.js y Express.
*   **Base de Datos:** PostgreSQL.
*   **Seguridad:** Encriptación avanzada para contraseñas y tokens de sesión.
*   **Notificaciones:** Servicio de integración de correo electrónico.

---

## 🚀 Ejecución y Despliegue

Para poner en marcha este servicio junto con el resto del ecosistema, te recomendamos consultar la guía de inicio rápido en el **[README principal del proyecto](../README.md)** utilizando Docker.

Si necesitas realizar ajustes específicos de desarrollo para este módulo:
1.  Configura las variables de entorno en un archivo `.env`.
2.  Instala las dependencias necesarias.
3.  Inicia el servidor en modo desarrollo.

*(Para más detalles técnicos, consulta el archivo de configuración `.env.example` y el historial de cambios.)*
