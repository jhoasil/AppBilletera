/** Cambio de esquema numerado desde uno; su contexto pertenece al motor elegido. */
export interface MigracionBaseLocal<ContextoMigracion> {
  readonly version: number;
  readonly descripcion: string;
  /** Aplica el cambio usando únicamente el contexto de migración recibido. */
  aplicar(contexto: ContextoMigracion): void | Promise<void>;
}

/** Alcance explícito para que IndexedDB conozca los almacenes antes de comenzar la transacción. */
export interface OpcionesTransaccion {
  readonly recursos: readonly string[];
  readonly modo: 'lectura' | 'escritura';
}

/**
 * Puerto físico que debe proporcionar cada motor sin exponerlo a presentación ni dominio.
 * Los contextos permiten ligar futuros repositorios a la misma transacción.
 */
export interface AdaptadorBaseLocal<ContextoTransaccion, ContextoMigracion> {
  /** Abre la conexión; si falla, libera los recursos adquiridos parcialmente. */
  abrir(): Promise<void>;
  /** Lee la versión persistida del esquema; una base nueva comienza en cero. */
  obtenerVersion(): Promise<number>;
  /** Aplica el cambio y persiste su versión atómicamente; un fallo conserva la versión anterior. */
  aplicarMigracion(migracion: MigracionBaseLocal<ContextoMigracion>): Promise<void>;
  /**
   * Entrega un contexto común y resuelve solo después de confirmar la transacción.
   * Ante un fallo de la operación o confirmación, revierte y rechaza la promesa.
   * El contexto expira al terminar; no se abren transacciones independientes en sus repositorios.
   */
  ejecutarTransaccion<Resultado>(
    opciones: OpcionesTransaccion,
    operacion: (contexto: ContextoTransaccion) => Promise<Resultado>,
  ): Promise<Resultado>;
  /** Cierra la conexión sin borrar datos; una conexión cerrada puede abrirse nuevamente. */
  cerrar(): Promise<void>;
}
