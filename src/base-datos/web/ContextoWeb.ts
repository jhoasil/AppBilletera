import type { NombreTabla } from '../migraciones/EsquemaBaseDatos';
import { tablasV1 } from '../migraciones/v1';

/** Representación física con nombres snake_case, sin objetos de dominio en el motor. */
export type RegistroWeb = Record<string, unknown>;

/** Convierte una solicitud IndexedDB a promesa sin cancelar su aborto automático ante errores. */
export function esperarSolicitud<Resultado>(solicitud: IDBRequest<Resultado>): Promise<Resultado> {
  /** Conecta los eventos de una solicitud con el resultado esperado. */
  function conectar(resolver: (valor: Resultado) => void, rechazar: (error: unknown) => void) {
    /** Entrega el resultado cuando el motor completa la solicitud. */
    function completar() { resolver(solicitud.result); }
    /** Propaga el error sin ocultarlo al motor ni a la transacción. */
    function fallar() { rechazar(solicitud.error ?? new Error('Falló una solicitud de datos.')); }
    solicitud.onsuccess = completar;
    solicitud.onerror = fallar;
  }
  return new Promise(conectar);
}

/** Traduce propiedades camelCase de dominio a columnas snake_case de persistencia. */
export function convertirRegistro(entidad: object): RegistroWeb {
  const registro: RegistroWeb = {};
  /** Inserta un guion bajo delante de cada letra mayúscula. */
  function separarLetra(letra: string) { return `_${letra.toLowerCase()}`; }
  for (const [nombre, valor] of Object.entries(entidad)) registro[nombre.replace(/[A-Z]/g, separarLetra)] = valor;
  return registro;
}

/** Reconstruye una entidad desde columnas físicas después de obtenerla en persistencia. */
export function convertirEntidad<Entidad extends object>(registro: RegistroWeb): Entidad {
  const entidad: Record<string, unknown> = {};
  /** Restaura la letra mayúscula al comienzo de cada palabra interna. */
  function unirPalabra(_coincidencia: string, letra: string) { return letra.toUpperCase(); }
  for (const [nombre, valor] of Object.entries(registro)) entidad[nombre.replace(/_([a-z])/g, unirPalabra)] = valor;
  return entidad as Entidad;
}

/** Acceso acotado a una transacción, con validación de tipos, restricciones y claves foráneas. */
export class ContextoWeb {
  /** Recibe la transacción creada por el adaptador; no abre conexiones adicionales. */
  constructor(private readonly transaccion: IDBTransaction) {}

  /** Obtiene un registro físico o null si no existe. */
  async obtener(tabla: NombreTabla, id: string): Promise<RegistroWeb | null> {
    return (await esperarSolicitud(this.transaccion.objectStore(tabla).get(id))) as RegistroWeb | undefined ?? null;
  }

  /** Recorre un almacén o índice dentro de la transacción, sin materializar todos sus registros. */
  recorrer(tabla: NombreTabla, visitar: (registro: RegistroWeb) => void, indice?: string, rango?: IDBKeyRange): Promise<void> {
    const almacen = this.transaccion.objectStore(tabla);
    const solicitud = (indice ? almacen.index(indice) : almacen).openCursor(rango);
    /** Conecta el cursor y mantiene sus solicitudes dentro de la misma transacción. */
    function conectar(resolver: () => void, rechazar: (error: unknown) => void) {
      /** Visita un registro y avanza; un fallo de validación rechaza la operación. */
      function avanzar() {
        const cursor = solicitud.result;
        if (!cursor) { resolver(); return; }
        try { visitar(cursor.value as RegistroWeb); cursor.continue(); } catch (error) { rechazar(error); }
      }
      /** Comunica el fallo del cursor a la operación llamante. */
      function fallar() { rechazar(solicitud.error); }
      solicitud.onsuccess = avanzar;
      solicitud.onerror = fallar;
    }
    return new Promise(conectar);
  }

  /** Valida y guarda; insertar exige un id nuevo, actualizar permite conservar el id existente. */
  async guardar(tabla: NombreTabla, registro: RegistroWeb, insertar = false): Promise<void> {
    const definicion = tablasV1.find(buscarTabla);
    /** Localiza la definición física de la tabla solicitada. */
    function buscarTabla(candidata: (typeof tablasV1)[number]) { return candidata.nombre === tabla; }
    if (!definicion) throw new Error('La tabla no pertenece al esquema disponible.');
    for (const columna of definicion.columnas) {
      const valor = registro[columna.nombre];
      if (valor === null && columna.permiteNulo) continue;
      let valido = false;
      switch (columna.tipo) {
        case 'entero': valido = typeof valor === 'number' && Number.isSafeInteger(valor) && valor >= (columna.minimo ?? -Number.MAX_SAFE_INTEGER) && valor <= (columna.maximo ?? Number.MAX_SAFE_INTEGER) && (!columna.distintoDeCero || valor !== 0); break;
        case 'booleano': valido = typeof valor === 'boolean'; break;
        case 'uuid': valido = typeof valor === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor); break;
        case 'moneda': valido = typeof valor === 'string' && /^[A-Z]{3}$/.test(valor); break;
        case 'fecha': valido = typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(Date.parse(valor)) && new Date(valor).toISOString().slice(0, 10) === valor; break;
        case 'instante': valido = typeof valor === 'string' && !Number.isNaN(Date.parse(valor)) && new Date(valor).toISOString() === valor; break;
        case 'texto': valido = typeof valor === 'string'; break;
      }
      if (!valido || (columna.valoresPermitidos && !columna.valoresPermitidos.includes(String(valor)))) throw new Error(`Valor inválido en ${tabla}.${columna.nombre}.`);
      if (columna.referencia && !(await this.obtener(columna.referencia, String(valor)))) throw new Error(`La referencia ${columna.nombre} no existe.`);
    }
    for (const restriccion of definicion.restricciones ?? []) {
      if (restriccion.tipo === 'distintos' && registro[restriccion.columnas[0]] === registro[restriccion.columnas[1]]) throw new Error('Origen y destino deben ser distintos.');
      if (restriccion.tipo === 'diferencia' && BigInt(registro[restriccion.resultado] as number) !== BigInt(registro[restriccion.minuendo] as number) - BigInt(registro[restriccion.sustraendo] as number)) throw new Error('La diferencia no coincide con los saldos.');
    }
    const almacen = this.transaccion.objectStore(tabla);
    await esperarSolicitud(insertar ? almacen.add(registro) : almacen.put(registro));
  }
}
