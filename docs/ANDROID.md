# Android

El proyecto `android` usa Capacitor 8 y comparte el frontend. Las operaciones locales usan `@capacitor-community/sqlite` con FK activas, centavos enteros y migraciones atómicas. IndexedDB se reserva para Web/PWA.

Requisitos: Node 22.12 o posterior, pnpm, JDK y Android SDK compatibles con la versión de Android Studio indicada por [Capacitor](https://capacitorjs.com/docs/getting-started/environment-setup). No se incluye `local.properties`, credenciales ni keystores privados.

Flujo desde la raíz:

```powershell
pnpm run android:sync
pnpm capacitor open android
```

En Android Studio, instalar el SDK solicitado y usar Build → Build APK(s). Por terminal, desde `android`, `./gradlew.bat assembleDebug` genera el APK en `app/build/outputs/apk/debug/`. Las compilaciones no se commitean. El APK de depuración usa la firma local de desarrollo; publicar requiere un proceso de versión separado.

`android:sync` ejecuta primero `build:native` y luego `capacitor sync android`. Debe realizarse antes de cada APK cuando cambie React: Gradle por sí solo empaqueta los assets copiados anteriormente. El modo Vite es `native`, que desactiva el registro PWA. La configuración actual nombra el APK con versión y fecha de compilación dentro de `android/app/build/outputs/apk/debug/`; elegir el archivo recién generado y no el antiguo `app-debug.apk`.

No se ejecutan tests. La compilación Web y la sincronización no verifican por sí mismas el funcionamiento en un dispositivo. La compilación del APK requiere SDK/JDK disponibles.

En este equipo, la sincronización y `assembleDebug` se completaron con JDK 21. El APK se generó en `android/app/build/outputs/apk/debug/app-debug.apk` y permanece fuera de Git. El JBR 25 de Android Studio no es compatible con el wrapper actual: seleccionar JDK 21 para Gradle. Se retiraron los ejemplos de tests que incluía automáticamente la plantilla; no se ejecutaron tests.

SQLite usa una versión lógica en `_metadatos`, independiente del `user_version` del plugin. La misma validación de esquema se aplica a ambos motores. Los repositorios operan mediante rangos portables; SQL utiliza parámetros y las consultas recorren bloques de 256 registros. [Control transaccional del plugin](https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md).

La apertura ejecuta la activación de FK y la creación idempotente de `_metadatos` en llamadas separadas, antes de consultar la versión lógica. No concatenar sentencias en una sola línea: el plugin Android separa los lotes por `;` seguido de salto de línea. La preparación conserva datos y metadatos existentes; no requiere borrar la base. Corrección TAREA 100 del 05/10/2026.

Validación TAREA 100: `pnpm run build` correcto, incluidos tipos; revisión del separador en `UtilsSQLite.getStatementsArray` del plugin instalado y del orden abrir → PRAGMA → CREATE → obtenerVersion. `git diff` y `git diff --check` revisados. Tests: no creados ni ejecutados. No se accedió a la base del teléfono ni se generó/instaló APK; la confirmación de apertura en dispositivo requiere actualizar el APK con este código. No se modificaron migraciones distribuidas ni se borraron datos.

TAREA 102 (05/10/2026): los assets nativos y el único APK local previo, del 02/10/2026, todavía incluían el lote SQL anterior. Se alineó `build:native` con `--mode nativo` y se agregó `android:sync` para evitar omitir la reconstrucción antes de copiar a Android. Build con tipos, sync y assembleDebug correctos con JDK 21. APK generado: `AppBilletera-0.1.0-debug-2026-10-05_19_20.apk`. Inspección del ZIP confirmó PRAGMA/CREATE separados, ausencia del lote anterior y de registerSW/sw.js. SHA256: `AED8FA94EDD6CA4987E20A61C553C8BBD1E946888B0EB49BF94A7DA9EEB64DAD`. APK ignorado por Git. No se instaló en teléfono ni se comprobaron sus operaciones; el arranque nativo en dispositivo sigue pendiente. Tests: no creados ni ejecutados.
