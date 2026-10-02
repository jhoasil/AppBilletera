import type { MedioPago } from '../../nucleo/entidades/MedioPago';
import type { Billetera } from '../../nucleo/entidades/Billetera';
import type { RepositorioMediosPago } from '../../nucleo/repositorios/RepositorioMediosPago';
import type { RepositorioBilleteras } from '../../nucleo/repositorios/RepositorioBilleteras';
import { ServicioCatalogo } from '../../nucleo/servicios/ServicioCatalogo';
import { RepositorioCatalogoWeb } from '../../base-datos/web/RepositorioCatalogoWeb';

const repositorioMedios: RepositorioMediosPago = new RepositorioCatalogoWeb<MedioPago>('medios_pago');
const repositorioBilleteras: RepositorioBilleteras = new RepositorioCatalogoWeb<Billetera>('billeteras');

/** Valida preferencias propias del medio antes de persistirlas. */
function validarMedio(medio: MedioPago) {
  if (!Number.isSafeInteger(medio.orden) || medio.orden < 0) throw new Error('El orden debe ser un entero no negativo.');
}

/** Servicio de medios; la composición de infraestructura permanece fuera de las pantallas. */
export const servicioMedios = new ServicioCatalogo(repositorioMedios, validarMedio);

/** Obtiene todas las billeteras activas recorriendo páginas acotadas, para ofrecer destinos editables. */
export async function listarBilleterasActivas(): Promise<readonly Billetera[]> {
  const billeteras: Billetera[] = [];
  let desplazamiento = 0;
  while (true) {
    const pagina = await repositorioBilleteras.listar({ limite: 100, desplazamiento, activo: true });
    billeteras.push(...pagina.elementos);
    desplazamiento += pagina.elementos.length;
    if (desplazamiento >= pagina.total || pagina.elementos.length === 0) break;
  }
  return billeteras;
}
