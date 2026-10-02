import type { FechaCalendario, FechaHora, Identificador } from '../entities/EntidadAuditada';

/** Página acotada: limite entero positivo y desplazamiento entero no negativo. */
export interface ConsultaPaginada {
  limite: number;
  desplazamiento: number;
}

/** Página de resultados y cantidad total que cumple los filtros, antes de paginar. */
export interface PaginaResultado<Entidad> {
  elementos: readonly Entidad[];
  total: number;
}

/** Consulta de catálogo; omitir activo devuelve activos e inactivos, sin registros eliminados. */
export interface ConsultaCatalogo extends ConsultaPaginada {
  activo?: boolean;
  incluirEliminados?: boolean;
}

/** Filtros de ingresos y gastos, con fechas de calendario inclusivas. */
export interface ConsultaOperaciones extends ConsultaPaginada {
  desde?: FechaCalendario;
  hasta?: FechaCalendario;
  actividadId?: Identificador;
  incluirEliminados?: boolean;
}

/** Filtros de gastos con una categoría opcional además de actividad y período. */
export interface ConsultaGastos extends ConsultaOperaciones {
  categoriaId?: Identificador;
}

/** Transferencias por período inclusivo y participación de una billetera como origen o destino. */
export interface ConsultaTransferencias extends ConsultaPaginada {
  desde?: FechaCalendario;
  hasta?: FechaCalendario;
  billeteraId?: Identificador;
  incluirEliminados?: boolean;
}

/** Movimientos de una billetera por instantes UTC inclusivos, sin borrados lógicos. */
export interface ConsultaMovimientosBilletera extends ConsultaPaginada {
  billeteraId: Identificador;
  desde?: FechaHora;
  hasta?: FechaHora;
}
