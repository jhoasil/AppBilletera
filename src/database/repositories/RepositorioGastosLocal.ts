import { RangoConsulta } from '../contracts/RangoConsulta';
import { validarPagina, rangoFechas, exigirCatalogoActivo } from './consultasDatos';
import type { RepositorioGastos } from '../../core/repositories/RepositorioGastos';
import type { Gasto } from '../../core/entities/Gasto';
import type { DetalleGastoMedioPago } from '../../core/entities/DetalleGastoMedioPago';
import type { MovimientoBilletera } from '../../core/entities/MovimientoBilletera';
import type { ConsultaGastos, PaginaResultado } from '../../core/repositories/ConsultasRepositorio';
import { instanteDeFecha, totalLineas } from '../../core/services/validarCarga';
import { baseLocal, prepararBaseLocal } from '../componerBaseLocal';
import { convertirEntidad, convertirRegistro } from '../contracts/convertirRegistros';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';
import { invalidarRegistros } from './invalidarRegistros';

/** Persistencia de gastos con cabecera, distribuciones y movimientos negativos inseparables. */
export class RepositorioGastosLocal implements RepositorioGastos {
  /** Consulta un gasto vigente conservando su identidad. */
  async obtenerPorId(id: string): Promise<Gasto | null> {
    await prepararBaseLocal();
    /** Adapta la cabecera leída desde el motor local. */
    async function leer(contexto: ContextoDatos) { const registro = await contexto.obtener('gastos', id); return registro?.eliminado_en === null ? convertirEntidad<Gasto>(registro) : null; }
    return baseLocal.ejecutarTransaccion({ recursos: ['gastos'], modo: 'lectura' }, leer);
  }

  /** Consulta una página por fecha sin materializar la historia completa. */
  async listar(consulta: ConsultaGastos): Promise<PaginaResultado<Gasto>> {
    validarPagina(consulta);
    await prepararBaseLocal();
    /** Cuenta coincidencias y retiene únicamente las posiciones solicitadas. */
    async function leer(contexto: ContextoDatos) {
      const elementos: Gasto[] = []; let total = 0;
      /** Filtra cada registro antes de contar su posición ordenada. */
      function seleccionar(registro: RegistroDatos) {
        if ((consulta.categoriaId && registro.categoria_id !== consulta.categoriaId) || (!consulta.incluirEliminados && registro.eliminado_en !== null) || (consulta.actividadId && registro.actividad_id !== consulta.actividadId)) return;
        if (total >= consulta.desplazamiento && elementos.length < consulta.limite) elementos.push(convertirEntidad<Gasto>(registro));
        total++;
      }
      await contexto.recorrerPorFecha('gastos', 'por_fecha', rangoFechas(consulta.desde, consulta.hasta), seleccionar);
      return { elementos, total };
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['gastos'], modo: 'lectura' }, leer);
  }

  /** Recupera únicamente los detalles vigentes de la operación solicitada. */
  async obtenerDetalles(gastoId: string): Promise<readonly DetalleGastoMedioPago[]> {
    await prepararBaseLocal();
    /** Recorre el índice de detalles de un gasto específico. */
    async function leer(contexto: ContextoDatos) {
      const detalles: DetalleGastoMedioPago[] = [];
      /** Excluye versiones históricas reemplazadas o eliminadas. */
      function seleccionar(registro: RegistroDatos) { if (registro.eliminado_en === null) detalles.push(convertirEntidad<DetalleGastoMedioPago>(registro)); }
      await contexto.recorrer('gastos_medios_pago', seleccionar, 'por_gasto', RangoConsulta.unico(gastoId));
      return detalles;
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['gastos_medios_pago'], modo: 'lectura' }, leer);
  }

  /** Guarda los tres conjuntos en una transacción y valida catálogos y monedas dentro de ella. */
  async guardar(gasto: Gasto, detalles: readonly DetalleGastoMedioPago[], actualizadoEnEsperado?: string): Promise<void> {
    if (gasto.eliminadoEn !== null) throw new Error('No se puede guardar una operación eliminada como vigente.');
    if (totalLineas(detalles, gasto.moneda) !== gasto.importeCentavos) throw new Error('El total no coincide con los detalles.');
    const fechaMovimiento = instanteDeFecha(gasto.fecha);
    await prepararBaseLocal();
    /** Inserta el gasto y cada efecto financiero; cualquier fallo revierte todo. */
    async function escribir(contexto: ContextoDatos) {
      const anterior = await contexto.obtener('gastos', gasto.id);
      if (anterior && (anterior.eliminado_en !== null || !actualizadoEnEsperado || anterior.actualizado_en !== actualizadoEnEsperado)) throw new Error('El gasto cambió o fue eliminado; volvé a abrirlo antes de editar.');
      if (!anterior && actualizadoEnEsperado) throw new Error('El gasto ya no existe.');
      const anteriores: RegistroDatos[] = [];
      /** Recupera referencias históricas para permitir mantener catálogos inactivos durante una edición. */
      function recordar(registro: RegistroDatos) { if (registro.eliminado_en === null) anteriores.push(registro); }
      if (anterior) await contexto.recorrer('gastos_medios_pago', recordar, 'por_gasto', RangoConsulta.unico(gasto.id));
      await exigirCatalogoActivo(contexto, 'categorias_gasto', gasto.categoriaId, anterior?.categoria_id === gasto.categoriaId);
      if (gasto.actividadId) await exigirCatalogoActivo(contexto, 'actividades', gasto.actividadId, anterior?.actividad_id === gasto.actividadId);
      if (anterior) {
        await invalidarRegistros(contexto, 'gastos_medios_pago', 'por_gasto', RangoConsulta.unico(gasto.id), gasto.actualizadoEn);
        await invalidarRegistros(contexto, 'movimientos_billetera', 'por_referencia', RangoConsulta.unico(['gasto', gasto.id]), gasto.actualizadoEn);
      }
      await contexto.guardar('gastos', convertirRegistro(gasto), !anterior);
      for (const detalle of detalles) {
        if (detalle.gastoId !== gasto.id || detalle.eliminadoEn !== null) throw new Error('El detalle pertenece a otro gasto.');
        /** Reconoce una referencia ya utilizada para conservarla sin habilitar nuevas selecciones inactivas. */
        function coincideHistorico(registro: RegistroDatos) { return registro.medio_pago_id === detalle.medioPagoId && registro.billetera_id === detalle.billeteraId; }
        const historico = anteriores.some(coincideHistorico);
        await exigirCatalogoActivo(contexto, 'medios_pago', detalle.medioPagoId, historico);
        if (detalle.billeteraId) {
          const billetera = await exigirCatalogoActivo(contexto, 'billeteras', detalle.billeteraId, historico);
          if (billetera.moneda !== gasto.moneda) throw new Error('La billetera y el gasto deben tener la misma moneda.');
        }
        await contexto.guardar('gastos_medios_pago', convertirRegistro(detalle), true);
        if (!detalle.billeteraId) continue;
        const movimiento: MovimientoBilletera = { id: crypto.randomUUID(), billeteraId: detalle.billeteraId, tipo: 'GASTO', referenciaTipo: 'gasto', referenciaId: gasto.id, importeCentavos: -detalle.importeCentavos, fecha: fechaMovimiento, descripcion: gasto.descripcion, creadoEn: gasto.actualizadoEn, actualizadoEn: gasto.actualizadoEn, eliminadoEn: null };
        await contexto.guardar('movimientos_billetera', convertirRegistro(movimiento), true);
      }
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['gastos', 'gastos_medios_pago', 'movimientos_billetera', 'actividades', 'categorias_gasto', 'medios_pago', 'billeteras'], modo: 'escritura' }, escribir);
  }

  /** Invalida cabecera, detalles y movimientos juntos; un gasto ausente no produce cambios. */
  async eliminarLogicamente(id: string, eliminadoEn: string, actualizadoEnEsperado?: string): Promise<void> {
    await prepararBaseLocal();
    /** Aplica un borrado trazable en el mismo alcance que las escrituras financieras. */
    async function eliminar(contexto: ContextoDatos) {
      const registro = await contexto.obtener('gastos', id);
      if (!registro || registro.eliminado_en !== null) return;
      if (actualizadoEnEsperado && registro.actualizado_en !== actualizadoEnEsperado) throw new Error('El gasto cambió; actualizá el listado antes de eliminar.');
      await invalidarRegistros(contexto, 'gastos_medios_pago', 'por_gasto', RangoConsulta.unico(id), eliminadoEn);
      await invalidarRegistros(contexto, 'movimientos_billetera', 'por_referencia', RangoConsulta.unico(['gasto', id]), eliminadoEn);
      await contexto.guardar('gastos', { ...registro, actualizado_en: eliminadoEn, eliminado_en: eliminadoEn });
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['gastos', 'gastos_medios_pago', 'movimientos_billetera', 'actividades', 'categorias_gasto', 'medios_pago', 'billeteras'], modo: 'escritura' }, eliminar);
  }
}
