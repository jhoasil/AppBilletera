import type { CargaIngreso } from './CargaIngreso';

/** Datos de gasto: categoría obligatoria y actividad opcional, con distribuciones positivas. */
export interface CargaGasto extends Omit<CargaIngreso, 'actividadId'> {
  categoriaId: string;
  actividadId: string | null;
}
