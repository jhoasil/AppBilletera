import type { EntidadAuditada } from '../entidades/EntidadAuditada';
import type { ConsultaCatalogo, PaginaResultado } from '../repositorios/ConsultasRepositorio';

/** Datos comunes a catálogos editables; las entidades conservan sus campos específicos. */
export type EntidadCatalogo = EntidadAuditada & { nombre: string; activo: boolean; icono: string | null; color: string | null };

/** Puerto mínimo compartido por los cuatro repositorios de catálogo. */
export interface RepositorioCatalogo<Entidad extends EntidadCatalogo> {
  /** Obtiene una identidad vigente para editar sin recrearla. */
  obtenerPorId(id: string): Promise<Entidad | null>;
  /** Lista una página con activos e inactivos. */
  listar(consulta: ConsultaCatalogo): Promise<PaginaResultado<Entidad>>;
  /** Persiste datos y auditoría. */
  guardar(entidad: Entidad): Promise<void>;
}

/** Administra solamente catálogos: validación común, auditoría y activación, sin cálculos financieros. */
export class ServicioCatalogo<Entidad extends EntidadCatalogo> {
  /** Recibe el contrato y una validación específica, evitando dependencias de plataforma. */
  constructor(private readonly repositorio: RepositorioCatalogo<Entidad>, private readonly validar: (entidad: Entidad) => void) {}

  /** Consulta veinte registros por página; los inactivos permanecen visibles en Ajustes. */
  listar(pagina = 0): Promise<PaginaResultado<Entidad>> {
    return this.repositorio.listar({ limite: 20, desplazamiento: pagina * 20 });
  }

  /** Devuelve un catálogo por identidad para consultas y servicios de configuración. */
  obtener(id: string): Promise<Entidad | null> { return this.repositorio.obtenerPorId(id); }

  /** Crea o actualiza sin cambiar el UUID ni la fecha de creación de registros existentes. */
  async guardar(borrador: Entidad): Promise<void> {
    await this.repositorio.guardar(await this.preparar(borrador));
  }

  /** Valida y prepara la auditoría para operaciones que deben guardar varios registros juntos. */
  async preparar(borrador: Entidad): Promise<Entidad> {
    const nombre = borrador.nombre.trim();
    if (!nombre || nombre.length > 120) throw new Error('El nombre debe tener entre 1 y 120 caracteres.');
    if (borrador.color && !/^#[0-9a-f]{6}$/i.test(borrador.color)) throw new Error('El color debe tener formato hexadecimal, por ejemplo #005bea.');
    this.validar(borrador);
    const anterior = borrador.id ? await this.repositorio.obtenerPorId(borrador.id) : null;
    if (borrador.id && !anterior) throw new Error('El registro ya no está disponible; actualice el listado.');
    const ahora = new Date().toISOString();
    return { ...borrador, nombre, id: anterior?.id ?? crypto.randomUUID(), creadoEn: anterior?.creadoEn ?? ahora, actualizadoEn: ahora, eliminadoEn: null };
  }

  /** Activa o desactiva conservando el registro para su uso histórico. */
  async cambiarActivo(id: string, activo: boolean): Promise<void> {
    const entidad = await this.repositorio.obtenerPorId(id);
    if (!entidad) throw new Error('El registro ya no está disponible.');
    await this.guardar({ ...entidad, activo });
  }
}
