import { RangoConsulta } from '../contracts/RangoConsulta';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';

/** Rechaza instantes no canónicos para mantener las comparaciones y rangos de índices consistentes. */
export function validarInstante(instante: string): void {
  const fecha = new Date(instante);
  if (!Number.isFinite(fecha.getTime()) || fecha.toISOString() !== instante) throw new Error('El instante del período no es válido.');
}

/** Delimita una billetera y su período mediante el índice compuesto; los extremos son inclusivos. */
export function rangoBilletera(id: string, desde?: string, hasta?: string): RangoConsulta {
  if (!id) throw new Error('Seleccioná una billetera.');
  if (desde) validarInstante(desde);
  if (hasta) validarInstante(hasta);
  if (desde && hasta && desde > hasta) throw new Error('El período no es válido.');
  return RangoConsulta.acotar([id, desde ?? ''], [id, hasta ?? '\uffff']);
}

/** Convierte el resultado de una agregación exacta al entero seguro admitido por el dominio. */
export function convertirSaldo(saldo: bigint): number {
  if (saldo > BigInt(Number.MAX_SAFE_INTEGER) || saldo < BigInt(Number.MIN_SAFE_INTEGER)) throw new Error('El saldo supera el rango monetario admitido.');
  return Number(saldo);
}

/** Suma en persistencia sobre un cursor de la billetera; nunca entrega ni acumula sus movimientos. */
export async function sumarSaldo(contexto: ContextoDatos, billeteraId: string, hasta?: string): Promise<number> {
  let saldo = 0n;
  /** Agrega exclusivamente los importes vigentes, en centavos exactos. */
  function agregar(registro: RegistroDatos) {
    if (registro.eliminado_en !== null) return;
    if (typeof registro.importe_centavos !== 'number' || !Number.isSafeInteger(registro.importe_centavos)) throw new Error('Un movimiento contiene un importe inválido.');
    saldo += BigInt(registro.importe_centavos);
  }
  await contexto.recorrer('movimientos_billetera', agregar, 'por_billetera_fecha', rangoBilletera(billeteraId, undefined, hasta));
  return convertirSaldo(saldo);
}
