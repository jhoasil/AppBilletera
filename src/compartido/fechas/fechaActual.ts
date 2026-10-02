/** Devuelve el día del dispositivo para precargar fechas sin desplazarlo por la zona UTC. */
export function fechaActual(): string {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
}
