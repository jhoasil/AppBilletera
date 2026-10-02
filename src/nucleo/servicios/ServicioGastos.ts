import type { RepositorioGastos } from '../repositorios/RepositorioGastos';
import type { CargaGasto } from './CargaGasto';
import type { Gasto } from '../entidades/Gasto';
import type { DetalleGastoMedioPago } from '../entidades/DetalleGastoMedioPago';
import { instanteDeFecha, totalLineas } from './validarCarga';

/** Coordina carga de gastos y deja la atomicidad financiera al contrato de persistencia. */
export class ServicioGastos {
  /** Recibe un repositorio intercambiable sin conocer IndexedDB o SQLite. */
  constructor(private readonly repositorio: RepositorioGastos) {}

  /** Crea un gasto con identidad local y detalles positivos, sin guardar preferencias financieras. */
  async crear(carga: CargaGasto): Promise<void> {
    if (!carga.categoriaId || !carga.descripcion.trim()) throw new Error('Indicá una categoría y descripción.');
    instanteDeFecha(carga.fecha);
    const ahora = new Date().toISOString();
    const auditoria = { creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null };
    const gasto: Gasto = { ...auditoria, id: crypto.randomUUID(), categoriaId: carga.categoriaId, actividadId: carga.actividadId, fecha: carga.fecha, descripcion: carga.descripcion.trim(), observaciones: carga.observaciones.trim() || null, moneda: carga.moneda, importeCentavos: totalLineas(carga.lineas, carga.moneda) };
    /** Asigna identidad independiente a cada distribución persistida. */
    function preparar(linea: CargaGasto['lineas'][number]): DetalleGastoMedioPago { return { ...auditoria, ...linea, id: crypto.randomUUID(), gastoId: gasto.id }; }
    await this.repositorio.guardar(gasto, carga.lineas.map(preparar));
  }
}