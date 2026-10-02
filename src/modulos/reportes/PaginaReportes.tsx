import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** Presenta la página provisional de Reportes para habilitar su navegación. */
export function PaginaReportes() {
  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h2">Reportes</Typography>
      <Typography color="text.secondary">Los resúmenes financieros y de rentabilidad se incorporarán en próximas tareas.</Typography>
    </Stack>
  );
}
