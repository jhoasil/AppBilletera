import Stack from '@mui/material/Stack';
import { CabeceraPagina } from '../../compartido/componentes/CabeceraPagina';
import { FormularioIngreso } from './FormularioIngreso';

/** Presenta Ingresos con los componentes comunes hasta incorporar su funcionalidad. */
export function PaginaIngresos() {
  return (
    <Stack spacing={3}>
      <CabeceraPagina titulo="Ingresos" />
      <FormularioIngreso />
    </Stack>
  );
}
