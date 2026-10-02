import type { BilleteraConSaldo } from './RepositorioConsultaBilleteras';

/** Resumen patrimonial por moneda que conserva separados movimientos internos y ajustes. */
export interface TotalPatrimonial { moneda: string; saldoCentavos: number; transferenciasCentavos: number; ajustesPositivosCentavos: number; ajustesNegativosCentavos: number }
/** Saldos actuales y movimientos del período, sin confundirlos con resultado financiero. */
export interface ResumenPatrimonio { billeteras: readonly BilleteraConSaldo[]; totales: readonly TotalPatrimonial[] }
/** Puerto de agregación patrimonial consistente. */
export interface RepositorioPatrimonio {
  /** Lee saldos actuales y agrega movimientos internos del período inclusivo. */
  consultar(desde: string, hasta: string): Promise<ResumenPatrimonio>;
}
