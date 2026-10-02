import { FormularioOperacionRapida } from '../../compartido/componentes/FormularioOperacionRapida';
import type { CargaIngreso } from '../../nucleo/servicios/CargaIngreso';

/** Conexión del ingreso a sus datos iniciales y operación de aplicación. */
export interface PropiedadesFormularioIngreso { alGuardar?: (carga: CargaIngreso) => Promise<void>; inicial?: CargaIngreso; alCompletar?: () => void }

/** Especializa el formulario compartido para exigir una actividad y representar cobros. */
export function FormularioIngreso(propiedades: PropiedadesFormularioIngreso) {
  return <FormularioOperacionRapida tipo="ingreso" {...propiedades} />;
}
