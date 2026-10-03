import type { Billetera } from '../../core/entities/Billetera';
import { ServicioSaldoInicial } from '../../core/services/ServicioSaldoInicial';
import { RepositorioSaldoInicialLocal } from '../../database/repositories/RepositorioSaldoInicialLocal';
import { servicioBilleteras } from './serviciosCatalogos';

export const servicioSaldoInicial = new ServicioSaldoInicial(new RepositorioSaldoInicialLocal());

/** Crea la billetera y su saldo juntos cuando hay importe; una edición nunca modifica el saldo. */
export async function guardarBilletera(borrador: Billetera, importe: string, fecha: string): Promise<void> {
  if (borrador.id || !importe.trim()) return servicioBilleteras.guardar(borrador);
  const billetera = await servicioBilleteras.preparar(borrador);
  await servicioSaldoInicial.registrar(billetera.id, importe, fecha, billetera);
}
