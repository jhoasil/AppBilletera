import type { MovimientoBilletera } from '../entities/MovimientoBilletera';

/** Resultado de un período por moneda; las transferencias y ajustes no participan de la ganancia. */
export interface ResumenMoneda { moneda: string; ingresosCentavos: number; gastosCentavos: number; gananciaCentavos: number }
/** Instantánea financiera con una cantidad acotada de movimientos recientes. */
export interface ResumenPeriodo { totales: readonly ResumenMoneda[]; movimientos: readonly MovimientoBilletera[] }
/** Contrato que mantiene las agregaciones fuera de React. */
export interface RepositorioResumen {
  /** Agrega operaciones vigentes del período inclusivo sin entregar toda su historia. */
  consultar(desde: string, hasta: string): Promise<ResumenPeriodo>;
}
