import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** Presenta la página provisional de Ingresos para habilitar su navegación. */
export function PaginaIngresos() {
  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h2">Ingresos</Typography>
      <Typography color="text.secondary">La carga y consulta de ingresos se incorporará en próximas tareas.</Typography>
    </Stack>
  );
}
