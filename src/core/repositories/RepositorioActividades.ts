import type { Actividad } from '../entities/Actividad';
import type { FechaHora, Identificador } from '../entities/EntidadAuditada';
import type { ConsultaCatalogo, PaginaResultado } from './ConsultasRepositorio';

/** Contrato de persistencia del catálogo Actividad, independiente del motor físico. */
export interface RepositorioActividades {
  /** Obtiene un registro no eliminado, incluso inactivo; devuelve null si no existe o está eliminado. */
  obtenerPorId(id: Identificador): Promise<Actividad | null>;
  /** Consulta una página del catálogo ordenada por nombre e id ascendentes. */
  listar(consulta: ConsultaCatalogo): Promise<PaginaResultado<Actividad>>;
  /** Crea o actualiza un registro conservando su UUID y los datos de auditoría recibidos. */
  guardar(entidad: Actividad): Promise<void>;
  /** Marca el registro como eliminado sin eliminar físicamente referencias históricas. */
  eliminarLogicamente(id: Identificador, eliminadoEn: FechaHora): Promise<void>;
}
