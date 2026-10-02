import { RangoConsulta } from '../contracts/RangoConsulta';
import { validarPagina, rangoFechas, exigirCatalogoActivo } from './consultasWeb';
import type { RepositorioIngresos } from '../../core/repositories/RepositorioIngresos';
import type { Ingreso } from '../../core/entities/Ingreso';
import type { DetalleIngresoMedioPago } from '../../core/entities/DetalleIngresoMedioPago';
import type { MovimientoBilletera } from '../../core/entities/MovimientoBilletera';
import type { ConsultaOperaciones, PaginaResultado } from '../../core/repositories/ConsultasRepositorio';
import { instanteDeFecha, totalLineas } from '../../core/services/validarCarga';
import { baseWeb, prepararBaseWeb } from './baseWeb';
import { convertirEntidad, convertirRegistro, type ContextoWeb, type RegistroWeb } from './ContextoWeb';
import { invalidarRegistros } from './invalidarRegistros';

/** Persistencia de ingresos con cabecera, distribuciones y movimientos positivos inseparables. */
export class RepositorioIngresosWeb implements RepositorioIngresos {
  /** Consulta un ingreso vigente conservando su identidad. */
  async obtenerPorId(id: string): Promise<Ingreso | null> {
    await prepararBaseWeb();
    /** Adapta la cabecera leída desde el motor local. */
    async function leer(contexto: ContextoWeb) { const registro = await contexto.obtener('ingresos', id); return registro?.eliminado_en === null ? convertirEntidad<Ingreso>(registro) : null; }
    return baseWeb.ejecutarTransaccion({ recursos: ['ingresos'], modo: 'lectura' }, leer);
  }

  /** Consulta una página por fecha sin materializar la historia completa. */
  async listar(consulta: ConsultaOperaciones): Promise<PaginaResultado<Ingreso>> {
    validarPagina(consulta);
    await prepararBaseWeb();
    /** Cuenta coincidencias y retiene únicamente las posiciones solicitadas. */
    async function leer(contexto: ContextoWeb) {
      const elementos: Ingreso[] = []; let total = 0;
      /** Filtra cada registro antes de contar su posición ordenada. */
      function seleccionar(registro: RegistroWeb) {
        if ((!consulta.incluirEliminados && registro.eliminado_en !== null) || (consulta.actividadId && registro.actividad_id !== consulta.actividadId)) return;
        if (total >= consulta.desplazamiento && elementos.length < consulta.limite) elementos.push(convertirEntidad<Ingreso>(registro));
        total++;
      }
      await contexto.recorrerPorFecha('ingresos', 'por_fecha', rangoFechas(consulta.desde, consulta.hasta), seleccionar);
      return { elementos, total };
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['ingresos'], modo: 'lectura' }, leer);
  }

  /** Recupera únicamente los detalles vigentes de la operación solicitada. */
  async obtenerDetalles(ingresoId: string): Promise<readonly DetalleIngresoMedioPago[]> {
    await prepararBaseWeb();
    /** Recorre el índice de detalles de un ingreso específico. */
    async function leer(contexto: ContextoWeb) {
      const detalles: DetalleIngresoMedioPago[] = [];
      /** Excluye versiones históricas reemplazadas o eliminadas. */
      function seleccionar(registro: RegistroWeb) { if (registro.eliminado_en === null) detalles.push(convertirEntidad<DetalleIngresoMedioPago>(registro)); }
      await contexto.recorrer('ingresos_medios_pago', seleccionar, 'por_ingreso', RangoConsulta.unico(ingresoId));
      return detalles;
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['ingresos_medios_pago'], modo: 'lectura' }, leer);
  }

  /** Guarda los tres conjuntos en una transacción y valida catálogos y monedas dentro de ella. */
  async guardar(ingreso: Ingreso, detalles: readonly DetalleIngresoMedioPago[], actualizadoEnEsperado?: string): Promise<void> {
    if (ingreso.eliminadoEn !== null) throw new Error('No se puede guardar una operación eliminada como vigente.');
    if (totalLineas(detalles, ingreso.moneda) !== ingreso.importeCentavos) throw new Error('El total no coincide con los detalles.');
    const fechaMovimiento = instanteDeFecha(ingreso.fecha);
    await prepararBaseWeb();
    /** Inserta el ingreso y cada efecto financiero; cualquier fallo revierte todo. */
    async function escribir(contexto: ContextoWeb) {
      const anterior = await contexto.obtener('ingresos', ingreso.id);
      if (anterior && (anterior.eliminado_en !== null || !actualizadoEnEsperado || anterior.actualizado_en !== actualizadoEnEsperado)) throw new Error('El ingreso cambió o fue eliminado; volvé a abrirlo antes de editar.');
      if (!anterior && actualizadoEnEsperado) throw new Error('El ingreso ya no existe.');
      const anteriores: RegistroWeb[] = [];
      /** Recupera referencias históricas para permitir mantener catálogos inactivos durante una edición. */
      function recordar(registro: RegistroWeb) { if (registro.eliminado_en === null) anteriores.push(registro); }
      if (anterior) await contexto.recorrer('ingresos_medios_pago', recordar, 'por_ingreso', RangoConsulta.unico(ingreso.id));
      await exigirCatalogoActivo(contexto, 'actividades', ingreso.actividadId, anterior?.actividad_id === ingreso.actividadId);
      if (anterior) {
        await invalidarRegistros(contexto, 'ingresos_medios_pago', 'por_ingreso', RangoConsulta.unico(ingreso.id), ingreso.actualizadoEn);
        await invalidarRegistros(contexto, 'movimientos_billetera', 'por_referencia', RangoConsulta.unico(['ingreso', ingreso.id]), ingreso.actualizadoEn);
      }
      await contexto.guardar('ingresos', convertirRegistro(ingreso), !anterior);
      for (const detalle of detalles) {
        if (detalle.ingresoId !== ingreso.id || detalle.eliminadoEn !== null) throw new Error('El detalle pertenece a otro ingreso.');
        /** Reconoce una referencia ya utilizada para conservarla sin habilitar nuevas selecciones inactivas. */
        function coincideHistorico(registro: RegistroWeb) { return registro.medio_pago_id === detalle.medioPagoId && registro.billetera_id === detalle.billeteraId; }
        const historico = anteriores.some(coincideHistorico);
        await exigirCatalogoActivo(contexto, 'medios_pago', detalle.medioPagoId, historico);
        if (detalle.billeteraId) {
          const billetera = await exigirCatalogoActivo(contexto, 'billeteras', detalle.billeteraId, historico);
          if (billetera.moneda !== ingreso.moneda) throw new Error('La billetera y el ingreso deben tener la misma moneda.');
        }
        await contexto.guardar('ingresos_medios_pago', convertirRegistro(detalle), true);
        if (!detalle.billeteraId) continue;
        const movimiento: MovimientoBilletera = { id: crypto.randomUUID(), billeteraId: detalle.billeteraId, tipo: 'INGRESO', referenciaTipo: 'ingreso', referenciaId: ingreso.id, importeCentavos: detalle.importeCentavos, fecha: fechaMovimiento, descripcion: ingreso.descripcion, creadoEn: ingreso.actualizadoEn, actualizadoEn: ingreso.actualizadoEn, eliminadoEn: null };
        await contexto.guardar('movimientos_billetera', convertirRegistro(movimiento), true);
      }
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['ingresos', 'ingresos_medios_pago', 'movimientos_billetera', 'actividades', 'medios_pago', 'billeteras'], modo: 'escritura' }, escribir);
  }

  /** Invalida cabecera, detalles y movimientos juntos; un ingreso ausente no produce cambios. */
  async eliminarLogicamente(id: string, eliminadoEn: string, actualizadoEnEsperado?: string): Promise<void> {
    await prepararBaseWeb();
    /** Aplica un borrado trazable en el mismo alcance que las escrituras financieras. */
    async function eliminar(contexto: ContextoWeb) {
      const registro = await contexto.obtener('ingresos', id);
      if (!registro || registro.eliminado_en !== null) return;
      if (actualizadoEnEsperado && registro.actualizado_en !== actualizadoEnEsperado) throw new Error('El ingreso cambió; actualizá el listado antes de eliminar.');
      await invalidarRegistros(contexto, 'ingresos_medios_pago', 'por_ingreso', RangoConsulta.unico(id), eliminadoEn);
      await invalidarRegistros(contexto, 'movimientos_billetera', 'por_referencia', RangoConsulta.unico(['ingreso', id]), eliminadoEn);
      await contexto.guardar('ingresos', { ...registro, actualizado_en: eliminadoEn, eliminado_en: eliminadoEn });
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['ingresos', 'ingresos_medios_pago', 'movimientos_billetera', 'actividades', 'medios_pago', 'billeteras'], modo: 'escritura' }, eliminar);
  }
}
