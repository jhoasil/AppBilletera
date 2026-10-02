import type { EntidadAuditada } from '../../core/entities/EntidadAuditada';
import type { ConsultaCatalogo, PaginaResultado } from '../../core/repositories/ConsultasRepositorio';
import type { NombreTabla } from '../migrations/EsquemaBaseDatos';
import { tablasV1 } from '../migrations/v1';
import { baseWeb, prepararBaseWeb } from './baseWeb';
import { convertirEntidad, convertirRegistro, type ContextoWeb, type RegistroWeb } from './ContextoWeb';

/** Catálogo persistente con auditoría; reutiliza el comportamiento técnico de los cuatro contratos. */
export class RepositorioCatalogoWeb<Entidad extends EntidadAuditada & { nombre: string; activo: boolean }> {
  /** Selecciona únicamente la tabla de catálogo que administrará esta instancia. */
  constructor(private readonly tabla: 'actividades' | 'categorias_gasto' | 'medios_pago' | 'billeteras') {}

  /** Obtiene un catálogo vigente sin ocultar sus registros inactivos. */
  async obtenerPorId(id: string): Promise<Entidad | null> {
    await prepararBaseWeb();
    /** Lee y adapta el registro dentro de la transacción. */
    const leer = async (contexto: ContextoWeb) => {
      const registro = await contexto.obtener(this.tabla, id);
      return registro && registro.eliminado_en === null ? convertirEntidad<Entidad>(registro) : null;
    };
    return baseWeb.ejecutarTransaccion({ recursos: [this.tabla], modo: 'lectura' }, leer);
  }

  /** Filtra y pagina dentro de persistencia; solo los catálogos pequeños se ordenan en memoria. */
  async listar(consulta: ConsultaCatalogo): Promise<PaginaResultado<Entidad>> {
    if (!Number.isSafeInteger(consulta.limite) || consulta.limite < 1 || !Number.isSafeInteger(consulta.desplazamiento) || consulta.desplazamiento < 0) throw new Error('La paginación no es válida.');
    await prepararBaseWeb();
    /** Recorre solamente el catálogo solicitado y entrega una página ordenada. */
    const leer = async (contexto: ContextoWeb) => {
      const elementos: Entidad[] = [];
      /** Selecciona registros con los filtros recibidos. */
      function seleccionar(registro: RegistroWeb) {
        if ((!consulta.incluirEliminados && registro.eliminado_en !== null) || (consulta.activo !== undefined && registro.activo !== consulta.activo)) return;
        elementos.push(convertirEntidad<Entidad>(registro));
      }
      await contexto.recorrer(this.tabla, seleccionar);
      /** Ordena medios por orden, y todos los catálogos por nombre e identidad. */
      function comparar(a: Entidad, b: Entidad) {
        const ordenA = 'orden' in a ? Number(a.orden) : 0;
        const ordenB = 'orden' in b ? Number(b.orden) : 0;
        return ordenA - ordenB || a.nombre.localeCompare(b.nombre, 'es') || a.id.localeCompare(b.id);
      }
      elementos.sort(comparar);
      return { total: elementos.length, elementos: elementos.slice(consulta.desplazamiento, consulta.desplazamiento + consulta.limite) };
    };
    return baseWeb.ejecutarTransaccion({ recursos: [this.tabla], modo: 'lectura' }, leer);
  }

  /** Persiste un catálogo con sus FK, conservando el registro histórico. */
  async guardar(entidad: Entidad): Promise<void> {
    await prepararBaseWeb();
    /** Escribe usando una transacción común que incluye las tablas referenciadas. */
    const escribir = async (contexto: ContextoWeb) => {
      const registro = convertirRegistro(entidad);
      if (this.tabla === 'billeteras') {
        const anterior = await contexto.obtener('billeteras', entidad.id);
        if (anterior && anterior.moneda !== registro.moneda) {
          let tieneHistorial = false;
          /** Conserva la unidad monetaria de cualquier historial, incluido el borrado lógico. */
          function comprobar(_movimiento: RegistroWeb) { tieneHistorial = true; }
          await contexto.recorrer('movimientos_billetera', comprobar, 'por_billetera_fecha', IDBKeyRange.bound([entidad.id, ''], [entidad.id, '\uffff']));
          if (tieneHistorial) throw new Error('No se puede cambiar la moneda de una billetera con movimientos registrados.');
        }
      }
      await contexto.guardar(this.tabla, registro);
    };
    return baseWeb.ejecutarTransaccion({ recursos: tablasV1.map(nombreTabla), modo: 'escritura' }, escribir);
  }

  /** Invalida sin borrado físico y no falla si la identidad no existe. */
  async eliminarLogicamente(id: string, eliminadoEn: string): Promise<void> {
    await prepararBaseWeb();
    /** Conserva los datos existentes y actualiza su auditoría. */
    const eliminar = async (contexto: ContextoWeb) => {
      const registro = await contexto.obtener(this.tabla, id);
      if (registro) await contexto.guardar(this.tabla, { ...registro, actualizado_en: eliminadoEn, eliminado_en: eliminadoEn });
    };
    return baseWeb.ejecutarTransaccion({ recursos: tablasV1.map(nombreTabla), modo: 'escritura' }, eliminar);
  }
}

/** Proporciona el alcance de una escritura con integridad referencial. */
export function nombreTabla(tabla: { nombre: NombreTabla }): NombreTabla { return tabla.nombre; }
