import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';
import type { RangoConsulta, ClaveConsulta } from '../contracts/RangoConsulta';
import { validarRegistro } from '../contracts/validarRegistro';
import type { NombreTabla } from '../migrations/EsquemaBaseDatos';
import { tablasV1 } from '../migrations/v1';

/** Traduce consultas comunes a SQL parametrizado dentro de la conexión y transacción recibidas. */
export class ContextoSQLite implements ContextoDatos {
  /** Conserva una conexión y los recursos autorizados por el coordinador. */
  constructor(private readonly conexion: SQLiteDBConnection, private readonly recursos: readonly string[], private readonly escritura = false) {}
  /** Rechaza tablas fuera del ámbito transaccional antes de ejecutar SQL. */
  private definicion(tabla: NombreTabla) { const definicion = tablasV1.find(/** Localiza una definición declarativa para impedir SQL sobre tablas o índices desconocidos. */ function buscar(valor) { return valor.nombre === tabla; }); if (!definicion || !this.recursos.includes(tabla)) throw new Error('La tabla no pertenece a esta transacción.'); return definicion; }
  /** Reconstruye booleanos del motor sin modificar dinero ni fechas. */
  private convertir(tabla: NombreTabla, registro: RegistroDatos): RegistroDatos { for (const columna of this.definicion(tabla).columnas) if (columna.tipo === 'booleano' && registro[columna.nombre] !== null) registro[columna.nombre] = registro[columna.nombre] === 1; return registro; }
  /** Consulta una marca técnica sin introducir preferencias financieras. */
  async obtenerMarca(id: string) { if (!this.recursos.includes('_metadatos')) throw new Error('Metadatos fuera de la transacción.'); return Boolean((await this.conexion.query('SELECT id FROM _metadatos WHERE id = ?', [id])).values?.length); }
  /** Inserta una marca en la transacción existente, sin confirmación propia. */
  async guardarMarca(id: string) { if (!this.escritura || !this.recursos.includes('_metadatos')) throw new Error('Escritura fuera de la transacción.'); await this.conexion.run('INSERT OR IGNORE INTO _metadatos (id) VALUES (?)', [id], false); }
  /** Obtiene un registro por UUID mediante una consulta parametrizada. */
  async obtener(tabla: NombreTabla, id: string): Promise<RegistroDatos | null> { this.definicion(tabla); const registro = (await this.conexion.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id])).values?.[0] as RegistroDatos | undefined; return registro ? this.convertir(tabla, registro) : null; }
  /** Recorre bloques acotados sin materializar el historial financiero completo. */
  recorrer(tabla: NombreTabla, visitar: (registro: RegistroDatos) => void, indice?: string, rango?: RangoConsulta) {
    /** Adapta la visita síncrona al recorrido común. */
    async function recibir(registro: RegistroDatos) { visitar(registro); }
    return this.recorrerBloques(tabla, recibir, indice, rango, false);
  }
  /** Permite consultas dependientes sobre la misma conexión, sin transacciones anidadas. */
  recorrerAsincrono(tabla: NombreTabla, visitar: (registro: RegistroDatos) => Promise<void>, indice?: string, rango?: RangoConsulta) { return this.recorrerBloques(tabla, visitar, indice, rango, false); }
  /** Ordena fechas descendentes y UUID ascendentes con memoria limitada a un bloque. */
  recorrerPorFecha(tabla: NombreTabla, indice: string, rango: RangoConsulta | undefined, visitar: (registro: RegistroDatos) => void) {
    /** Adapta la visita de una página al recorrido SQL. */
    async function recibir(registro: RegistroDatos) { visitar(registro); }
    return this.recorrerBloques(tabla, recibir, indice, rango, true);
  }
  /** Traduce índices y rangos declarativos a columnas conocidas; solo los valores se interpolan como parámetros. */
  private async recorrerBloques(tabla: NombreTabla, visitar: (registro: RegistroDatos) => Promise<void>, indice: string | undefined, rango: RangoConsulta | undefined, descendente: boolean) {
    const definicion = this.definicion(tabla); const columnas = indice ? definicion.indices?.find(/** Localiza una definición declarativa para impedir SQL sobre tablas o índices desconocidos. */ function buscar(valor) { return valor.nombre === indice; })?.columnas : ['id'];
    if (!columnas) throw new Error('El índice no pertenece al esquema.');
    const valores: (string | number)[] = []; const condiciones: string[] = [];
    /** Produce una comparación inclusiva para una clave simple o compuesta. */
    function extremo(clave: ClaveConsulta, operador: string) { const partes = Array.isArray(clave) ? clave : [clave]; if (partes.length !== columnas!.length) throw new Error('El rango no coincide con el índice.'); valores.push(...partes as (string | number)[]); condiciones.push(columnas!.length === 1 ? `${columnas![0]} ${operador} ?` : `(${columnas!.join(',')}) ${operador} (${partes.map(/** Genera un marcador SQL para vincular valores sin interpolarlos en la sentencia. */ function parametro() { return '?'; }).join(',')})`); }
    if (rango?.inferior !== undefined) extremo(rango.inferior, '>='); if (rango?.superior !== undefined) extremo(rango.superior, '<=');
    const orden = descendente ? `${columnas[columnas.length - 1]} DESC,id ASC` : [...columnas, ...(columnas.includes('id') ? [] : ['id'])].join(',');
    let desplazamiento = 0;
    while (true) {
      const filas = (await this.conexion.query(`SELECT * FROM ${tabla}${condiciones.length ? ` WHERE ${condiciones.join(' AND ')}` : ''} ORDER BY ${orden} LIMIT 256 OFFSET ?`, [...valores, desplazamiento])).values as RegistroDatos[] | undefined;
      if (!filas?.length) break; for (const fila of filas) await visitar(this.convertir(tabla, fila)); if (filas.length < 256) break; desplazamiento += filas.length;
    }
  }
  /** Comparte la validación declarativa y escribe con parámetros, preservando identidad y FK históricas. */
  async guardar(tabla: NombreTabla, registro: RegistroDatos, insertar = false) {
    if (!this.escritura) throw new Error('Esta transacción es de solo lectura.');
    const definicion = this.definicion(tabla); await validarRegistro(this, tabla, registro);
    const columnas = definicion.columnas.map(/** Obtiene la columna declarada para conservar el orden de los valores al guardar. */ function nombre(columna) { return columna.nombre; }); const valores = columnas.map(/** Convierte booleanos al entero SQLite y conserva intactos dinero y fechas. */ function valor(nombre) { const valor = registro[nombre]; return typeof valor === 'boolean' ? Number(valor) : valor; });
    const actualizacion = columnas.filter(/** Excluye la identidad de la actualización para preservar el UUID existente. */ function excluir(nombre) { return nombre !== 'id'; }).map(/** Construye una asignación de columna conocida para actualizar sin reemplazar el registro. */ function asignar(nombre) { return `${nombre}=excluded.${nombre}`; }).join(',');
    await this.conexion.run(`INSERT INTO ${tabla} (${columnas.join(',')}) VALUES (${columnas.map(/** Genera un marcador SQL para vincular valores sin interpolarlos en la sentencia. */ function parametro() { return '?'; }).join(',')})${insertar ? '' : ` ON CONFLICT(id) DO UPDATE SET ${actualizacion}`}`, valores, false);
  }
}
