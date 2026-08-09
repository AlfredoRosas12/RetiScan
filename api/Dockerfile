# RetiScan API - Dockerfile
# Construcción en dos etapas: dependencias en un contenedor temporal
# y solo lo necesario en la imagen final de producción.

# Etapa 1: instalamos las dependencias
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Etapa 2: imagen final de producción
FROM node:20-alpine AS runner
WORKDIR /app

# Corremos con un usuario sin privilegios por seguridad
RUN addgroup -S retiscan && adduser -S retiscan -G retiscan

# Copiamos únicamente lo que se necesita
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN chown -R retiscan:retiscan /app
USER retiscan

EXPOSE 3000

CMD ["node", "app.js"]
