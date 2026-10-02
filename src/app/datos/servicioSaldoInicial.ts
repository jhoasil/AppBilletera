import type { Billetera } from '../../core/entidades/Billetera';
import { ServicioSaldoInicial } from '../../core/servicios/ServicioSaldoInicial';
import { RepositorioSaldoInicialWeb } from '../../database/web/RepositorioSaldoInicialWeb';
import { servicioBilleteras } from './serviciosCatalogos';

export const servicioSaldoInicial = new ServicioSaldoInicial(new RepositorioSaldoInicialWeb());

/** Crea la billetera y su saldo juntos cuando hay importe; una edición nunca modifica el saldo. */
export async function guardarBilletera(borrador: Billetera, importe: string, fecha: string): Promise<void> {
  if (borrador.id || !importe.trim()) return servicioBilleteras.guardar(borrador);
  const billetera = await servicioBilleteras.preparar(borrador);
  await servicioSaldoInicial.registrar(billetera.id, importe, fecha, billetera);
}
