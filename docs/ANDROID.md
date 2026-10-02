# Android

El proyecto `android` usa Capacitor 8 y comparte el frontend. Las operaciones locales usan `@capacitor-community/sqlite` con FK activas, centavos enteros y migraciones atómicas. IndexedDB se reserva para Web/PWA.

Requisitos: Node 22.12 o posterior, pnpm, JDK y Android SDK compatibles con la versión de Android Studio indicada por [Capacitor](https://capacitorjs.com/docs/getting-started/environment-setup). No se incluye `local.properties`, credenciales ni keystores privados.

Flujo desde la raíz:

```powershell
pnpm compilar:nativo
pnpm capacitor sync android
pnpm capacitor open android
```

En Android Studio, instalar el SDK solicitado y usar Build → Build APK(s). Por terminal, desde `android`, `./gradlew.bat assembleDebug` genera `app/build/outputs/apk/debug/app-debug.apk`. Las compilaciones no se commitean. El APK de depuración usa la firma local de desarrollo; publicar requiere un proceso de versión separado.

No se ejecutan tests. La compilación Web y la sincronización no verifican por sí mismas el funcionamiento en un dispositivo. La compilación del APK requiere SDK/JDK disponibles.

En este equipo, la sincronización y `assembleDebug` se completaron con JDK 21. El APK se generó en `android/app/build/outputs/apk/debug/app-debug.apk` y permanece fuera de Git. El JBR 25 de Android Studio no es compatible con el wrapper actual: seleccionar JDK 21 para Gradle. Se retiraron los ejemplos de tests que incluía automáticamente la plantilla; no se ejecutaron tests.

SQLite usa una versión lógica en `_metadatos`, independiente del `user_version` del plugin. La misma validación de esquema se aplica a ambos motores. Los repositorios operan mediante rangos portables; SQL utiliza parámetros y las consultas recorren bloques de 256 registros. [Control transaccional del plugin](https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md).
