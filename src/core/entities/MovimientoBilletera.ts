import type { EntidadAuditada, FechaHora, Identificador } from './EntidadAuditada';

/** Operaciones que modifican el saldo, conservadas por separado de su efecto sobre el resultado. */
export type TipoMovimientoBilletera =
  | 'SALDO_INICIAL'
  | 'INGRESO'
  | 'GASTO'
  | 'TRANSFERENCIA_ENTRADA'
  | 'TRANSFERENCIA_SALIDA'
  | 'AJUSTE_POSITIVO'
  | 'AJUSTE_NEGATIVO';

/** Entidad que origina un movimiento; el saldo inicial no necesita una referencia externa. */
export type TipoReferenciaMovimiento = 'INGRESO_MEDIO_PAGO' | 'GASTO_MEDIO_PAGO' | 'TRANSFERENCIA' | 'AJUSTE'
  // Referencias anteriores conservadas únicamente para legado pendiente de revisión.
  | 'ingreso' | 'gasto' | 'transferencia' | 'ajuste';

/** Entrada o salida trazable que constituye la fuente de verdad para reconstruir el saldo. */
export interface MovimientoBilletera extends EntidadAuditada {
  billeteraId: Identificador;
  tipo: TipoMovimientoBilletera;
  /** Tipo e identidad del detalle u operación de origen; ambos null para un saldo inicial. */
  referenciaTipo: TipoReferenciaMovimiento | null;
  referenciaId: Identificador | null;
  /** Entero con signo en la moneda de la billetera: positivo para entrada y negativo para salida. */
  importeCentavos: number;
  fecha: FechaHora;
  descripcion: string | null;
}
