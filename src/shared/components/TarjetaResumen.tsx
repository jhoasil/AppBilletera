import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { estadosFinancieros, tokensVisuales } from '../../app/theme/tokens';

const consultaAccesoCompacto = `@container (max-width: ${tokensVisuales.anchoTarjetaAccesoCompacta}px)`;

/** Contenido previamente preparado de un resumen, sin cálculo ni formateo financiero. */
interface PropiedadesTarjetaResumen {
  titulo: string;
  valor: string;
  detalle?: string;
  icono?: ReactNode;
  tono?: 'neutro' | 'positivo' | 'negativo' | 'destacado';
  principal?: boolean;
  suave?: boolean;
  disposicion?: 'vertical' | 'resumen' | 'acceso';
  alturaMinima?: number;
  pie?: ReactNode;
  accion?: ReactNode;
}

const coloresTono = {
  neutro: 'text.primary', positivo: 'success.main', negativo: 'error.main', destacado: 'primary.main',
};

/** Destaca un valor ya formateado usando los colores semánticos del tema. */
export function TarjetaResumen({ titulo, valor, detalle, icono, tono = 'neutro', principal = false, suave = false, disposicion = 'vertical', alturaMinima, pie, accion }: PropiedadesTarjetaResumen) {
  return (
    <Card sx={/** Aplica superficies semánticas y adapta la jerarquía del importe sin alterar sus datos. */ function apariencia(tema) {
      const estado = estadosFinancieros[tema.palette.mode === 'dark' ? 'oscuro' : 'claro'];
      const financiero = tono === 'positivo' ? estado.ingreso : tono === 'negativo' ? estado.gasto : null;
      return { '--color-importe': financiero?.texto ?? tema.palette.text.primary, containerType: disposicion === 'acceso' ? 'inline-size' : undefined, height: '100%', minWidth: 0, flex: 1, minHeight: alturaMinima ?? (disposicion === 'vertical' ? principal ? 152 : 112 : undefined), bgcolor: suave ? (tono === 'destacado' ? tema.palette.mode === 'dark' ? 'action.hover' : 'action.selected' : 'background.paper') : principal ? 'primary.main' : financiero?.fondo ?? 'background.paper', color: suave ? 'text.primary' : principal ? 'primary.contrastText' : financiero?.texto ?? 'text.primary' };
    }}>
      <CardContent sx={disposicion === 'acceso' ? { p: 1.5, '&:last-child': { pb: 1.5 } } : undefined}>
        <Stack spacing={1}>
          {/* Inicio agrupa etiqueta/cifra: la variante vertical conserva la composición de otras pantallas. */}
          {disposicion === 'vertical' ? <>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {icono && <Box aria-hidden="true" sx={{ display: 'flex', color: principal && !suave ? 'inherit' : coloresTono[tono] }}>{icono}</Box>}
            <Typography variant="subtitle2" sx={{ color: 'inherit' }}>{titulo}</Typography>
          </Stack>
          <Typography variant="h2" component="p" sx={{ color: principal || tono === 'positivo' || tono === 'negativo' ? 'inherit' : coloresTono[tono], fontSize: principal ? 34 : 24, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>{valor}</Typography>
          </> : <Box sx={{ display: disposicion === 'acceso' ? 'grid' : 'flex', gridTemplateColumns: '40px minmax(0, 1fr)', flexWrap: 'wrap', columnGap: 1, alignItems: 'center' }}>
            {disposicion === 'acceso' && icono && <Box aria-hidden="true" sx={/** Usa la superficie semántica solo en el círculo, conservando neutra la tarjeta. */ function circulo(tema) {
              const estados = estadosFinancieros[tema.palette.mode === 'dark' ? 'oscuro' : 'claro'];
              const estado = tono === 'positivo' ? estados.ingreso : estados.gasto;
              return { width: 40, height: 40, flexShrink: 0, gridRow: '1 / span 2', [consultaAccesoCompacto]: { gridRow: 1 }, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: estado.fondo, color: estado.texto };
            }}>{icono}</Box>}
            <Box sx={{ flex: 1, minWidth: 0, display: disposicion === 'acceso' ? 'contents' : 'block' }}>
              <Typography component="h2" variant="body1" sx={{ gridColumn: 2, mb: 0.5 }}>{titulo}</Typography>
              {/* En tarjetas estrechas, la cifra ocupa ambas columnas para conservar los centavos legibles. */}
              <Typography component="p" sx={{ gridColumn: 2, ...(disposicion === 'acceso' && { [consultaAccesoCompacto]: { gridColumn: '1 / -1', mt: 0.5 } }), fontSize: principal ? 34 : 20, fontWeight: 700, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere', color: 'var(--color-importe)' }}>{valor}</Typography>
            </Box>
            {disposicion === 'resumen' && icono && <Box aria-hidden="true" sx={{ display: 'flex', color: coloresTono[tono], '& svg': { fontSize: 32 } }}>{icono}</Box>}
          </Box>}
          {detalle && <Typography variant="body2" sx={{ color: principal ? 'inherit' : 'text.secondary' }}>{detalle}</Typography>}
          {pie}{accion}
        </Stack>
      </CardContent>
    </Card>
  );
}
