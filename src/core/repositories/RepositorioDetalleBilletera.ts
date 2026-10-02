import type { Billetera } from '../entities/Billetera';
import type { MovimientoBilletera } from '../entities/MovimientoBilletera';
import type { ConsultaMovimientosBilletera, PaginaResultado } from './ConsultasRepositorio';

/** Instantánea del saldo actual y una página de movimientos filtrados de la misma billetera. */
export interface DetalleBilletera { billetera: Billetera; saldoCentavos: number; movimientos: PaginaResultado<MovimientoBilletera> }
/** Consulta financiera consistente, independiente del motor local. */
export interface RepositorioDetalleBilletera {
  /** Obtiene catálogo, saldo y movimientos en una misma transacción o rechaza una identidad ausente. */
  consultar(consulta: ConsultaMovimientosBilletera): Promise<DetalleBilletera>;
}
