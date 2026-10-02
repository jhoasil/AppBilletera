import type { CategoriaGasto } from '../entities/CategoriaGasto';
import type { FechaHora, Identificador } from '../entities/EntidadAuditada';
import type { ConsultaCatalogo, PaginaResultado } from './ConsultasRepositorio';

/** Contrato de persistencia del catálogo CategoriaGasto, independiente del motor físico. */
export interface RepositorioCategoriasGasto {
  /** Obtiene un registro no eliminado, incluso inactivo; devuelve null si no existe o está eliminado. */
  obtenerPorId(id: Identificador): Promise<CategoriaGasto | null>;
  /** Consulta una página del catálogo ordenada por nombre e id ascendentes. */
  listar(consulta: ConsultaCatalogo): Promise<PaginaResultado<CategoriaGasto>>;
  /** Crea o actualiza un registro conservando su UUID y los datos de auditoría recibidos. */
  guardar(entidad: CategoriaGasto): Promise<void>;
  /** Marca el registro como eliminado sin eliminar físicamente referencias históricas. */
  eliminarLogicamente(id: Identificador, eliminadoEn: FechaHora): Promise<void>;
}
