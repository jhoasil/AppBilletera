/** Identidad UUID generada localmente; no representa un campo adicional a id. */
export type Identificador = string;

/** Instante ISO 8601 en UTC, por ejemplo 2026-10-02T15:30:00.000Z. */
export type FechaHora = string;

/** Fecha de calendario sin hora ni zona, con formato AAAA-MM-DD. */
export type FechaCalendario = string;

/** Código de moneda ISO 4217; inicialmente ARS, sin limitar futuras monedas. */
export type Moneda = string;

/**
 * Identidad y auditoría comunes para conservar la trazabilidad de los registros.
 * Las cadenas no validan su formato por sí mismas; la validación pertenece a servicios posteriores.
 */
export interface EntidadAuditada {
  id: Identificador;
  creadoEn: FechaHora;
  actualizadoEn: FechaHora;
  /** Instante del borrado lógico; null identifica un registro no eliminado. */
  eliminadoEn: FechaHora | null;
}
