import type { RepositorioIngresos } from '../repositories/RepositorioIngresos';
import type { CargaIngreso } from './CargaIngreso';
import type { Ingreso } from '../entities/Ingreso';
import type { DetalleIngresoMedioPago } from '../entities/DetalleIngresoMedioPago';
import { instanteDeFecha, totalLineas } from './validarCarga';
import type { ConsultaOperaciones } from '../repositories/ConsultasRepositorio';

/** Coordina carga de ingresos y deja la atomicidad financiera al contrato de persistencia. */
export class ServicioIngresos {
  /** Recibe un repositorio intercambiable sin conocer IndexedDB o SQLite. */
  constructor(private readonly repositorio: RepositorioIngresos) {}

  /** Consulta una página de ingresos con filtros de período y actividad. */
  listar(consulta: ConsultaOperaciones) { return this.repositorio.listar(consulta); }

  /** Obtiene cabecera y detalles para consulta o edición conservando su versión de auditoría. */
  async obtener(id: string) {
    const ingreso = await this.repositorio.obtenerPorId(id);
    if (!ingreso) throw new Error('El ingreso ya no está disponible.');
    const lineas = await this.repositorio.obtenerDetalles(id);
    const carga: CargaIngreso = { actividadId: ingreso.actividadId, fecha: ingreso.fecha, descripcion: ingreso.descripcion ?? '', observaciones: ingreso.observaciones ?? '', moneda: ingreso.moneda, lineas };
    return { entidad: ingreso, carga };
  }

  /** Reemplaza detalles y efectos financieros mediante control de la versión leída por el usuario. */
  async editar(id: string, carga: CargaIngreso, actualizadoEnEsperado: string): Promise<void> {
    const anterior = await this.repositorio.obtenerPorId(id);
    if (!anterior || anterior.actualizadoEn !== actualizadoEnEsperado) throw new Error('El ingreso cambió; volvé a abrirlo antes de editar.');
    if (!carga.actividadId) throw new Error('Seleccioná una actividad.');
    instanteDeFecha(carga.fecha);
    const ahora = new Date(Math.max(Date.now(), Date.parse(anterior.actualizadoEn) + 1)).toISOString();
    const ingreso: Ingreso = { ...anterior, actividadId: carga.actividadId, fecha: carga.fecha, descripcion: carga.descripcion.trim() || null, observaciones: carga.observaciones.trim() || null, moneda: carga.moneda, importeCentavos: totalLineas(carga.lineas, carga.moneda), actualizadoEn: ahora };
    /** Crea nuevas identidades para conservar los detalles anteriores como historia. */
    function preparar(linea: CargaIngreso['lineas'][number]): DetalleIngresoMedioPago { return { ...linea, id: crypto.randomUUID(), ingresoId: id, creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null }; }
    await this.repositorio.guardar(ingreso, carga.lineas.map(preparar), actualizadoEnEsperado);
  }

  /** Elimina lógicamente todos los efectos del ingreso y protege contra ediciones concurrentes. */
  eliminar(id: string, actualizadoEnEsperado: string) { return this.repositorio.eliminarLogicamente(id, new Date().toISOString(), actualizadoEnEsperado); }

  /** Crea un ingreso con identidad local y detalles positivos, sin guardar preferencias financieras. */
  async crear(carga: CargaIngreso): Promise<void> {
    if (!carga.actividadId) throw new Error('Seleccioná una actividad.');
    instanteDeFecha(carga.fecha);
    const ahora = new Date().toISOString();
    const auditoria = { creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null };
    const ingreso: Ingreso = { ...auditoria, id: crypto.randomUUID(), actividadId: carga.actividadId, fecha: carga.fecha, descripcion: carga.descripcion.trim() || null, observaciones: carga.observaciones.trim() || null, moneda: carga.moneda, importeCentavos: totalLineas(carga.lineas, carga.moneda) };
    /** Asigna identidad independiente a cada distribución persistida. */
    function preparar(linea: CargaIngreso['lineas'][number]): DetalleIngresoMedioPago { return { ...auditoria, ...linea, id: crypto.randomUUID(), ingresoId: ingreso.id }; }
    await this.repositorio.guardar(ingreso, carga.lineas.map(preparar));
  }
}
