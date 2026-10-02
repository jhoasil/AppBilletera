import type { MovimientoBilletera } from '../entities/MovimientoBilletera';

/** Resultado de un período por moneda; las transferencias y ajustes no participan de la ganancia. */
export interface ResumenMoneda { moneda: string; ingresosCentavos: number; gastosCentavos: number; gananciaCentavos: number }
/** Instantánea financiera con una cantidad acotada de movimientos recientes. */
/** Grupo agregado cuyo identificador conserva la asociación con el catálogo histórico. */
export interface DesgloseResumen extends ResumenMoneda { id: string; nombre: string; tipo: 'actividad' | 'medio' | 'categoria' }
export interface ResumenPeriodo { totales: readonly ResumenMoneda[]; movimientos: readonly MovimientoBilletera[]; desgloses: readonly DesgloseResumen[] }
/** Contrato que mantiene las agregaciones fuera de React. */
export interface RepositorioResumen {
  /** Agrega operaciones vigentes del período inclusivo sin entregar toda su historia. */
  consultar(desde: string, hasta: string): Promise<ResumenPeriodo>;
}
