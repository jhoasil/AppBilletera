import type { AdaptadorWeb } from '../adapters/Web';
import type { MigracionBaseLocal, OpcionesTransaccion } from '../contracts/AdaptadorBaseLocal';
import type { ContextoMigracionEsquema, DefinicionTabla } from '../migrations/EsquemaBaseDatos';
import type { ContextoDatos } from '../contracts/ContextoDatos';
import { ContextoIndexedDB } from './ContextoIndexedDB';

/** Implementa el puerto Web con eventos nativos y confirmación efectiva de transacciones. */
export class AdaptadorIndexedDB implements AdaptadorWeb<ContextoDatos, ContextoMigracionEsquema> {
  readonly plataforma = 'web' as const;
  private conexion: IDBDatabase | undefined;

  /** Selecciona un nombre estable de base; no borra ni recrea datos al actualizar. */
  constructor(private readonly nombre = 'app_billetera') {}

  /** Abre la versión existente; IndexedDB 1 representa el esquema lógico cero vacío. */
  async abrir(): Promise<void> { this.conexion = await this.abrirVersion(); }

  /** Lee la versión lógica, separada de la versión física mínima uno de IndexedDB. */
  async obtenerVersion(): Promise<number> { return this.obtenerConexion().version - 1; }

  /** Aplica la migración en versionchange y confirma su versión junto con el esquema. */
  async aplicarMigracion(migracion: MigracionBaseLocal<ContextoMigracionEsquema>): Promise<void> {
    this.obtenerConexion().close();
    this.conexion = undefined;
    this.conexion = await this.abrirVersion(migracion.version + 1, migracion);
  }

  /** Abre una conexión y controla bloqueos, fallos de esquema y cambios desde otras pestañas. */
  private abrirVersion(version?: number, migracion?: MigracionBaseLocal<ContextoMigracionEsquema>): Promise<IDBDatabase> {
    const nombre = this.nombre;
    /** Vincula todos los eventos antes de que empiece la actualización. */
    function conectar(resolver: (base: IDBDatabase) => void, rechazar: (error: unknown) => void) {
      const solicitud = version === undefined ? indexedDB.open(nombre) : indexedDB.open(nombre, version);
      let cancelada = false;
      let errorMigracion: unknown;
      /** Cancela una apertura bloqueada para pedir el cierre de otra pestaña. */
      function bloquear() { cancelada = true; rechazar(new Error('Cierre otras pestañas de AppBilletera para actualizar la base.')); }
      /** Aplica sin esperas externas el esquema dentro del evento de actualización. */
      function actualizar() {
        if (cancelada) { solicitud.transaction?.abort(); return; }
        if (!migracion) return;
        /** Crea los almacenes y sus índices dentro de la actualización atómica. */
        function crearTablas(tablas: readonly DefinicionTabla[]) {
          solicitud.result.createObjectStore('_metadatos', { keyPath: 'id' });
          for (const tabla of tablas) {
            const almacen = solicitud.result.createObjectStore(tabla.nombre, { keyPath: 'id' });
            for (const indice of tabla.indices ?? []) almacen.createIndex(indice.nombre, indice.columnas.length === 1 ? indice.columnas[0]! : [...indice.columnas]);
          }
        }
        try {
          const resultado = migracion.aplicar({ crearTablas });
          if (resultado !== undefined) { void resultado.catch(ignorarErrorPosterior); throw new Error('Las migraciones IndexedDB deben aplicar el esquema de forma síncrona.'); }
        } catch (error) { errorMigracion = error; solicitud.transaction?.abort(); }
      }
      /** Consume un rechazo de una migración asíncrona ya rechazada por incompatibilidad. */
      function ignorarErrorPosterior() {}
      /** Cierra conexiones obsoletas para liberar futuras actualizaciones de esquema. */
      function completar() {
        const base = solicitud.result;
        if (cancelada) { base.close(); return; }
        /** Libera la conexión cuando otra pestaña solicita una actualización. */
        function cambiarVersion() { base.close(); }
        base.onversionchange = cambiarVersion;
        resolver(base);
      }
      /** Propaga el error original de migración si lo hubo. */
      function fallar() { rechazar(errorMigracion ?? solicitud.error ?? new Error('No se pudo abrir la base local.')); }
      solicitud.onblocked = bloquear;
      solicitud.onupgradeneeded = actualizar;
      solicitud.onsuccess = completar;
      solicitud.onerror = fallar;
    }
    return new Promise(conectar);
  }

  /** Impide operar sobre una conexión ausente o cerrada por el ciclo de vida. */
  private obtenerConexion(): IDBDatabase {
    if (!this.conexion) throw new Error('La conexión Web no está abierta.');
    return this.conexion;
  }

  /** Resuelve tras oncomplete y aborta si falla la operación recibida. */
  ejecutarTransaccion<Resultado>(opciones: OpcionesTransaccion, operacion: (contexto: ContextoDatos) => Promise<Resultado>): Promise<Resultado> {
    const transaccion = this.obtenerConexion().transaction([...opciones.recursos], opciones.modo === 'lectura' ? 'readonly' : 'readwrite');
    /** Conecta el resultado de la operación con la confirmación efectiva del motor. */
    function ejecutar(resolver: (valor: Resultado) => void, rechazar: (error: unknown) => void) {
      let resultado: Resultado;
      let terminada = false;
      let errorOperacion: unknown;
      /** Entrega datos únicamente si la operación terminó dentro de la transacción. */
      function confirmar() { if (terminada) resolver(resultado); else rechazar(new Error('La operación esperó fuera de su transacción.')); }
      /** Propaga un aborto conservando el error de la operación. */
      function abortar() { rechazar(errorOperacion ?? transaccion.error ?? new Error('La transacción fue cancelada.')); }
      /** Captura el valor antes del evento de confirmación. */
      function recibir(valor: Resultado) { resultado = valor; terminada = true; }
      /** Cancela todas las escrituras si la operación falla. */
      function fallar(error: unknown) { errorOperacion = error; try { transaccion.abort(); } catch { rechazar(error); } }
      transaccion.oncomplete = confirmar;
      transaccion.onabort = abortar;
      try { void operacion(new ContextoIndexedDB(transaccion)).then(recibir, fallar); } catch (error) { fallar(error); }
    }
    return new Promise(ejecutar);
  }

  /** Cierra la conexión conservando su base y todos los datos. */
  async cerrar(): Promise<void> { this.conexion?.close(); this.conexion = undefined; }
}
