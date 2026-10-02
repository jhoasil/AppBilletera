import Stack from '@mui/material/Stack';
import { CabeceraPagina } from '../../shared/componentes/CabeceraPagina';
import { EstadoVacio } from '../../shared/componentes/EstadoVacio';

/** Presenta Reportes con los componentes comunes hasta incorporar su funcionalidad. */
export function PaginaReportes() {
  return (
    <Stack spacing={3}>
      <CabeceraPagina titulo="Reportes" />
      <EstadoVacio titulo="Sección en preparación" descripcion="Los resúmenes financieros y de rentabilidad se incorporarán en próximas tareas." />
    </Stack>
  );
}
