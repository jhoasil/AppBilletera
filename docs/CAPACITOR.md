# Frontend compartido

Capacitor consume `dist`, generado por Vite, y mantiene React, navegación, dominio y servicios compartidos. `capacitor.config.ts` define el identificador `com.appbilletera.app`, el nombre y el directorio de salida. No hay un servidor remoto ni plataformas creadas en la tarea 042.

La compilación nativa usa `pnpm run build:native` con modo Vite `native`: genera el mismo frontend sin registrar el service worker de la PWA. Para Android usar `pnpm run android:sync`, que reconstruye y copia el frontend actual antes de generar el APK. La compilación Web usa `pnpm run build`. Las diferencias de persistencia se resuelven en infraestructura: IndexedDB en Web/PWA y SQLite en contenedores nativos. Los componentes no seleccionan motores.

Flujo de referencia: [documentación oficial de Capacitor](https://capacitorjs.com/docs/basics/workflow). Cada plataforma tiene su propia preparación documentada; instalar el contenedor no duplica la aplicación.
