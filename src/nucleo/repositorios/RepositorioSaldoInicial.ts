import type { Billetera } from '../entidades/Billetera';
import type { MovimientoBilletera } from '../entidades/MovimientoBilletera';

/** Puerto para registrar el saldo inicial y, opcionalmente, crear su billetera de manera atómica. */
export interface RepositorioSaldoInicial {
  /** Inserta un único saldo inicial por billetera; cualquier error revierte todos los registros. */
  registrar(movimiento: MovimientoBilletera, billeteraNueva?: Billetera): Promise<void>;
}
