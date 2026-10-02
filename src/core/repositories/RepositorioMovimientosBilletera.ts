import type { MovimientoBilletera, TipoReferenciaMovimiento } from '../entities/MovimientoBilletera';
import type { FechaHora, Identificador } from '../entities/EntidadAuditada';
import type { ConsultaMovimientosBilletera, PaginaResultado } from './ConsultasRepositorio';

/** Persistencia de la fuente de verdad de saldos, con agregaciones resueltas por el adaptador. */
export interface RepositorioMovimientosBilletera {
  /** Obtiene un movimiento vigente por UUID o null si no existe o está eliminado. */
  obtenerPorId(id: Identificador): Promise<MovimientoBilletera | null>;
  /** Consulta una página por billetera, ordenada por fecha descendente e id ascendente en empates. */
  listar(consulta: ConsultaMovimientosBilletera): Promise<PaginaResultado<MovimientoBilletera>>;
  /** Guarda un lote atómicamente; un UUID existente no puede duplicarse ni sobrescribirse silenciosamente. */
  guardarLote(movimientos: readonly MovimientoBilletera[]): Promise<void>;
  /** Suma movimientos vigentes en persistencia hasta el instante inclusivo; sin movimientos devuelve cero. */
  obtenerSaldo(billeteraId: Identificador, hasta?: FechaHora): Promise<number>;
  /** Invalida lógicamente los movimientos de una operación para permitir su edición o eliminación consistente. */
  eliminarPorReferencia(tipo: TipoReferenciaMovimiento, referenciaId: Identificador, eliminadoEn: FechaHora): Promise<void>;
}
