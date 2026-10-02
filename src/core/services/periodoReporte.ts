/** Períodos disponibles; una semana comienza el lunes en la fecha local del dispositivo. */
export type TipoPeriodoReporte = 'Hoy' | 'Semana' | 'Mes' | 'Año' | 'Personalizado';
/** Convierte una fecha local a calendario sin desplazarla por la zona UTC. */
export function fechaCalendario(fecha: Date): string { return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`; }
/** Obtiene extremos inclusivos del período; personalizado mantiene los extremos ingresados. */
export function periodoReporte(tipo: TipoPeriodoReporte, desde: string, hasta: string, ahora = new Date()) {
  if (tipo === 'Personalizado') return { desde, hasta };
  const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()); const fin = new Date(inicio);
  if (tipo === 'Semana') { inicio.setDate(inicio.getDate() - (inicio.getDay() + 6) % 7); fin.setTime(inicio.getTime()); fin.setDate(fin.getDate() + 6); }
  if (tipo === 'Mes') { inicio.setDate(1); fin.setMonth(fin.getMonth() + 1, 0); }
  if (tipo === 'Año') { inicio.setMonth(0, 1); fin.setMonth(11, 31); }
  return { desde: fechaCalendario(inicio), hasta: fechaCalendario(fin) };
}
