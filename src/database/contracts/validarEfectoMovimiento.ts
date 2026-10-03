import type { ContextoDatos, RegistroDatos } from './ContextoDatos';
import { RangoConsulta } from './RangoConsulta';

/** Impide efectos duplicados y comprueba el origen real dentro de la transacción de escritura del motor. */
export async function validarEfectoMovimiento(contexto: Pick<ContextoDatos, 'obtener' | 'recorrer'>, movimiento: RegistroDatos): Promise<void> {
  if (movimiento.eliminado_en !== null) return;
  const referencia = movimiento.referencia_tipo;
  // V1 ambiguo queda preservado para revisión; los repositorios nunca crean estas referencias nuevas.
  if (['ingreso', 'gasto', 'transferencia', 'ajuste'].includes(String(referencia))) return;
  if (movimiento.tipo === 'SALDO_INICIAL') {
    if (referencia !== null || movimiento.referencia_id !== null) throw new Error('El saldo inicial no admite una referencia de otra operación.');
    /** Mantiene un único saldo inicial por billetera, incluso cuando el anterior fue eliminado lógicamente. */
    function comprobarInicial(otro: RegistroDatos): void {
      if (otro.tipo === 'SALDO_INICIAL' && otro.id !== movimiento.id) throw new Error('La billetera ya tiene un saldo inicial registrado.');
    }
    await contexto.recorrer('movimientos_billetera', comprobarInicial, 'por_billetera_fecha', RangoConsulta.acotar([String(movimiento.billetera_id), ''], [String(movimiento.billetera_id), '\uffff']));
    return;
  }
  const tablas = { INGRESO_MEDIO_PAGO: 'ingresos_medios_pago', GASTO_MEDIO_PAGO: 'gastos_medios_pago', TRANSFERENCIA: 'transferencias_billeteras', AJUSTE: 'ajustes_billetera' } as const;
  const tabla = tablas[referencia as keyof typeof tablas];
  if (!tabla || typeof movimiento.referencia_id !== 'string') throw new Error('El movimiento debe identificar su origen financiero.');
  const origen = await contexto.obtener(tabla, movimiento.referencia_id);
  if (!origen || origen.eliminado_en !== null) throw new Error('El origen del movimiento no está vigente.');
  let tipo: string; let billetera: unknown; let importe: number;
  if (referencia === 'TRANSFERENCIA') {
    if (!['TRANSFERENCIA_ENTRADA', 'TRANSFERENCIA_SALIDA'].includes(String(movimiento.tipo))) throw new Error('El tipo de la transferencia es inválido.');
    tipo = String(movimiento.tipo);
    billetera = tipo === 'TRANSFERENCIA_ENTRADA' ? origen.billetera_destino_id : origen.billetera_origen_id;
    importe = Number(origen.importe_centavos) * (tipo === 'TRANSFERENCIA_ENTRADA' ? 1 : -1);
  } else if (referencia === 'AJUSTE') {
    importe = Number(origen.diferencia_centavos); tipo = importe > 0 ? 'AJUSTE_POSITIVO' : 'AJUSTE_NEGATIVO'; billetera = origen.billetera_id;
  } else {
    tipo = referencia === 'INGRESO_MEDIO_PAGO' ? 'INGRESO' : 'GASTO'; billetera = origen.billetera_id;
    importe = Number(origen.importe_centavos) * (tipo === 'INGRESO' ? 1 : -1);
  }
  if (!billetera || movimiento.tipo !== tipo || movimiento.billetera_id !== billetera || movimiento.importe_centavos !== importe) throw new Error('El efecto no coincide con su detalle u operación de origen.');
  /** Detecta otro efecto vigente para la misma identidad lógica, incluso si tiene un UUID distinto. */
  function comprobar(otro: RegistroDatos): void {
    if (otro.eliminado_en === null && otro.tipo === movimiento.tipo && otro.id !== movimiento.id) throw new Error('El efecto financiero ya fue registrado.');
  }
  await contexto.recorrer('movimientos_billetera', comprobar, 'por_referencia', RangoConsulta.unico([String(referencia), movimiento.referencia_id]));
}
