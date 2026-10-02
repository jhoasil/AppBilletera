import type { EntidadAuditada, FechaCalendario, Identificador, Moneda } from './EntidadAuditada';

/** Gasto clasificado por categoría y opcionalmente asociado a la rentabilidad de una actividad. */
export interface Gasto extends EntidadAuditada {
  categoriaId: Identificador;
  actividadId: Identificador | null;
  fecha: FechaCalendario;
  descripcion: string;
  observaciones: string | null;
  moneda: Moneda;
  /** Total entero positivo en centavos, igual a la suma de sus detalles. */
  importeCentavos: number;
}
