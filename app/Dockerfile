# ── Build Stage ──────────────────────────────────────────────
FROM debian:stable-slim AS build

# Instalar dependencias necesarias para Flutter y compilación
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    libglu1-mesa \
    ca-certificates \
    wget \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

# Descargar e instalar SDK de Flutter
ARG FLUTTER_VERSION="stable"
RUN git clone https://github.com/flutter/flutter.git -b ${FLUTTER_VERSION} /opt/flutter
ENV PATH="/opt/flutter/bin:/opt/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Forzar la descarga de artefactos y verificar instalación
RUN flutter doctor -v
RUN flutter config --enable-web

WORKDIR /app

# Copiar configuración de dependencias
COPY pubspec.yaml ./
# Se opcionalmente elimina pubspec.lock para evitar conflictos de versiones si falla
# RUN rm -f pubspec.lock 

RUN flutter pub get

# Copiar código y construir para web
COPY . .
RUN flutter build web --release

# ── Production Stage ─────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Copiar archivos estáticos generados por Flutter
COPY --from=build /app/build/web /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
