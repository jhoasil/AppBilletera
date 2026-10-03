import { Capacitor } from '@capacitor/core';

/** Entrega el respaldo al mecanismo de archivos del dispositivo, sin enviar datos automáticamente. */
export async function exportarArchivoRespaldo(datos: string): Promise<void> {
  const nombre = `AppBilletera_${new Date().toISOString().slice(0, 10)}.json`;
  if (Capacitor.isNativePlatform()) {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem'); const { Share } = await import('@capacitor/share');
    const archivo = await Filesystem.writeFile({ path: nombre, data: datos, directory: Directory.Cache, encoding: Encoding.UTF8 });
    await Share.share({ title: 'Guardar respaldo de AppBilletera', files: [archivo.uri], dialogTitle: 'Elegí dónde guardar tu respaldo' });
    return;
  }
  const enlace = document.createElement('a'); const url = URL.createObjectURL(new Blob([datos], { type: 'application/json' })); enlace.href = url; enlace.download = nombre; enlace.click();
  /** Libera el archivo temporal después de que el navegador inicia la descarga. */
  function liberar() { URL.revokeObjectURL(url); } window.setTimeout(liberar, 1000);
}
