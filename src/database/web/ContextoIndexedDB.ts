import type { RegistroDatos } from '../contracts/ContextoDatos';
import type { NombreTabla } from '../migrations/EsquemaBaseDatos';
import { validarRegistro } from '../contracts/validarRegistro';
import type { ContextoDatos } from '../contracts/ContextoDatos';
import type { RangoConsulta } from '../contracts/RangoConsulta';


/** Representación física con nombres snake_case, sin objetos de dominio en el motor. */


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

/** Acceso acotado a una transacción, con validación de tipos, restricciones y claves foráneas. */
export class ContextoIndexedDB implements ContextoDatos {
  /** Recibe la transacción creada por el adaptador; no abre conexiones adicionales. */
  constructor(private readonly transaccion: IDBTransaction) {}

  /** Consulta una marca técnica sin mezclarla con registros de negocio. */
  async obtenerMarca(id: string): Promise<boolean> {
    return Boolean(await esperarSolicitud(this.transaccion.objectStore('_metadatos').get(id)));
  }

  /** Marca una preparación en la misma transacción que sus datos iniciales. */
  async guardarMarca(id: string): Promise<void> {
    await esperarSolicitud(this.transaccion.objectStore('_metadatos').put({ id }));
  }

  /** Obtiene un registro físico o null si no existe. */
  async obtener(tabla: NombreTabla, id: string): Promise<RegistroDatos | null> {
    return (await esperarSolicitud(this.transaccion.objectStore(tabla).get(id))) as RegistroDatos | undefined ?? null;
  }

  /** Recorre un almacén o índice dentro de la transacción, sin materializar todos sus registros. */
  recorrer(tabla: NombreTabla, visitar: (registro: RegistroDatos) => void, indice?: string, rango?: RangoConsulta): Promise<void> {
    const almacen = this.transaccion.objectStore(tabla);
    const solicitud = (indice ? almacen.index(indice) : almacen).openCursor(convertirRango(rango));
    /** Conecta el cursor y mantiene sus solicitudes dentro de la misma transacción. */
    function conectar(resolver: () => void, rechazar: (error: unknown) => void) {
      /** Visita un registro y avanza; un fallo de validación rechaza la operación. */
      function avanzar() {
        const cursor = solicitud.result;
        if (!cursor) { resolver(); return; }
        try { visitar(cursor.value as RegistroDatos); cursor.continue(); } catch (error) { rechazar(error); }
      }
      /** Comunica el fallo del cursor a la operación llamante. */
      function fallar() { rechazar(solicitud.error); }
      solicitud.onsuccess = avanzar;
      solicitud.onerror = fallar;
    }
    return new Promise(conectar);
  }

  /** Recorre por fecha descendente y UUID ascendente usando cursores, sin cargar todos los registros. */
  recorrerAsincrono(tabla: NombreTabla, visitar: (registro: RegistroDatos) => Promise<void>, indice?: string, rango?: RangoConsulta): Promise<void> {
    const almacen = this.transaccion.objectStore(tabla);
    const solicitud = (indice ? almacen.index(indice) : almacen).openCursor(convertirRango(rango));
    /** Conecta el cursor a visitas que solo pueden esperar solicitudes de esta misma transacción. */
    function conectar(resolver: () => void, rechazar: (error: unknown) => void) {
      /** Espera las lecturas dependientes antes de avanzar para no acumular identificadores del período. */
      async function avanzar() { const cursor = solicitud.result; if (!cursor) { resolver(); return; } try { await visitar(cursor.value as RegistroDatos); cursor.continue(); } catch (error) { rechazar(error); } }
      /** Propaga un error del motor al coordinador transaccional. */
      function fallar() { rechazar(solicitud.error); }
      solicitud.onsuccess = avanzar; solicitud.onerror = fallar;
    }
    return new Promise(conectar);
  }

  /** Recorre por fecha descendente y UUID ascendente usando cursores, sin cargar todos los registros. */
  recorrerPorFecha(tabla: NombreTabla, indice: string, rango: RangoConsulta | undefined, visitar: (registro: RegistroDatos) => void): Promise<void> {
    const fuente = this.transaccion.objectStore(tabla).index(indice);
    const solicitud = fuente.openKeyCursor(convertirRango(rango), 'prev');
    /** Procesa fechas descendentes y, dentro de cada fecha, UUID ascendentes sin acumular historia. */
    function conectar(resolver: () => void, rechazar: (error: unknown) => void) {
      let claveAnterior = '';
      /** Abre un cursor ascendente solamente para la fecha actual y luego continúa con las anteriores. */
      function avanzar() {
        const cursor = solicitud.result;
        if (!cursor) { resolver(); return; }
        const cursorFecha = cursor;
        const clave = JSON.stringify(cursor.key);
        if (clave === claveAnterior) { cursor.continue(); return; }
        claveAnterior = clave;
        const grupo = fuente.openCursor(IDBKeyRange.only(cursor.key), 'next');
        /** Visita una operación respetando el desempate por UUID ascendente. */
        function leerGrupo() {
          const actual = grupo.result;
          if (!actual) { cursorFecha.continue(); return; }
          try { visitar(actual.value as RegistroDatos); actual.continue(); } catch (error) { rechazar(error); }
        }
        /** Propaga errores del cursor sin confirmar una consulta incompleta. */
        function fallarGrupo() { rechazar(grupo.error); }
        grupo.onsuccess = leerGrupo; grupo.onerror = fallarGrupo;
      }
      /** Propaga el fallo del índice principal. */
      function fallar() { rechazar(solicitud.error); }
      solicitud.onsuccess = avanzar; solicitud.onerror = fallar;
    }
    return new Promise(conectar);
  }

  /** Valida y guarda; insertar exige un id nuevo, actualizar permite conservar el id existente. */
  async guardar(tabla: NombreTabla, registro: RegistroDatos, insertar = false): Promise<void> {
    await validarRegistro(this, tabla, registro);
    const almacen = this.transaccion.objectStore(tabla);
    await esperarSolicitud(insertar ? almacen.add(registro) : almacen.put(registro));
  }
}

/** Traduce el rango portable únicamente en la frontera IndexedDB. */
function convertirRango(rango?: RangoConsulta): IDBKeyRange | undefined { if (!rango) return undefined; if (rango.inferior !== undefined && rango.superior !== undefined) return IDBKeyRange.bound(rango.inferior as IDBValidKey, rango.superior as IDBValidKey); if (rango.inferior !== undefined) return IDBKeyRange.lowerBound(rango.inferior as IDBValidKey); if (rango.superior !== undefined) return IDBKeyRange.upperBound(rango.superior as IDBValidKey); return undefined; }
