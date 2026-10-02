import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** Presenta la página provisional de Gastos para habilitar su navegación. */
export function PaginaGastos() {
  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h2">Gastos</Typography>
      <Typography color="text.secondary">La carga y consulta de gastos se incorporará en próximas tareas.</Typography>
    </Stack>
  );
}
