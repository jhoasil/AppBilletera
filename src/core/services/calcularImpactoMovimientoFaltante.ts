import type { Billetera } from '../entities/Billetera';
import type { LineaCobro } from './CargaIngreso';
import { crearImporte, sumarImportes, restarImportes } from '../money/Importe';

/** Prepara el impacto esperado únicamente en la billetera conciliada, reutilizando las operaciones monetarias del dominio. */
export function calcularImpactoMovimientoFaltante(saldoCentavos: number, billetera: Billetera, moneda: string, lineas: readonly LineaCobro[], tipo: 'ingreso' | 'gasto') {
  if (moneda !== billetera.moneda) throw new Error('El movimiento faltante debe usar la moneda de la billetera conciliada.');
  let importe = crearImporte(0, moneda);
  for (const linea of lineas) if (linea.billeteraId === billetera.id) importe = sumarImportes(importe, crearImporte(linea.importeCentavos, moneda));
  const saldo = crearImporte(saldoCentavos, moneda);
  return { movimientoCentavos: tipo === 'ingreso' ? importe.centavos : -importe.centavos, saldoEsperadoCentavos: (tipo === 'ingreso' ? sumarImportes(saldo, importe) : restarImportes(saldo, importe)).centavos };
}
