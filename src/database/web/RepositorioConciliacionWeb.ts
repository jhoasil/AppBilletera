import type { RepositorioConciliacion } from '../../core/repositories/RepositorioConciliacion';
import type { ConfirmacionConciliacion } from '../../core/services/calcularConciliacion';
import type { AjusteBilletera } from '../../core/entities/AjusteBilletera';
import type { MovimientoBilletera } from '../../core/entities/MovimientoBilletera';
import { crearImporte, restarImportes } from '../../core/money/Importe';
import { baseWeb, prepararBaseWeb } from './baseWeb';
import { convertirRegistro, type ContextoWeb } from './ContextoWeb';
import { exigirCatalogoActivo } from './consultasWeb';
import { sumarSaldo } from './consultasSaldoWeb';

/** Registra ajustes separados del resultado y marca también las coincidencias sin movimiento. */
export class RepositorioConciliacionWeb implements RepositorioConciliacion {
  /** Relee el saldo dentro de la transacción para proteger la confirmación de modificaciones concurrentes. */
  async confirmar(datos: ConfirmacionConciliacion): Promise<void> {
    await prepararBaseWeb();
    /** Guarda billetera, diferencia y movimiento juntos; cualquier error revierte toda la conciliación. */
    async function escribir(contexto: ContextoWeb) {
      const billetera = await exigirCatalogoActivo(contexto, 'billeteras', datos.billeteraId);
      const saldo = await sumarSaldo(contexto, datos.billeteraId);
      if (saldo !== datos.saldoEsperadoCentavos) throw new Error('El saldo cambió. Actualizalo antes de confirmar la conciliación.');
      const diferencia = restarImportes(crearImporte(datos.saldoRealCentavos), crearImporte(saldo)).centavos;
      if (diferencia !== 0 && !datos.motivo.trim()) throw new Error('Indicá el motivo del ajuste.');
      const instante = new Date(Math.max(Date.now(), Date.parse(String(billetera.actualizado_en)) + 1)).toISOString();
      const auditoria = { creadoEn: instante, actualizadoEn: instante, eliminadoEn: null };
      if (diferencia !== 0) {
        const ajuste: AjusteBilletera = { id: crypto.randomUUID(), billeteraId: datos.billeteraId, fecha: instante, saldoCalculadoCentavos: saldo, saldoRealCentavos: datos.saldoRealCentavos, diferenciaCentavos: diferencia, motivo: datos.motivo, observaciones: datos.observaciones || null, ...auditoria };
        const movimiento: MovimientoBilletera = { id: crypto.randomUUID(), billeteraId: datos.billeteraId, tipo: diferencia > 0 ? 'AJUSTE_POSITIVO' : 'AJUSTE_NEGATIVO', referenciaTipo: 'ajuste', referenciaId: ajuste.id, importeCentavos: diferencia, fecha: instante, descripcion: datos.motivo, ...auditoria };
        await contexto.guardar('ajustes_billetera', convertirRegistro(ajuste), true);
        await contexto.guardar('movimientos_billetera', convertirRegistro(movimiento), true);
      }
      await contexto.guardar('billeteras', { ...billetera, conciliado_en: instante, actualizado_en: instante });
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['billeteras', 'ajustes_billetera', 'movimientos_billetera'], modo: 'escritura' }, escribir);
  }
}
