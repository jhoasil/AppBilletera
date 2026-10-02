import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SelectorModoTema } from '../../app/tema/SelectorModoTema';

/** Presenta Ajustes y conserva el control de apariencia hasta incorporar los catálogos. */
export function PaginaAjustes() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 560 }}>
      <Typography component="h1" variant="h2">Ajustes</Typography>
      <Typography color="text.secondary">La configuración de catálogos y datos se incorporará en próximas tareas.</Typography>
      <SelectorModoTema />
    </Stack>
  );
}
