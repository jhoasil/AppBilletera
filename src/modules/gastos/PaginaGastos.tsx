import { useCatalogosOperaciones } from '../../app/data/useCatalogosOperaciones';
import Alert from '@mui/material/Alert';
import { FormularioGasto } from './FormularioGasto';
import { servicioGastos } from '../../app/data/servicioGastos';
import { PantallaOperaciones } from '../../shared/components/PantallaOperaciones';
import type { CargaGasto } from '../../core/services/CargaGasto';

/** Conecta el formulario con las escrituras transaccionales existentes. */
function formulario(inicial: CargaGasto | undefined, guardar: (carga: CargaGasto) => Promise<void>, completar: () => void) {
  return <FormularioGasto {...(inicial ? { inicial } : {})} alGuardar={guardar} alCompletar={completar} />;
}

/** Presenta operaciones paginadas con nombres, iconos y distribuciones históricas. */
export function PaginaGastos() {
  const { catalogos, error } = useCatalogosOperaciones();
  return <>{error && <Alert severity="warning">{error}</Alert>}<PantallaOperaciones catalogos={catalogos} tono="gasto" titulo="Gastos" singular="gasto" servicio={servicioGastos} formulario={formulario} /></>;
}
