import { interpretarImporte } from '../money/interpretarImporte';
import { crearImporte, restarImportes } from '../money/Importe';

/** Compara el saldo real declarado con el calculado usando centavos enteros exactos. */
export function calcularConciliacion(saldoCalculadoCentavos: number, saldoReal: string, moneda: string) {
  const saldoRealCentavos = interpretarImporte(saldoReal);
  const diferenciaCentavos = restarImportes(crearImporte(saldoRealCentavos, moneda), crearImporte(saldoCalculadoCentavos, moneda)).centavos;
  return { saldoRealCentavos, diferenciaCentavos };
}

/** Confirmación de conciliación con el saldo observado para detectar cambios durante la edición. */
export interface ConfirmacionConciliacion {
  billeteraId: string; saldoEsperadoCentavos: number; saldoRealCentavos: number; motivo: string; observaciones: string;
}
