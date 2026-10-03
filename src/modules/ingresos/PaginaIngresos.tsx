import { useEffect, useState } from 'react';
import { listarCatalogo } from '../../app/data/datosCargaRapida';
import { servicioActividades } from '../../app/data/serviciosCatalogos';
import type { Actividad } from '../../core/entities/Actividad';
import type { Ingreso } from '../../core/entities/Ingreso';
import { FormularioIngreso } from './FormularioIngreso';
import { servicioIngresos } from '../../app/data/servicioIngresos';
import { PantallaOperaciones } from '../../shared/components/PantallaOperaciones';
import type { CargaIngreso } from '../../core/services/CargaIngreso';

/** Conecta el formulario de ingreso con las acciones del ABM compartido. */
function formulario(inicial: CargaIngreso | undefined, guardar: (carga: CargaIngreso) => Promise<void>, completar: () => void) {
  return <FormularioIngreso {...(inicial ? { inicial } : {})} alGuardar={guardar} alCompletar={completar} />;
}

/** Presenta ingresos paginados y permite consultar, crear, editar e invalidar sus efectos financieros. */
export function PaginaIngresos() {
  const [actividades, establecerActividades] = useState<readonly Actividad[]>([]);
  /** Recupera etiquetas de catálogo sin consultar la historia financiera. */
  function cargar() { let vigente = true;
    /** Publica el catálogo si la pantalla continúa visible. */
    function recibir(datos: readonly Actividad[]) { if (vigente) establecerActividades(datos); }
    /** Conserva una etiqueta alternativa cuando falla la lectura auxiliar. */
    function fallar() {}
    void listarCatalogo(servicioActividades).then(recibir, fallar);
    /** Descarta respuestas tras abandonar la pantalla. */
    function cancelar() { vigente = false; } return cancelar;
  }
  useEffect(cargar, []);
  /** Muestra la actividad histórica sin depender de que actualmente esté activa. */
  function detalle(ingreso: Ingreso) { return actividades.find(/** Localiza la identidad histórica para obtener su nombre. */ function identificar(actividad) { return actividad.id === ingreso.actividadId; })?.nombre ?? 'Actividad histórica'; }
  return <PantallaOperaciones tono="ingreso" detalle={detalle} titulo="Ingresos" singular="ingreso" servicio={servicioIngresos} formulario={formulario} />;
}
