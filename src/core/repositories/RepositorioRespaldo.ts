/** Representación portable de las tablas, con columnas físicas españolas y valores JSON. */
export type DatosRespaldo = Record<string, readonly Record<string, unknown>[]>;
/** Puerto para exportar una instantánea e incorporar registros en una sola transacción. */
export interface RepositorioRespaldo {
  /** Obtiene todas las tablas para un respaldo explícito del usuario. */
  exportar(): Promise<DatosRespaldo>;
  /** Incorpora registros y rechaza conflictos de identidad sin borrar historia existente. */
  importar(datos: DatosRespaldo): Promise<void>;
}
