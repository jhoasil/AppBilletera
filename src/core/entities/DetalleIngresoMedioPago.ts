import type { EntidadAuditada, Identificador } from './EntidadAuditada';

/** Parte de un ingreso cobrada con un medio, sin columnas fijas para efectivo o tarjeta. */
export interface DetalleIngresoMedioPago extends EntidadAuditada {
  ingresoId: Identificador;
  medioPagoId: Identificador;
  /** Billetera histórica real; null se conserva solo en legado pendiente de revisión. */
  billeteraId: Identificador | null;
  /** Entero positivo en centavos, en la moneda del ingreso; no persistir líneas de cero. */
  importeCentavos: number;
}
