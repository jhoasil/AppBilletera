import Stack from '@mui/material/Stack';
import { CabeceraPagina } from '../../compartido/componentes/CabeceraPagina';
import { FormularioGasto } from './FormularioGasto';

/** Presenta Gastos con los componentes comunes hasta incorporar su funcionalidad. */
export function PaginaGastos() {
  return (
    <Stack spacing={3}>
      <CabeceraPagina titulo="Gastos" />
      <FormularioGasto />
    </Stack>
  );
}
