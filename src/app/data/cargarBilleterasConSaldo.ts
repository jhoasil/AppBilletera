import { servicioConsultaBilleteras } from './servicioConsultaBilleteras';
import type { BilleteraConSaldo } from '../../core/repositories/RepositorioConsultaBilleteras';

/** Consulta páginas de billeteras y saldos agregados en persistencia para los selectores de transferencia. */
export async function cargarBilleterasConSaldo(): Promise<readonly BilleteraConSaldo[]> {
  const elementos: BilleteraConSaldo[] = [];
  for (let numero = 0; ; numero++) {
    const pagina = await servicioConsultaBilleteras.listar(numero);
    elementos.push(...pagina.elementos);
    if (elementos.length >= pagina.total || !pagina.elementos.length) return elementos.filter(/** Ofrece solo billeteras disponibles para una nueva operación. */ function activa(elemento) { return elemento.billetera.activo; });
  }
}
