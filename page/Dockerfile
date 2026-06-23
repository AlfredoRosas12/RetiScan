# ── Build Stage ──────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias primero (aprovechando el caché de capas)
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir
COPY . .
RUN npm run build

# ── Production Stage ─────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Nginx security headers
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Security Headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    add_header Referrer-Policy "strict-origin-when-cross-origin" always; \
    add_header Content-Security-Policy "default-src '\''self'\''; script-src '\''self'\'' '\''unsafe-inline'\''; style-src '\''self'\'' '\''unsafe-inline'\''; img-src '\''self'\'' data: https:; font-src '\''self'\'' data:;" always; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos del build anterior
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
