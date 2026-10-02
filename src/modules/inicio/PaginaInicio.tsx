import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { CabeceraPagina } from '../../shared/componentes/CabeceraPagina';
import { EstadoVacio } from '../../shared/componentes/EstadoVacio';

/** Presenta Inicio con los componentes comunes hasta incorporar su funcionalidad. */
export function PaginaInicio() {
  return (
    <Stack spacing={3}>
      <CabeceraPagina titulo="Inicio" />
      <Button component="a" href="#/billeteras" variant="contained">Ver billeteras y saldos</Button>
      <EstadoVacio titulo="Sección en preparación" descripcion="El resumen de ingresos, gastos y billeteras se incorporará en próximas tareas." />
    </Stack>
  );
}
