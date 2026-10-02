import type { RepositorioConsultaBilleteras } from '../repositories/RepositorioConsultaBilleteras';

/** Consulta patrimonio sin que las pantallas conozcan el motor ni recorran movimientos. */
export class ServicioConsultaBilleteras {
  /** Recibe la consulta transaccional especializada para obtener una instantánea coherente. */
  constructor(private readonly repositorio: RepositorioConsultaBilleteras) {}
  /** Devuelve veinte billeteras por página y totales independientes por moneda. */
  listar(pagina = 0) { return this.repositorio.consultar({ limite: 20, desplazamiento: pagina * 20 }); }
}
