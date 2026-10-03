import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { estadosFinancieros } from '../../app/theme/tokens';

/** Contenido previamente preparado de un resumen, sin cálculo ni formateo financiero. */
interface PropiedadesTarjetaResumen {
  titulo: string;
  valor: string;
  detalle?: string;
  icono?: ReactNode;
  tono?: 'neutro' | 'positivo' | 'negativo' | 'destacado';
  principal?: boolean;
  alturaMinima?: number;
  pie?: ReactNode;
  accion?: ReactNode;
}

const coloresTono = {
  neutro: 'text.primary', positivo: 'success.main', negativo: 'error.main', destacado: 'primary.main',
};

/** Destaca un valor ya formateado usando los colores semánticos del tema. */
export function TarjetaResumen({ titulo, valor, detalle, icono, tono = 'neutro', principal = false, alturaMinima, pie, accion }: PropiedadesTarjetaResumen) {
  return (
    <Card sx={/** Aplica superficies semánticas y adapta la jerarquía del importe sin alterar sus datos. */ function apariencia(tema) {
      const estado = estadosFinancieros[tema.palette.mode === 'dark' ? 'oscuro' : 'claro'];
      const financiero = tono === 'positivo' ? estado.ingreso : tono === 'negativo' ? estado.gasto : null;
      return { height: '100%', minWidth: 0, flex: 1, minHeight: alturaMinima ?? (principal ? 152 : 112), bgcolor: principal ? 'primary.main' : financiero?.fondo ?? 'background.paper', color: principal ? 'primary.contrastText' : financiero?.texto ?? 'text.primary' };
    }}>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {icono && <Box aria-hidden="true" sx={{ display: 'flex', color: coloresTono[tono] }}>{icono}</Box>}
            <Typography variant="subtitle2" sx={{ color: 'inherit' }}>{titulo}</Typography>
          </Stack>
          <Typography variant="h2" component="p" sx={{ color: principal || tono === 'positivo' || tono === 'negativo' ? 'inherit' : coloresTono[tono], fontSize: principal ? 34 : 24, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>{valor}</Typography>
          {detalle && <Typography variant="body2" sx={{ color: principal ? 'inherit' : 'text.secondary' }}>{detalle}</Typography>}
          {pie}{accion}
        </Stack>
      </CardContent>
    </Card>
  );
}
