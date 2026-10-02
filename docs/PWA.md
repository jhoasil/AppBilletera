# Web y PWA

`pnpm compilar` genera manifest, icono y un service worker que precachea el frontend, incluidos módulos de carga diferida. `pnpm previsualizar` sirve la compilación local. La instalación requiere HTTPS o localhost y depende del navegador; se usa su opción «Instalar aplicación» o «Agregar a inicio». La Web tradicional conserva todas sus funciones.

El primer acceso necesita conexión para descargar la aplicación. Después, la interfaz y los datos locales funcionan offline. Los datos financieros permanecen en IndexedDB; el service worker almacena únicamente recursos de interfaz. Las versiones nuevas esperan a que se cierren las ventanas de la aplicación: no se fuerza una recarga mientras se completa un formulario.

La configuración usa [Vite PWA](https://vite-pwa-org.netlify.app/guide/) con la estrategia de actualización diferida. La persistencia del navegador no sustituye el respaldo JSON.
