import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** Presenta la página provisional de Inicio para habilitar su navegación. */
export function PaginaInicio() {
  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h2">Inicio</Typography>
      <Typography color="text.secondary">El resumen de ingresos, gastos y billeteras se incorporará en próximas tareas.</Typography>
    </Stack>
  );
}
