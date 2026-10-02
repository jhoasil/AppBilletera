import type { RepositorioIngresos } from '../repositorios/RepositorioIngresos';
import type { CargaIngreso } from './CargaIngreso';
import type { Ingreso } from '../entidades/Ingreso';
import type { DetalleIngresoMedioPago } from '../entidades/DetalleIngresoMedioPago';
import { instanteDeFecha, totalLineas } from './validarCarga';

/** Coordina carga de ingresos y deja la atomicidad financiera al contrato de persistencia. */
export class ServicioIngresos {
  /** Recibe un repositorio intercambiable sin conocer IndexedDB o SQLite. */
  constructor(private readonly repositorio: RepositorioIngresos) {}

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
