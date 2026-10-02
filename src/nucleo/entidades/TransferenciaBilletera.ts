import type { EntidadAuditada, FechaCalendario, Identificador, Moneda } from './EntidadAuditada';

/** Transferencia entre billeteras distintas de la misma moneda, sin afectar ingresos ni gastos. */
export interface TransferenciaBilletera extends EntidadAuditada {
  billeteraOrigenId: Identificador;
  billeteraDestinoId: Identificador;
  /** Entero positivo en centavos que origina una salida y una entrada del mismo importe. */
  importeCentavos: number;
  moneda: Moneda;
  fecha: FechaCalendario;
  descripcion: string | null;
}
