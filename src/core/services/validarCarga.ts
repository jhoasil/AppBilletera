import type { LineaCobro } from './CargaIngreso';

/** Rechaza días inexistentes y devuelve su medianoche local como instante UTC para movimientos. */
export function instanteDeFecha(fecha: string): string {
  const comprobacion = new Date(`${fecha}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !Number.isFinite(comprobacion.getTime()) || comprobacion.toISOString().slice(0, 10) !== fecha) throw new Error('Indicá una fecha válida.');
  return new Date(`${fecha}T00:00:00`).toISOString();
}

/** Comprueba distribuciones positivas y suma exactamente antes de convertir al rango persistible. */
export function totalLineas(lineas: readonly LineaCobro[], moneda: string): number {
  if (!/^[A-Z]{3}$/.test(moneda)) throw new Error('La moneda debe tener tres letras mayúsculas.');
  let total = 0n;
  for (const linea of lineas) {
    if (!Number.isSafeInteger(linea.importeCentavos) || linea.importeCentavos <= 0) throw new Error('Cada detalle debe tener un importe entero positivo.');
    if (!linea.medioPagoId) throw new Error('Seleccioná el medio de cada detalle.');
    if (!linea.billeteraId) throw new Error('Seleccioná la billetera real de cada detalle con importe.');
    total += BigInt(linea.importeCentavos);
  }
  if (total <= 0n || total > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('El total debe ser positivo y estar dentro del rango admitido.');
  return Number(total);
}
