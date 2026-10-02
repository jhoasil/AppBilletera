import Stack from '@mui/material/Stack';
import { CabeceraPagina } from '../../compartido/componentes/CabeceraPagina';
import { EstadoVacio } from '../../compartido/componentes/EstadoVacio';

/** Presenta Ingresos con los componentes comunes hasta incorporar su funcionalidad. */
export function PaginaIngresos() {
  return (
    <Stack spacing={3}>
      <CabeceraPagina titulo="Ingresos" />
      <EstadoVacio titulo="Sección en preparación" descripcion="La carga y consulta de ingresos se incorporará en próximas tareas." />
    </Stack>
  );
}
