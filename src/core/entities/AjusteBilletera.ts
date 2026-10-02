import type { EntidadAuditada, FechaHora, Identificador } from './EntidadAuditada';

/** Conciliación que documenta una diferencia y origina un movimiento de ajuste separado del resultado. */
export interface AjusteBilletera extends EntidadAuditada {
  billeteraId: Identificador;
  fecha: FechaHora;
  saldoCalculadoCentavos: number;
  saldoRealCentavos: number;
  /** Saldo real menos saldo calculado, entero con signo; una diferencia cero no genera ajuste. */
  diferenciaCentavos: number;
  motivo: string;
  observaciones: string | null;
}
