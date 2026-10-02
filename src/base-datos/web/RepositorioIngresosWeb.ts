import type { RepositorioIngresos } from '../../nucleo/repositorios/RepositorioIngresos';
import type { Ingreso } from '../../nucleo/entidades/Ingreso';
import type { DetalleIngresoMedioPago } from '../../nucleo/entidades/DetalleIngresoMedioPago';
import type { MovimientoBilletera } from '../../nucleo/entidades/MovimientoBilletera';
import type { ConsultaOperaciones, PaginaResultado } from '../../nucleo/repositorios/ConsultasRepositorio';
import { instanteDeFecha, totalLineas } from '../../nucleo/servicios/validarCarga';
import { baseWeb, prepararBaseWeb } from './baseWeb';
import { convertirEntidad, convertirRegistro, type ContextoWeb, type RegistroWeb } from './ContextoWeb';

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
      await contexto.recorrer('ingresos_medios_pago', seleccionar, 'por_ingreso', IDBKeyRange.only(ingresoId));
      return detalles;
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['ingresos_medios_pago'], modo: 'lectura' }, leer);
  }

  /** Guarda los tres conjuntos en una transacción y valida catálogos y monedas dentro de ella. */
  async guardar(ingreso: Ingreso, detalles: readonly DetalleIngresoMedioPago[]): Promise<void> {
    if (totalLineas(detalles, ingreso.moneda) !== ingreso.importeCentavos) throw new Error('El total no coincide con los detalles.');
    const fechaMovimiento = instanteDeFecha(ingreso.fecha);
    await prepararBaseWeb();
    /** Inserta el ingreso y cada efecto financiero; cualquier fallo revierte todo. */
    async function escribir(contexto: ContextoWeb) {
      if (await contexto.obtener('ingresos', ingreso.id)) throw new Error('El ingreso ya existe; utilizá su edición.');
      await exigirCatalogoActivo(contexto, 'actividades', ingreso.actividadId);
      await contexto.guardar('ingresos', convertirRegistro(ingreso), true);
      for (const detalle of detalles) {
        if (detalle.ingresoId !== ingreso.id) throw new Error('El detalle pertenece a otro ingreso.');
        await exigirCatalogoActivo(contexto, 'medios_pago', detalle.medioPagoId);
        if (detalle.billeteraId) {
          const billetera = await exigirCatalogoActivo(contexto, 'billeteras', detalle.billeteraId);
          if (billetera.moneda !== ingreso.moneda) throw new Error('La billetera y el ingreso deben tener la misma moneda.');
        }
        await contexto.guardar('ingresos_medios_pago', convertirRegistro(detalle), true);
        if (!detalle.billeteraId) continue;
        const movimiento: MovimientoBilletera = { id: crypto.randomUUID(), billeteraId: detalle.billeteraId, tipo: 'INGRESO', referenciaTipo: 'ingreso', referenciaId: ingreso.id, importeCentavos: detalle.importeCentavos, fecha: fechaMovimiento, descripcion: ingreso.descripcion, creadoEn: ingreso.creadoEn, actualizadoEn: ingreso.actualizadoEn, eliminadoEn: null };
        await contexto.guardar('movimientos_billetera', convertirRegistro(movimiento), true);
      }
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['ingresos', 'ingresos_medios_pago', 'movimientos_billetera', 'actividades', 'medios_pago', 'billeteras'], modo: 'escritura' }, escribir);
  }

  /** La invalidación se habilitará junto al ABM; nunca realiza un borrado parcial. */
  async eliminarLogicamente(_id: string, _eliminadoEn: string): Promise<void> { throw new Error('El borrado de ingresos se incorporará con su ABM.'); }
}

/** Valida paginación acotada antes de abrir una transacción de consulta. */
export function validarPagina(consulta: { limite: number; desplazamiento: number }): void {
  if (!Number.isSafeInteger(consulta.limite) || consulta.limite < 1 || consulta.limite > 100 || !Number.isSafeInteger(consulta.desplazamiento) || consulta.desplazamiento < 0) throw new Error('La paginación no es válida.');
}

/** Delimita un período inclusivo para aprovechar el índice de fecha. */
export function rangoFechas(desde?: string, hasta?: string): IDBKeyRange | undefined {
  if (desde && hasta && desde > hasta) throw new Error('El inicio del período no puede superar su fin.');
  if (desde && hasta) return IDBKeyRange.bound(desde, hasta);
  if (desde) return IDBKeyRange.lowerBound(desde);
  if (hasta) return IDBKeyRange.upperBound(hasta);
  return undefined;
}

/** Comprueba disponibilidad dentro de la escritura para impedir referencias obsoletas desde otra pestaña. */
export async function exigirCatalogoActivo(contexto: ContextoWeb, tabla: 'actividades' | 'medios_pago' | 'billeteras' | 'categorias_gasto', id: string): Promise<RegistroWeb> {
  const registro = await contexto.obtener(tabla, id);
  if (!registro || registro.eliminado_en !== null || !registro.activo) throw new Error('Una selección ya no está activa; actualizá los catálogos antes de guardar.');
  return registro;
}
