import { ServicioBilleteras } from '../../core/services/ServicioBilleteras';
import type { MedioPago } from '../../core/entities/MedioPago';
import type { Billetera } from '../../core/entities/Billetera';
import type { CategoriaGasto } from '../../core/entities/CategoriaGasto';
import type { Actividad } from '../../core/entities/Actividad';
import type { RepositorioActividades } from '../../core/repositories/RepositorioActividades';
import type { RepositorioCategoriasGasto } from '../../core/repositories/RepositorioCategoriasGasto';
import type { RepositorioMediosPago } from '../../core/repositories/RepositorioMediosPago';
import type { RepositorioBilleteras } from '../../core/repositories/RepositorioBilleteras';
import { ServicioCatalogo } from '../../core/services/ServicioCatalogo';
import { validarActividad } from '../../core/services/validarActividad';
import { RepositorioCatalogoLocal } from '../../database/repositories/RepositorioCatalogoLocal';

const repositorioMedios: RepositorioMediosPago = new RepositorioCatalogoLocal<MedioPago>('medios_pago');
const repositorioBilleteras: RepositorioBilleteras = new RepositorioCatalogoLocal<Billetera>('billeteras');

/** Valida clasificación y código monetario sin almacenar un saldo en la billetera. */
function validarBilletera(billetera: Billetera) {
  if (billetera.tipo !== 'efectivo' && billetera.tipo !== 'digital') throw new Error('Indicá el tipo de billetera.');
  if (!/^[A-Z]{3}$/.test(billetera.moneda)) throw new Error('La moneda debe tener tres letras mayúsculas, por ejemplo ARS.');
}

export const servicioBilleteras = new ServicioBilleteras(repositorioBilleteras, validarBilletera);

/** Valida preferencias propias del medio antes de persistirlas. */
function validarMedio(medio: MedioPago) {
  if (!Number.isSafeInteger(medio.orden) || medio.orden < 0) throw new Error('El orden debe ser un entero no negativo.');
}

/** Servicio de medios; la composición de infraestructura permanece fuera de las pantallas. */
export const servicioMedios = new ServicioCatalogo(repositorioMedios, validarMedio);

/** Las categorías no necesitan reglas específicas adicionales al nombre y color comunes. */
function validarCategoria(_categoria: CategoriaGasto): void {}

const repositorioCategorias: RepositorioCategoriasGasto = new RepositorioCatalogoLocal<CategoriaGasto>('categorias_gasto');
export const servicioCategorias = new ServicioCatalogo(repositorioCategorias, validarCategoria);

const repositorioActividades: RepositorioActividades = new RepositorioCatalogoLocal<Actividad>('actividades');
export const servicioActividades = new ServicioCatalogo(repositorioActividades, validarActividad);

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
