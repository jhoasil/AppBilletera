import type { Actividad } from '../entidades/Actividad';

/** Comprueba fechas y estados para reutilizar Actividad también como trabajo temporal. */
export function validarActividad(actividad: Actividad): void {
  if (!actividad.tipo.trim()) throw new Error('Indicá el tipo de actividad.');
  if (!['activo', 'finalizado', 'archivado'].includes(actividad.estado)) throw new Error('El estado de actividad no es válido.');
  validarFecha(actividad.fechaInicio);
  validarFecha(actividad.fechaFin);
  if (actividad.fechaInicio && actividad.fechaFin && actividad.fechaFin < actividad.fechaInicio) {
    throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio.');
  }
}

/** Valida una fecha opcional sin aceptar días inexistentes ni cambios de formato. */
function validarFecha(fecha: string | null): void {
  if (fecha === null) return;
  const instante = new Date(`${fecha}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !Number.isFinite(instante.getTime()) || instante.toISOString().slice(0, 10) !== fecha) {
    throw new Error('Indicá una fecha válida.');
  }
}
