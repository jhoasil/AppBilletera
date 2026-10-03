import { CapacitorSQLite, SQLiteConnection, type SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { AdaptadorBaseLocal, MigracionBaseLocal, OpcionesTransaccion } from '../contracts/AdaptadorBaseLocal';
import type { ContextoDatos } from '../contracts/ContextoDatos';
import type { ContextoMigracionEsquema, DefinicionTabla } from '../migrations/EsquemaBaseDatos';
import { ContextoSQLite } from './ContextoSQLite';

/** Motor nativo SQLite con versión lógica propia y transacciones explícitas compartidas por todas las operaciones. */
export class AdaptadorSQLite implements AdaptadorBaseLocal<ContextoDatos, ContextoMigracionEsquema> {
  private conexion: SQLiteDBConnection | undefined; private readonly gestor = new SQLiteConnection(CapacitorSQLite);
  /** Abre la base privada de la aplicación, sin cifrado ni dependencias del adaptador Web. */
  async abrir() {
    const conexion = await this.gestor.createConnection('app_billetera', false, 'no-encryption', 1, false);
    try { await conexion.open(); await conexion.execute('PRAGMA foreign_keys = ON; CREATE TABLE IF NOT EXISTS _metadatos (id TEXT PRIMARY KEY, valor INTEGER);', false); this.conexion = conexion; }
    catch (error) { await this.gestor.closeConnection('app_billetera', false); throw error; }
  }
  /** Rechaza operaciones antes de abrir o después de cerrar. */
  private exigirConexion() { if (!this.conexion) throw new Error('La conexión SQLite no está abierta.'); return this.conexion; }
  /** Lee la versión de negocio; la versión del archivo que usa el plugin queda separada. */
  async obtenerVersion() { const fila = (await this.exigirConexion().query("SELECT valor FROM _metadatos WHERE id = 'version_esquema'")).values?.[0] as { valor?: number } | undefined; return fila?.valor ?? 0; }
  /** Crea tablas y confirma la versión dentro de una misma transacción; un fallo conserva el esquema anterior. */
  async aplicarMigracion(migracion: MigracionBaseLocal<ContextoMigracionEsquema>) {
    const conexion = this.exigirConexion(); await conexion.beginTransaction();
    /** Traduce las definiciones compartidas a SQLite y conserva las FK sin cascadas de borrado. */
    async function crearTablas(tablas: readonly DefinicionTabla[]) {
      for (const tabla of tablas) {
        /** Emite una columna con tipo y restricciones conocidas del esquema. */
        function columna(valor: DefinicionTabla['columnas'][number]) { return `${valor.nombre} ${valor.tipo === 'entero' || valor.tipo === 'booleano' ? 'INTEGER' : 'TEXT'}${valor.clavePrimaria ? ' PRIMARY KEY' : ''}${valor.permiteNulo ? '' : ' NOT NULL'}${valor.referencia ? ` REFERENCES ${valor.referencia}(id) ON DELETE RESTRICT` : ''}`; }
        await conexion.execute(`CREATE TABLE ${tabla.nombre} (${tabla.columnas.map(columna).join(',')});`, false);
        for (const indice of tabla.indices ?? []) await conexion.execute(`CREATE INDEX ${tabla.nombre}_${indice.nombre} ON ${tabla.nombre} (${indice.columnas.join(',')});`, false);
      }
    }
    try { await migracion.aplicar({ crearTablas }); await conexion.run("INSERT INTO _metadatos (id,valor) VALUES ('version_esquema',?) ON CONFLICT(id) DO UPDATE SET valor=excluded.valor", [migracion.version], false); await conexion.commitTransaction(); }
    catch (error) { await conexion.rollbackTransaction(); throw error; }
  }
  /** Ejecuta sobre una conexión y confirma únicamente al terminar; los métodos internos usan transaction=false. */
  async ejecutarTransaccion<Resultado>(opciones: OpcionesTransaccion, operacion: (contexto: ContextoDatos) => Promise<Resultado>): Promise<Resultado> {
    const conexion = this.exigirConexion(); await conexion.beginTransaction();
    try { const resultado = await operacion(new ContextoSQLite(conexion, opciones.recursos, opciones.modo === 'escritura')); await conexion.commitTransaction(); return resultado; }
    catch (error) { await conexion.rollbackTransaction(); throw error; }
  }
  /** Libera la conexión conservando el archivo de datos. */
  async cerrar() { if (this.conexion) { await this.gestor.closeConnection('app_billetera', false); this.conexion = undefined; } }
}
