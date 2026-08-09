# Etapa de construcción: generamos el bundle estático
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias primero (aprovechando el caché de capas)
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir
COPY . .
RUN npm run build

# Etapa de producción: servimos el bundle con nginx
FROM nginx:stable-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
