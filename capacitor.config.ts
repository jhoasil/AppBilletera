import type { CapacitorConfig } from '@capacitor/cli';

/** Comparte la compilación Vite con los contenedores nativos, sin servidor remoto. */
const configuracion: CapacitorConfig = { appId: 'com.appbilletera.app', appName: 'AppBilletera', webDir: 'dist' };
export default configuracion;
