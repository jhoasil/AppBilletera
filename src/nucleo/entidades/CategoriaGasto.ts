import type { EntidadAuditada } from './EntidadAuditada';

/** Clasificación editable de gastos que conserva su identidad para consultas históricas. */
export interface CategoriaGasto extends EntidadAuditada {
  nombre: string;
  icono: string | null;
  color: string | null;
  activo: boolean;
}
