import Stack from '@mui/material/Stack';
import { CabeceraPagina } from '../../compartido/componentes/CabeceraPagina';
import { EstadoVacio } from '../../compartido/componentes/EstadoVacio';

/** Presenta Gastos con los componentes comunes hasta incorporar su funcionalidad. */
export function PaginaGastos() {
  return (
    <Stack spacing={3}>
      <CabeceraPagina titulo="Gastos" />
      <EstadoVacio titulo="Sección en preparación" descripcion="La carga y consulta de gastos se incorporará en próximas tareas." />
    </Stack>
  );
}
