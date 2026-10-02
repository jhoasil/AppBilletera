import type { EntidadAuditada, FechaCalendario, Identificador, Moneda } from './EntidadAuditada';

/** Registro de ingreso asociado a una actividad y distribuido en detalles por medio de cobro. */
export interface Ingreso extends EntidadAuditada {
  actividadId: Identificador;
  fecha: FechaCalendario;
  descripcion: string | null;
  observaciones: string | null;
  moneda: Moneda;
  /** Total entero en centavos que debe coincidir con la suma de sus detalles positivos. */
  importeCentavos: number;
}
