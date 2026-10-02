import type { TransferenciaBilletera } from '../entities/TransferenciaBilletera';
import type { FechaHora, Identificador } from '../entities/EntidadAuditada';
import type { ConsultaTransferencias, PaginaResultado } from './ConsultasRepositorio';

/** Persistencia de transferencias internas, sin clasificarlas como ingresos o gastos. */
export interface RepositorioTransferencias {
  /** Obtiene una transferencia vigente por UUID o null si no existe o está eliminada. */
  obtenerPorId(id: Identificador): Promise<TransferenciaBilletera | null>;
  /** Consulta una página ordenada por fecha descendente y por id ascendente en empates. */
  listar(consulta: ConsultaTransferencias): Promise<PaginaResultado<TransferenciaBilletera>>;
  /** Guarda o actualiza una transferencia dentro de la transacción de su operación financiera. */
  guardar(transferencia: TransferenciaBilletera): Promise<void>;
  /** Marca la transferencia como eliminada conservando su registro histórico. */
  eliminarLogicamente(id: Identificador, eliminadoEn: FechaHora): Promise<void>;
}
