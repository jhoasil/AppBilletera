import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** Mensaje y acción opcional para una sección que todavía no tiene contenido. */
interface PropiedadesEstadoVacio {
  titulo: string;
  descripcion: string;
  icono?: ReactNode;
  accion?: ReactNode;
}

/** Presenta un estado vacío legible sin inventar registros ni resultados financieros. */
export function EstadoVacio({ titulo, descripcion, icono, accion }: PropiedadesEstadoVacio) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        {icono && <Box aria-hidden="true" sx={{ display: 'flex', color: 'primary.main' }}>{icono}</Box>}
        <Typography component="h2" variant="h3">{titulo}</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 480 }}>{descripcion}</Typography>
        {accion}
      </Stack>
    </Paper>
  );
}
