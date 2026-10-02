import type { EntidadAuditada, Identificador } from './EntidadAuditada';

/** Forma editable de pago o cobro, diferenciada de la billetera donde se conserva el dinero. */
export interface MedioPago extends EntidadAuditada {
  nombre: string;
  icono: string | null;
  color: string | null;
  mostrarEnCargaRapida: boolean;
  orden: number;
  /** Billetera sugerida al utilizar el medio; null significa que no hay una predeterminada. */
  billeteraPredeterminadaId: Identificador | null;
  activo: boolean;
}
