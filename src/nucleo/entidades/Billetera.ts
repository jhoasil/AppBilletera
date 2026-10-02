import type { EntidadAuditada, FechaHora, Moneda } from './EntidadAuditada';

/** Ubicación del dinero; su saldo se obtiene de movimientos y no es un atributo editable. */
export interface Billetera extends EntidadAuditada {
  nombre: string;
  tipo: string;
  icono: string | null;
  color: string | null;
  moneda: Moneda;
  activo: boolean;
  /** Instante de la última conciliación; null si todavía no se realizó ninguna. */
  conciliadoEn: FechaHora | null;
}
