import type { MedioPago } from '../entidades/MedioPago';
import type { FechaHora, Identificador } from '../entidades/EntidadAuditada';
import type { ConsultaCatalogo, PaginaResultado } from './ConsultasRepositorio';

/** Contrato de persistencia del catálogo MedioPago, independiente del motor físico. */
export interface RepositorioMediosPago {
  /** Obtiene un registro no eliminado, incluso inactivo; devuelve null si no existe o está eliminado. */
  obtenerPorId(id: Identificador): Promise<MedioPago | null>;
  /** Consulta una página del catálogo ordenada por orden, nombre e id ascendentes. */
  listar(consulta: ConsultaCatalogo): Promise<PaginaResultado<MedioPago>>;
  /** Crea o actualiza un registro conservando su UUID y los datos de auditoría recibidos. */
  guardar(entidad: MedioPago): Promise<void>;
  /** Marca el registro como eliminado sin eliminar físicamente referencias históricas. */
  eliminarLogicamente(id: Identificador, eliminadoEn: FechaHora): Promise<void>;
}
