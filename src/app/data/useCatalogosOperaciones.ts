import { useEffect, useState } from 'react';
import { cargarDatosIngreso } from './datosCargaRapida';

/** Catálogos auxiliares de las listas, incluidos inactivos para resolver identidades históricas. */
export type CatalogosOperaciones = Awaited<ReturnType<typeof cargarDatosIngreso>>;

/** Carga nombres e iconos para las listas sin acceder a la historia financiera. */
export function useCatalogosOperaciones() {
  const [catalogos, establecerCatalogos] = useState<CatalogosOperaciones>({ actividades: [], categorias: [], medios: [], billeteras: [] });
  const [error, establecerError] = useState('');
  /** Descarta respuestas tras abandonar la pantalla y hace visibles los fallos auxiliares. */
  function cargar() {
    let vigente = true;
    /** Publica las etiquetas recibidas para búsquedas y presentación histórica. */
    function recibir(datos: CatalogosOperaciones) { if (vigente) establecerCatalogos(datos); }
    /** Advierte que faltan etiquetas sin inventar datos ni impedir consultar operaciones. */
    function fallar() { if (vigente) establecerError('No se pudieron cargar los catálogos; algunas etiquetas históricas no están disponibles.'); }
    void cargarDatosIngreso().then(recibir, fallar);
    /** Evita actualizar una pantalla desmontada. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, []);
  return { catalogos, error };
}
