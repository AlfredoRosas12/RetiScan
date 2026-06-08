# PWA RetiScan

Aplicacion movil y progresiva (PWA) desarrollada con Flutter para la plataforma RetiScan. Esta aplicacion permite a los usuarios interactuar con el sistema de deteccion de retinopatia diabetica desde dispositivos moviles y navegadores web.

## Caracteristicas y Tecnologias

La aplicacion esta construida sobre el SDK de Flutter e integra diversos servicios para una experiencia completa:

- Nucleo: Flutter 3.x.
- Backend como Servicio (BaaS): Firebase (Auth para gestion de usuarios, Firestore para base de datos en tiempo real y Cloud Storage para archivos).
- Gestion de Estado: Provider.
- Interfaz de Usuario: Soporte para SVG, graficos estadisticos con Syncfusion y notificaciones locales.
- Utilidades: Seleccion de imagenes, almacenamiento persistente local y generacion de reportes en PDF.

## Requisitos Previos

- SDK de Flutter instalado y configurado en el PATH.
- Android Studio o Xcode (para compilacion nativa).
- Herramientas de Firebase CLI (opcional, para configuracion de servicios).

## Configuracion e Instalacion

1. Obtenga las dependencias del proyecto:
   ```bash
   flutter pub get
   ```

2. Configure los archivos de Firebase:
   Asegurese de incluir los archivos de configuracion correspondientes (`google-services.json` para Android y `GoogleService-Info.plist` para iOS) en sus rutas respectivas.

## Ejecucion

Para ejecutar el proyecto en un emulador o dispositivo conectado:

```bash
flutter run
```

Para compilar versiones de produccion:

- Android: `flutter build apk`
- iOS: `flutter build ios`
- Web: `flutter build web`

## Estructura del Proyecto

- `lib/`: Contiene el codigo fuente de la aplicacion (pantallas, modelos, proveedores y servicios).
- `assets/`: Recursos graficos de la plataforma.
- `android/ios/web/`: Configuraciones especificas por plataforma.
