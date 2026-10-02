import type { EntidadAuditada, FechaCalendario } from './EntidadAuditada';

/** Estado de una actividad, independiente de su disponibilidad en los formularios. */
export type EstadoActividad = 'activo' | 'finalizado' | 'archivado';

/** Fuente de ingresos o trabajo fijo o temporal al que pueden asociarse ingresos y gastos. */
export interface Actividad extends EntidadAuditada {
  nombre: string;
  tipo: string;
  descripcion: string | null;
  /** Identificador de Material Icons, sin almacenar SVG. */
  icono: string | null;
  color: string | null;
  fechaInicio: FechaCalendario | null;
  fechaFin: FechaCalendario | null;
  estado: EstadoActividad;
  activo: boolean;
}
