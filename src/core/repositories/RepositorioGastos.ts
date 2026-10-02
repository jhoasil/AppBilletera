import type { Gasto } from '../entities/Gasto';
import type { DetalleGastoMedioPago } from '../entities/DetalleGastoMedioPago';
import type { FechaHora, Identificador } from '../entities/EntidadAuditada';
import type { ConsultaGastos, PaginaResultado } from './ConsultasRepositorio';

/** Persistencia de gastos y detalles con filtros por categoría, actividad y período. */
export interface RepositorioGastos {
  /** Obtiene un gasto vigente por UUID; devuelve null si no existe o está eliminado. */
  obtenerPorId(id: Identificador): Promise<Gasto | null>;
  /** Consulta una página ordenada por fecha descendente y por id ascendente en empates. */
  listar(consulta: ConsultaGastos): Promise<PaginaResultado<Gasto>>;
  /** Recupera los detalles vigentes del gasto; devuelve una lista vacía si no hay resultados. */
  obtenerDetalles(gastoId: Identificador): Promise<readonly DetalleGastoMedioPago[]>;
  /** Guarda o actualiza cabecera y reemplaza sus detalles vigentes atómicamente, conservando historia. */
  guardar(gasto: Gasto, detalles: readonly DetalleGastoMedioPago[], actualizadoEnEsperado?: FechaHora): Promise<void>;
  /** Marca cabecera y detalles como eliminados en el instante indicado, sin borrar historia. */
  eliminarLogicamente(id: Identificador, eliminadoEn: FechaHora, actualizadoEnEsperado?: FechaHora): Promise<void>;
}
