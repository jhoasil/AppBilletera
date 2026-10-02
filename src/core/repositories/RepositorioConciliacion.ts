import type { ConfirmacionConciliacion } from '../services/calcularConciliacion';

/** Persiste una conciliación y su eventual ajuste en una sola transacción. */
export interface RepositorioConciliacion {
  /** Verifica el saldo esperado antes de confirmar para evitar ajustes sobre lecturas antiguas. */
  confirmar(datos: ConfirmacionConciliacion): Promise<void>;
}
