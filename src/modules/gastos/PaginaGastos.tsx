import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { listarCatalogo } from '../../app/data/datosCargaRapida';
import { servicioActividades, servicioCategorias } from '../../app/data/serviciosCatalogos';
import type { Actividad } from '../../core/entities/Actividad';
import type { CategoriaGasto } from '../../core/entities/CategoriaGasto';
import type { Gasto } from '../../core/entities/Gasto';
import { FormularioGasto } from './FormularioGasto';
import { servicioGastos } from '../../app/data/servicioGastos';
import { PantallaOperaciones } from '../../shared/components/PantallaOperaciones';
import type { CargaGasto } from '../../core/services/CargaGasto';

/** Conecta el formulario de gasto con las acciones del ABM compartido. */
function formulario(inicial: CargaGasto | undefined, guardar: (carga: CargaGasto) => Promise<void>, completar: () => void) {
  return <FormularioGasto {...(inicial ? { inicial } : {})} alGuardar={guardar} alCompletar={completar} />;
}

/** Presenta gastos paginados y permite consultar, crear, editar e invalidar sus efectos financieros. */
export function PaginaGastos() {
  const [catalogos, establecerCatalogos] = useState<{ actividades: readonly Actividad[]; categorias: readonly CategoriaGasto[] }>({ actividades: [], categorias: [] });
  /** Consulta etiquetas actuales que conservan referencias históricas, sin leer movimientos. */
  function cargar() { let vigente = true;
    /** Publica ambos catálogos únicamente mientras la pantalla esté montada. */
    function recibir([actividades, categorias]: [readonly Actividad[], readonly CategoriaGasto[]]) { if (vigente) establecerCatalogos({ actividades, categorias }); }
    /** Permite mantener etiquetas alternativas ante un fallo auxiliar. */
    function fallar() {}
    void Promise.all([listarCatalogo(servicioActividades), listarCatalogo(servicioCategorias)]).then(recibir, fallar);
    /** Descarta respuestas que lleguen tras cambiar de pantalla. */
    function cancelar() { vigente = false; } return cancelar;
  }
  useEffect(cargar, []);
  /** Expone categoría y actividad por sus identidades históricas, incluida la ausencia de actividad. */
  function detalle(gasto: Gasto) {
    const categoria = catalogos.categorias.find(/** Busca la categoría que clasifica este gasto. */ function identificar(registro) { return registro.id === gasto.categoriaId; });
    const actividad = catalogos.actividades.find(/** Resuelve la asociación opcional de la operación. */ function identificar(registro) { return registro.id === gasto.actividadId; });
    return <>{categoria?.nombre ?? 'Categoría histórica'}<Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>{gasto.actividadId ? actividad?.nombre ?? 'Actividad histórica' : 'Sin actividad asociada'}</Typography></>;
  }
  return <PantallaOperaciones tono="gasto" detalle={detalle} titulo="Gastos" singular="gasto" servicio={servicioGastos} formulario={formulario} />;
}
