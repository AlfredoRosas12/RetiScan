# API RetiScan

Backend central desarrollado en Node.js y Express para la plataforma de deteccion de retinopatia diabetica RetiScan. Este servicio gestiona la logica de negocio, autenticacion de usuarios y persistencia de datos.

## Arquitectura y Tecnologias

El proyecto utiliza las siguientes dependencias principales:

- Core: Express para el servidor web y enrutamiento.
- Base de datos: PostgreSQL mediante el cliente pg.
- Seguridad: JWT (JSON Web Tokens) para autenticacion y bcryptjs para el cifrado de contrasenas.
- Validacion: Express-validator para asegurar la integridad de las entradas.
- Documentacion: Swagger UI para la exposicion de endpoints.
- Correo: Nodemailer para gestion de notificaciones.

## Requisitos Previos

- Node.js (Version LTS recomendada)
- PostgreSQL
- Docker y Docker Compose (opcional para despliegue en contenedores)

## Configuracion del Entorno

Es necesario configurar un archivo .env en la raiz del directorio basandose en las necesidades del sistema. Asegurese de incluir las siguientes variables:

- PORT: Puerto de ejecucion del servidor.
- DATABASE_URL: Cadena de conexion a PostgreSQL.
- JWT_SECRET: Clave secreta para la firma de tokens.
- SMTP_HOST/USER/PASS: Configuracion para el servicio de correo.

## Instalacion y Ejecucion

### Desarrollo Local

1. Instale las dependencias:
   ```bash
   npm install
   ```

2. Inicialice la base de datos (asegurese de tener PostgreSQL en ejecucion):
   ```bash
   npm run init-db
   ```

3. Inicie el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

### Uso con Docker

Si prefiere utilizar Docker para el entorno:

```bash
docker-compose up --build
```

## Documentacion de la API

Una vez que el servidor este en funcionamiento, puede acceder a la documentacion interactiva de Swagger en:
`http://localhost:<PORT>/api-docs` (reemplace <PORT> por el configurado en su .env).
