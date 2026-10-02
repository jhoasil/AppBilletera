import type { RepositorioGastos } from '../repositories/RepositorioGastos';
import type { CargaGasto } from './CargaGasto';
import type { Gasto } from '../entities/Gasto';
import type { DetalleGastoMedioPago } from '../entities/DetalleGastoMedioPago';
import { instanteDeFecha, totalLineas } from './validarCarga';
import type { ConsultaGastos } from '../repositories/ConsultasRepositorio';

/** Coordina carga de gastos y deja la atomicidad financiera al contrato de persistencia. */
export class ServicioGastos {
  /** Recibe un repositorio intercambiable sin conocer IndexedDB o SQLite. */
  constructor(private readonly repositorio: RepositorioGastos) {}

  /** Consulta una página de gastos con filtros de período y actividad. */
  listar(consulta: ConsultaGastos) { return this.repositorio.listar(consulta); }

  /** Obtiene cabecera y detalles para consulta o edición conservando su versión de auditoría. */
  async obtener(id: string) {
    const gasto = await this.repositorio.obtenerPorId(id);
    if (!gasto) throw new Error('El gasto ya no está disponible.');
    const lineas = await this.repositorio.obtenerDetalles(id);
    const carga: CargaGasto = { categoriaId: gasto.categoriaId, actividadId: gasto.actividadId, fecha: gasto.fecha, descripcion: gasto.descripcion ?? '', observaciones: gasto.observaciones ?? '', moneda: gasto.moneda, lineas };
    return { entidad: gasto, carga };
  }

  /** Reemplaza detalles y efectos financieros mediante control de la versión leída por el usuario. */
  async editar(id: string, carga: CargaGasto, actualizadoEnEsperado: string): Promise<void> {
    const anterior = await this.repositorio.obtenerPorId(id);
    if (!anterior || anterior.actualizadoEn !== actualizadoEnEsperado) throw new Error('El gasto cambió; volvé a abrirlo antes de editar.');
    if (!carga.categoriaId || !carga.descripcion.trim()) throw new Error('Indicá una categoría y descripción.');
    instanteDeFecha(carga.fecha);
    const ahora = new Date(Math.max(Date.now(), Date.parse(anterior.actualizadoEn) + 1)).toISOString();
    const gasto: Gasto = { ...anterior, categoriaId: carga.categoriaId, actividadId: carga.actividadId || null, fecha: carga.fecha, descripcion: carga.descripcion.trim(), observaciones: carga.observaciones.trim() || null, moneda: carga.moneda, importeCentavos: totalLineas(carga.lineas, carga.moneda), actualizadoEn: ahora };
    /** Crea nuevas identidades para conservar los detalles anteriores como historia. */
    function preparar(linea: CargaGasto['lineas'][number]): DetalleGastoMedioPago { return { ...linea, id: crypto.randomUUID(), gastoId: id, creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null }; }
    await this.repositorio.guardar(gasto, carga.lineas.map(preparar), actualizadoEnEsperado);
  }

  /** Elimina lógicamente todos los efectos del gasto y protege contra ediciones concurrentes. */
  eliminar(id: string, actualizadoEnEsperado: string) { return this.repositorio.eliminarLogicamente(id, new Date().toISOString(), actualizadoEnEsperado); }

  /** Crea un gasto con identidad local y detalles positivos, sin guardar preferencias financieras. */
  async crear(carga: CargaGasto): Promise<void> {
    if (!carga.categoriaId || !carga.descripcion.trim()) throw new Error('Indicá una categoría y descripción.');
    instanteDeFecha(carga.fecha);
    const ahora = new Date().toISOString();
    const auditoria = { creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null };
    const gasto: Gasto = { ...auditoria, id: crypto.randomUUID(), categoriaId: carga.categoriaId, actividadId: carga.actividadId || null, fecha: carga.fecha, descripcion: carga.descripcion.trim(), observaciones: carga.observaciones.trim() || null, moneda: carga.moneda, importeCentavos: totalLineas(carga.lineas, carga.moneda) };
    /** Asigna identidad independiente a cada distribución persistida. */
    function preparar(linea: CargaGasto['lineas'][number]): DetalleGastoMedioPago { return { ...auditoria, ...linea, id: crypto.randomUUID(), gastoId: gasto.id }; }
    await this.repositorio.guardar(gasto, carga.lineas.map(preparar));
  }
}
