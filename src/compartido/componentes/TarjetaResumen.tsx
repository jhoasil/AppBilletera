import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** Contenido previamente preparado de un resumen, sin cálculo ni formateo financiero. */
interface PropiedadesTarjetaResumen {
  titulo: string;
  valor: string;
  detalle?: string;
  icono?: ReactNode;
  tono?: 'neutro' | 'positivo' | 'negativo' | 'destacado';
}

const coloresTono = {
  neutro: 'text.primary', positivo: 'success.main', negativo: 'error.main', destacado: 'primary.main',
};

/** Destaca un valor ya formateado usando los colores semánticos del tema. */
export function TarjetaResumen({ titulo, valor, detalle, icono, tono = 'neutro' }: PropiedadesTarjetaResumen) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {icono && <Box aria-hidden="true" sx={{ display: 'flex', color: coloresTono[tono] }}>{icono}</Box>}
            <Typography variant="subtitle2" color="text.secondary">{titulo}</Typography>
          </Stack>
          <Typography variant="h2" component="p" sx={{ color: coloresTono[tono], overflowWrap: 'anywhere' }}>{valor}</Typography>
          {detalle && <Typography variant="body2" color="text.secondary">{detalle}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}
