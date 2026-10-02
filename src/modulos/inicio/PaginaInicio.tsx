import Stack from '@mui/material/Stack';
import { CabeceraPagina } from '../../compartido/componentes/CabeceraPagina';
import { EstadoVacio } from '../../compartido/componentes/EstadoVacio';

/** Presenta Inicio con los componentes comunes hasta incorporar su funcionalidad. */
export function PaginaInicio() {
  return (
    <Stack spacing={3}>
      <CabeceraPagina titulo="Inicio" />
      <EstadoVacio titulo="Sección en preparación" descripcion="El resumen de ingresos, gastos y billeteras se incorporará en próximas tareas." />
    </Stack>
  );
}
