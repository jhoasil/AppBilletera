import { servicioActividades, servicioMedios, servicioBilleteras } from './serviciosCatalogos';
import type { ServicioCatalogo, EntidadCatalogo } from '../../nucleo/servicios/ServicioCatalogo';

/** Consulta páginas pequeñas de catálogos; no carga operaciones financieras. */
export async function listarCatalogo<Entidad extends EntidadCatalogo>(servicio: ServicioCatalogo<Entidad>): Promise<readonly Entidad[]> {
  const elementos: Entidad[] = [];
  for (let numero = 0; ; numero++) {
    const pagina = await servicio.listar(numero);
    elementos.push(...pagina.elementos);
    if (elementos.length >= pagina.total || pagina.elementos.length === 0) return elementos;
  }
}

/** Ofrece los catálogos que consume el formulario sin exponer el almacenamiento físico. */
export async function cargarDatosIngreso() {
  const [actividades, medios, billeteras] = await Promise.all([
    listarCatalogo(servicioActividades), listarCatalogo(servicioMedios), listarCatalogo(servicioBilleteras),
  ]);
  return { actividades, medios, billeteras };
}
