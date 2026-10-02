import type { Ingreso } from '../entities/Ingreso';
import type { DetalleIngresoMedioPago } from '../entities/DetalleIngresoMedioPago';
import type { FechaHora, Identificador } from '../entities/EntidadAuditada';
import type { ConsultaOperaciones, PaginaResultado } from './ConsultasRepositorio';

/** Persistencia de ingresos y sus detalles sin exponer el motor de almacenamiento. */
export interface RepositorioIngresos {
  /** Obtiene un ingreso vigente por UUID; devuelve null si no existe o está eliminado. */
  obtenerPorId(id: Identificador): Promise<Ingreso | null>;
  /** Consulta una página filtrada, ordenada por fecha descendente y por id ascendente en empates. */
  listar(consulta: ConsultaOperaciones): Promise<PaginaResultado<Ingreso>>;
  /** Recupera los detalles vigentes de un ingreso; devuelve una lista vacía si no hay resultados. */
  obtenerDetalles(ingresoId: Identificador): Promise<readonly DetalleIngresoMedioPago[]>;
  /** Guarda o actualiza cabecera y reemplaza sus detalles vigentes atómicamente, conservando historia. */
  guardar(ingreso: Ingreso, detalles: readonly DetalleIngresoMedioPago[], actualizadoEnEsperado?: FechaHora): Promise<void>;
  /** Marca cabecera y detalles como eliminados en el instante indicado, sin borrar historia. */
  eliminarLogicamente(id: Identificador, eliminadoEn: FechaHora, actualizadoEnEsperado?: FechaHora): Promise<void>;
}
