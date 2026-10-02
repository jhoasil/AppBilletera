import Stack from '@mui/material/Stack';
import { CabeceraPagina } from '../../compartido/componentes/CabeceraPagina';
import { FormularioIngreso } from './FormularioIngreso';
import { servicioIngresos } from '../../app/datos/servicioIngresos';
import type { CargaIngreso } from '../../nucleo/servicios/CargaIngreso';

/** Presenta Ingresos con los componentes comunes hasta incorporar su funcionalidad. */
export function PaginaIngresos() {
  /** Conecta el formulario a la operación transaccional de la capa de aplicación. */
  function guardar(carga: CargaIngreso) { return servicioIngresos.crear(carga); }
  return (
    <Stack spacing={3}>
      <CabeceraPagina titulo="Ingresos" />
      <FormularioIngreso alGuardar={guardar} />
    </Stack>
  );
}
