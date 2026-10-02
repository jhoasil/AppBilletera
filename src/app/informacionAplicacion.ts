declare const __VERSION_APLICACION__: string;
declare const __BUILD_APLICACION__: string;

/** Fuente central; Vite toma la versión de package.json y el build del entorno de compilación. */
export const informacionAplicacion = Object.freeze({ nombre: 'AppBilletera', version: __VERSION_APLICACION__, build: __BUILD_APLICACION__ });
