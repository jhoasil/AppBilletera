import { FormularioGasto } from './FormularioGasto';
import { servicioGastos } from '../../app/datos/servicioGastos';
import { PantallaOperaciones } from '../../shared/componentes/PantallaOperaciones';
import type { CargaGasto } from '../../core/servicios/CargaGasto';

/** Conecta el formulario de gasto con las acciones del ABM compartido. */
function formulario(inicial: CargaGasto | undefined, guardar: (carga: CargaGasto) => Promise<void>, completar: () => void) {
  return <FormularioGasto {...(inicial ? { inicial } : {})} alGuardar={guardar} alCompletar={completar} />;
}

/** Presenta gastos paginados y permite consultar, crear, editar e invalidar sus efectos financieros. */
export function PaginaGastos() {
  return <PantallaOperaciones titulo="Gastos" singular="gasto" servicio={servicioGastos} formulario={formulario} />;
}
