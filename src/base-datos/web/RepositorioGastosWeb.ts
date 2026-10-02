import { validarPagina, rangoFechas, exigirCatalogoActivo } from './consultasWeb';
import type { RepositorioGastos } from '../../nucleo/repositorios/RepositorioGastos';
import type { Gasto } from '../../nucleo/entidades/Gasto';
import type { DetalleGastoMedioPago } from '../../nucleo/entidades/DetalleGastoMedioPago';
import type { MovimientoBilletera } from '../../nucleo/entidades/MovimientoBilletera';
import type { ConsultaGastos, PaginaResultado } from '../../nucleo/repositorios/ConsultasRepositorio';
import { instanteDeFecha, totalLineas } from '../../nucleo/servicios/validarCarga';
import { baseWeb, prepararBaseWeb } from './baseWeb';
import { convertirEntidad, convertirRegistro, type ContextoWeb, type RegistroWeb } from './ContextoWeb';

/** Persistencia de gastos con cabecera, distribuciones y movimientos negativos inseparables. */
export class RepositorioGastosWeb implements RepositorioGastos {
  /** Consulta un gasto vigente conservando su identidad. */
  async obtenerPorId(id: string): Promise<Gasto | null> {
    await prepararBaseWeb();
    /** Adapta la cabecera leída desde el motor local. */
    async function leer(contexto: ContextoWeb) { const registro = await contexto.obtener('gastos', id); return registro?.eliminado_en === null ? convertirEntidad<Gasto>(registro) : null; }
    return baseWeb.ejecutarTransaccion({ recursos: ['gastos'], modo: 'lectura' }, leer);
  }

  /** Consulta una página por fecha sin materializar la historia completa. */
  async listar(consulta: ConsultaGastos): Promise<PaginaResultado<Gasto>> {
    validarPagina(consulta);
    await prepararBaseWeb();
    /** Cuenta coincidencias y retiene únicamente las posiciones solicitadas. */
    async function leer(contexto: ContextoWeb) {
      const elementos: Gasto[] = []; let total = 0;
      /** Filtra cada registro antes de contar su posición ordenada. */
      function seleccionar(registro: RegistroWeb) {
        if ((consulta.categoriaId && registro.categoria_id !== consulta.categoriaId) || (!consulta.incluirEliminados && registro.eliminado_en !== null) || (consulta.actividadId && registro.actividad_id !== consulta.actividadId)) return;
        if (total >= consulta.desplazamiento && elementos.length < consulta.limite) elementos.push(convertirEntidad<Gasto>(registro));
        total++;
      }
      await contexto.recorrerPorFecha('gastos', 'por_fecha', rangoFechas(consulta.desde, consulta.hasta), seleccionar);
      return { elementos, total };
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['gastos'], modo: 'lectura' }, leer);
  }

  /** Recupera únicamente los detalles vigentes de la operación solicitada. */
  async obtenerDetalles(gastoId: string): Promise<readonly DetalleGastoMedioPago[]> {
    await prepararBaseWeb();
    /** Recorre el índice de detalles de un gasto específico. */
    async function leer(contexto: ContextoWeb) {
      const detalles: DetalleGastoMedioPago[] = [];
      /** Excluye versiones históricas reemplazadas o eliminadas. */
      function seleccionar(registro: RegistroWeb) { if (registro.eliminado_en === null) detalles.push(convertirEntidad<DetalleGastoMedioPago>(registro)); }
      await contexto.recorrer('gastos_medios_pago', seleccionar, 'por_gasto', IDBKeyRange.only(gastoId));
      return detalles;
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['gastos_medios_pago'], modo: 'lectura' }, leer);
  }

  /** Guarda los tres conjuntos en una transacción y valida catálogos y monedas dentro de ella. */
  async guardar(gasto: Gasto, detalles: readonly DetalleGastoMedioPago[]): Promise<void> {
    if (totalLineas(detalles, gasto.moneda) !== gasto.importeCentavos) throw new Error('El total no coincide con los detalles.');
    const fechaMovimiento = instanteDeFecha(gasto.fecha);
    await prepararBaseWeb();
    /** Inserta el gasto y cada efecto financiero; cualquier fallo revierte todo. */
    async function escribir(contexto: ContextoWeb) {
      if (await contexto.obtener('gastos', gasto.id)) throw new Error('El gasto ya existe; utilizá su edición.');
      await exigirCatalogoActivo(contexto, 'categorias_gasto', gasto.categoriaId);
      if (gasto.actividadId) await exigirCatalogoActivo(contexto, 'actividades', gasto.actividadId);
      await contexto.guardar('gastos', convertirRegistro(gasto), true);
      for (const detalle of detalles) {
        if (detalle.gastoId !== gasto.id) throw new Error('El detalle pertenece a otro gasto.');
        await exigirCatalogoActivo(contexto, 'medios_pago', detalle.medioPagoId);
        if (detalle.billeteraId) {
          const billetera = await exigirCatalogoActivo(contexto, 'billeteras', detalle.billeteraId);
          if (billetera.moneda !== gasto.moneda) throw new Error('La billetera y el gasto deben tener la misma moneda.');
        }
        await contexto.guardar('gastos_medios_pago', convertirRegistro(detalle), true);
        if (!detalle.billeteraId) continue;
        const movimiento: MovimientoBilletera = { id: crypto.randomUUID(), billeteraId: detalle.billeteraId, tipo: 'GASTO', referenciaTipo: 'gasto', referenciaId: gasto.id, importeCentavos: -detalle.importeCentavos, fecha: fechaMovimiento, descripcion: gasto.descripcion, creadoEn: gasto.creadoEn, actualizadoEn: gasto.actualizadoEn, eliminadoEn: null };
        await contexto.guardar('movimientos_billetera', convertirRegistro(movimiento), true);
      }
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['gastos', 'gastos_medios_pago', 'movimientos_billetera', 'actividades', 'categorias_gasto', 'medios_pago', 'billeteras'], modo: 'escritura' }, escribir);
  }

  /** La invalidación se habilitará junto al ABM; nunca realiza un borrado parcial. */
  async eliminarLogicamente(_id: string, _eliminadoEn: string): Promise<void> { throw new Error('El borrado de gastos se incorporará con su ABM.'); }
}

