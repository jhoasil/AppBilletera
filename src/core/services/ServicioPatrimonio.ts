import type { RepositorioPatrimonio } from '../repositories/RepositorioPatrimonio';

/** Coordina reportes patrimoniales detrás de un puerto independiente del motor. */
export class ServicioPatrimonio {
  /** Recibe la consulta que mantiene una instantánea transaccional. */
  constructor(private readonly repositorio: RepositorioPatrimonio) {}
  /** Consulta el patrimonio actual y los movimientos internos del período. */
  consultar(desde: string, hasta: string) { if (!desde || !hasta || desde > hasta) throw new Error('El período no es válido.'); return this.repositorio.consultar(desde, hasta); }
}
