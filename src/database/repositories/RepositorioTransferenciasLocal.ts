import { RangoConsulta } from '../contracts/RangoConsulta';
import type { RepositorioTransferencias } from '../../core/repositories/RepositorioTransferencias';
import type { TransferenciaBilletera } from '../../core/entities/TransferenciaBilletera';
import type { MovimientoBilletera } from '../../core/entities/MovimientoBilletera';
import type { ConsultaTransferencias, PaginaResultado } from '../../core/repositories/ConsultasRepositorio';
import { instanteDeFecha } from '../../core/services/validarCarga';
import { baseLocal, prepararBaseLocal } from '../componerBaseLocal';
import { convertirEntidad, convertirRegistro } from '../contracts/convertirRegistros';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';
import { exigirCatalogoActivo, validarPagina } from './consultasDatos';
import { invalidarRegistros } from './invalidarRegistros';

/** Guarda transferencias y sus dos efectos financieros, sin escribir ingresos ni gastos. */
export class RepositorioTransferenciasLocal implements RepositorioTransferencias {
  /** Consulta una transferencia vigente por identidad. */
  async obtenerPorId(id: string): Promise<TransferenciaBilletera | null> {
    await prepararBaseLocal();
    /** Adapta el registro solicitado sin exponer almacenamiento a la aplicación. */
    async function leer(contexto: ContextoDatos) { const registro = await contexto.obtener('transferencias_billeteras', id); return registro?.eliminado_en === null ? convertirEntidad<TransferenciaBilletera>(registro) : null; }
    return baseLocal.ejecutarTransaccion({ recursos: ['transferencias_billeteras'], modo: 'lectura' }, leer);
  }

  /** Retiene un conjunto acotado de candidatos ordenados y cuenta coincidencias desde persistencia. */
  async listar(consulta: ConsultaTransferencias): Promise<PaginaResultado<TransferenciaBilletera>> {
    validarPagina(consulta);
    if (consulta.desde && consulta.hasta && consulta.desde > consulta.hasta) throw new Error('El período no es válido.');
    await prepararBaseLocal();
    /** Consulta solo transferencias; los movimientos y saldos utilizan sus propios índices. */
    async function leer(contexto: ContextoDatos) {
      const candidatos: TransferenciaBilletera[] = []; let total = 0;
      /** Ordena por fecha descendente e identidad ascendente. */
      function comparar(a: TransferenciaBilletera, b: TransferenciaBilletera) { return b.fecha.localeCompare(a.fecha) || a.id.localeCompare(b.id); }
      /** Aplica filtros y mantiene únicamente las posiciones necesarias para la página. */
      function seleccionar(registro: RegistroDatos) {
        if ((!consulta.incluirEliminados && registro.eliminado_en !== null) || (consulta.desde && String(registro.fecha) < consulta.desde) || (consulta.hasta && String(registro.fecha) > consulta.hasta) || (consulta.billeteraId && registro.billetera_origen_id !== consulta.billeteraId && registro.billetera_destino_id !== consulta.billeteraId)) return;
        total++; candidatos.push(convertirEntidad<TransferenciaBilletera>(registro)); candidatos.sort(comparar);
        if (candidatos.length > consulta.desplazamiento + consulta.limite) candidatos.pop();
      }
      await contexto.recorrer('transferencias_billeteras', seleccionar);
      return { total, elementos: candidatos.slice(consulta.desplazamiento) };
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['transferencias_billeteras'], modo: 'lectura' }, leer);
  }

  /** Crea o reemplaza ambos movimientos atómicamente y exige la versión esperada para editar. */
  async guardar(transferencia: TransferenciaBilletera, actualizadoEnEsperado?: string): Promise<void> {
    if (transferencia.billeteraOrigenId === transferencia.billeteraDestinoId || !Number.isSafeInteger(transferencia.importeCentavos) || transferencia.importeCentavos <= 0 || transferencia.eliminadoEn !== null) throw new Error('La transferencia no es válida.');
    const fecha = instanteDeFecha(transferencia.fecha);
    await prepararBaseLocal();
    /** Conserva patrimonio mediante una entrada y una salida de igual magnitud. */
    async function escribir(contexto: ContextoDatos) {
      const anterior = await contexto.obtener('transferencias_billeteras', transferencia.id);
      if (anterior && (anterior.eliminado_en !== null || !actualizadoEnEsperado || anterior.actualizado_en !== actualizadoEnEsperado)) throw new Error('La transferencia cambió; volvé a consultarla.');
      if (!anterior && actualizadoEnEsperado) throw new Error('La transferencia ya no existe.');
      const origen = await exigirCatalogoActivo(contexto, 'billeteras', transferencia.billeteraOrigenId, anterior?.billetera_origen_id === transferencia.billeteraOrigenId);
      const destino = await exigirCatalogoActivo(contexto, 'billeteras', transferencia.billeteraDestinoId, anterior?.billetera_destino_id === transferencia.billeteraDestinoId);
      if (origen.moneda !== destino.moneda || origen.moneda !== transferencia.moneda) throw new Error('Las dos billeteras deben tener la misma moneda; no se realizan conversiones.');
      if (anterior) await invalidarRegistros(contexto, 'movimientos_billetera', 'por_referencia', RangoConsulta.unico(['transferencia', transferencia.id]), transferencia.actualizadoEn);
      await contexto.guardar('transferencias_billeteras', convertirRegistro(transferencia), !anterior);
      const auditoria = { creadoEn: transferencia.actualizadoEn, actualizadoEn: transferencia.actualizadoEn, eliminadoEn: null };
      const comun = { ...auditoria, referenciaTipo: 'transferencia' as const, referenciaId: transferencia.id, fecha, descripcion: transferencia.descripcion };
      const salida: MovimientoBilletera = { ...comun, id: crypto.randomUUID(), billeteraId: transferencia.billeteraOrigenId, tipo: 'TRANSFERENCIA_SALIDA', importeCentavos: -transferencia.importeCentavos };
      const entrada: MovimientoBilletera = { ...comun, id: crypto.randomUUID(), billeteraId: transferencia.billeteraDestinoId, tipo: 'TRANSFERENCIA_ENTRADA', importeCentavos: transferencia.importeCentavos };
      await contexto.guardar('movimientos_billetera', convertirRegistro(salida), true);
      await contexto.guardar('movimientos_billetera', convertirRegistro(entrada), true);
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['transferencias_billeteras', 'billeteras', 'movimientos_billetera'], modo: 'escritura' }, escribir);
  }

  /** Invalida una transferencia y ambos efectos, sin tocar ingresos, gastos ni rentabilidad. */
  async eliminarLogicamente(id: string, eliminadoEn: string): Promise<void> {
    await prepararBaseLocal();
    /** Conserva registros auditados y elimina únicamente su efecto vigente. */
    async function eliminar(contexto: ContextoDatos) {
      const registro = await contexto.obtener('transferencias_billeteras', id);
      if (!registro || registro.eliminado_en !== null) return;
      await invalidarRegistros(contexto, 'movimientos_billetera', 'por_referencia', RangoConsulta.unico(['transferencia', id]), eliminadoEn);
      await contexto.guardar('transferencias_billeteras', { ...registro, actualizado_en: eliminadoEn, eliminado_en: eliminadoEn });
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['transferencias_billeteras', 'billeteras', 'movimientos_billetera'], modo: 'escritura' }, eliminar);
  }
}
