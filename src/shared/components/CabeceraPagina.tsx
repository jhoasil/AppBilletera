import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** Título, descripción y acciones opcionales de una página. */
interface PropiedadesCabeceraPagina {
  titulo: string;
  descripcion?: string;
  acciones?: ReactNode;
}

/** Unifica la jerarquía del título y adapta las acciones a móvil y escritorio. */
export function CabeceraPagina({ titulo, descripcion, acciones }: PropiedadesCabeceraPagina) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
      <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        <Typography component="h1" variant="h2">{titulo}</Typography>
        {descripcion && <Typography color="text.secondary" sx={{ mt: 1 }}>{descripcion}</Typography>}
      </Box>
      {acciones && <Box>{acciones}</Box>}
    </Stack>
  );
}
