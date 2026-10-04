import { useCatalogosOperaciones } from '../../app/data/useCatalogosOperaciones';
import Alert from '@mui/material/Alert';
import { FormularioIngreso } from './FormularioIngreso';
import { servicioIngresos } from '../../app/data/servicioIngresos';
import { PantallaOperaciones } from '../../shared/components/PantallaOperaciones';
import type { CargaIngreso } from '../../core/services/CargaIngreso';

/** Conecta el formulario con las escrituras transaccionales existentes. */
function formulario(inicial: CargaIngreso | undefined, guardar: (carga: CargaIngreso) => Promise<void>, completar: () => void) {
  return <FormularioIngreso {...(inicial ? { inicial } : {})} alGuardar={guardar} alCompletar={completar} />;
}

/** Presenta operaciones paginadas con nombres, iconos y distribuciones históricas. */
export function PaginaIngresos() {
  const { catalogos, error } = useCatalogosOperaciones();
  return <>{error && <Alert severity="warning">{error}</Alert>}<PantallaOperaciones catalogos={catalogos} tono="ingreso" titulo="Ingresos" singular="ingreso" servicio={servicioIngresos} formulario={formulario} /></>;
}
