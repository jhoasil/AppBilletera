import { FormularioIngreso } from './FormularioIngreso';
import { servicioIngresos } from '../../app/datos/servicioIngresos';
import { PantallaOperaciones } from '../../shared/componentes/PantallaOperaciones';
import type { CargaIngreso } from '../../core/services/CargaIngreso';

/** Conecta el formulario de ingreso con las acciones del ABM compartido. */
function formulario(inicial: CargaIngreso | undefined, guardar: (carga: CargaIngreso) => Promise<void>, completar: () => void) {
  return <FormularioIngreso {...(inicial ? { inicial } : {})} alGuardar={guardar} alCompletar={completar} />;
}

/** Presenta ingresos paginados y permite consultar, crear, editar e invalidar sus efectos financieros. */
export function PaginaIngresos() {
  return <PantallaOperaciones titulo="Ingresos" singular="ingreso" servicio={servicioIngresos} formulario={formulario} />;
}
