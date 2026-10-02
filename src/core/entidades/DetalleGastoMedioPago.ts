import type { EntidadAuditada, Identificador } from './EntidadAuditada';

/** Parte de un gasto pagada con un medio y una billetera opcional. */
export interface DetalleGastoMedioPago extends EntidadAuditada {
  gastoId: Identificador;
  medioPagoId: Identificador;
  billeteraId: Identificador | null;
  /** Entero positivo en la moneda del gasto; el movimiento asociado representa la salida con signo negativo. */
  importeCentavos: number;
}
