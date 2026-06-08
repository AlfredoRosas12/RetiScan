# ── Build Stage ──────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias primero (aprovechando el caché de capas)
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir
# Asegúrese de que .dockerignore excluya node_modules locales
COPY . .
RUN npm run build

# ── Production Stage ─────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Copiar archivos estáticos del build anterior
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
