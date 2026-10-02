import type { MedioPago } from '../../core/entidades/MedioPago';
import type { Billetera } from '../../core/entidades/Billetera';
import type { CategoriaGasto } from '../../core/entidades/CategoriaGasto';
import type { Actividad } from '../../core/entidades/Actividad';
import type { RepositorioActividades } from '../../core/repositorios/RepositorioActividades';
import type { RepositorioCategoriasGasto } from '../../core/repositorios/RepositorioCategoriasGasto';
import type { RepositorioMediosPago } from '../../core/repositorios/RepositorioMediosPago';
import type { RepositorioBilleteras } from '../../core/repositorios/RepositorioBilleteras';
import { ServicioCatalogo } from '../../core/servicios/ServicioCatalogo';
import { validarActividad } from '../../core/servicios/validarActividad';
import { RepositorioCatalogoWeb } from '../../database/web/RepositorioCatalogoWeb';

const repositorioMedios: RepositorioMediosPago = new RepositorioCatalogoWeb<MedioPago>('medios_pago');
const repositorioBilleteras: RepositorioBilleteras = new RepositorioCatalogoWeb<Billetera>('billeteras');

/** Valida clasificación y código monetario sin almacenar un saldo en la billetera. */
function validarBilletera(billetera: Billetera) {
  if (!billetera.tipo.trim()) throw new Error('Indicá el tipo de billetera.');
  if (!/^[A-Z]{3}$/.test(billetera.moneda)) throw new Error('La moneda debe tener tres letras mayúsculas, por ejemplo ARS.');
}

export const servicioBilleteras = new ServicioCatalogo(repositorioBilleteras, validarBilletera);

/** Valida preferencias propias del medio antes de persistirlas. */
function validarMedio(medio: MedioPago) {
  if (!Number.isSafeInteger(medio.orden) || medio.orden < 0) throw new Error('El orden debe ser un entero no negativo.');
}

/** Servicio de medios; la composición de infraestructura permanece fuera de las pantallas. */
export const servicioMedios = new ServicioCatalogo(repositorioMedios, validarMedio);

/** Las categorías no necesitan reglas específicas adicionales al nombre y color comunes. */
function validarCategoria(_categoria: CategoriaGasto): void {}

const repositorioCategorias: RepositorioCategoriasGasto = new RepositorioCatalogoWeb<CategoriaGasto>('categorias_gasto');
export const servicioCategorias = new ServicioCatalogo(repositorioCategorias, validarCategoria);

const repositorioActividades: RepositorioActividades = new RepositorioCatalogoWeb<Actividad>('actividades');
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
