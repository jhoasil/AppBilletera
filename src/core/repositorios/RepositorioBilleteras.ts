import type { Billetera } from '../entidades/Billetera';
import type { FechaHora, Identificador } from '../entidades/EntidadAuditada';
import type { ConsultaCatalogo, PaginaResultado } from './ConsultasRepositorio';

/** Contrato de persistencia del catálogo Billetera, independiente del motor físico. */
export interface RepositorioBilleteras {
  /** Obtiene un registro no eliminado, incluso inactivo; devuelve null si no existe o está eliminado. */
  obtenerPorId(id: Identificador): Promise<Billetera | null>;
  /** Consulta una página del catálogo ordenada por nombre e id ascendentes. */
  listar(consulta: ConsultaCatalogo): Promise<PaginaResultado<Billetera>>;
  /** Crea o actualiza un registro conservando su UUID y los datos de auditoría recibidos. */
  guardar(entidad: Billetera): Promise<void>;
  /** Marca el registro como eliminado sin eliminar físicamente referencias históricas. */
  eliminarLogicamente(id: Identificador, eliminadoEn: FechaHora): Promise<void>;
}
