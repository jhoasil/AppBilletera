import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EstadoVacio } from './EstadoVacio';

/** Datos exclusivamente visuales de una fila, preparados por el módulo que la utiliza. */
export interface ElementoListaMovimiento {
  id: string;
  titulo: string;
  detalle: string;
  importe: string;
  icono?: ReactNode;
  tono: 'entrada' | 'salida' | 'interno' | 'ajuste';
}

/** Filas ya formateadas y etiqueta accesible de la lista. */
interface PropiedadesListaMovimiento {
  elementos: readonly ElementoListaMovimiento[];
  etiqueta?: string;
}

const coloresMovimiento = {
  entrada: 'success.main', salida: 'error.main', interno: 'info.main', ajuste: 'secondary.main',
};

/** Presenta movimientos recibidos sin consultarlos, calcularlos ni clasificarlos automáticamente. */
export function ListaMovimiento({ elementos, etiqueta = 'Movimientos' }: PropiedadesListaMovimiento) {
  /** Distribuye el texto y el importe de una fila sin ocultar su información en pantallas pequeñas. */
  function mostrarMovimiento(elemento: ElementoListaMovimiento) {
    return (
      <ListItem key={elemento.id} divider sx={{ minHeight: 72, py: 1.5, gap: 1.5, alignItems: 'flex-start' }}>
        {elemento.icono && <Box aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 40, height: 40, flexShrink: 0, borderRadius: 1.5, bgcolor: 'action.hover', color: coloresMovimiento[elemento.tono] }}>{elemento.icono}</Box>}
        <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ overflowWrap: 'anywhere' }}>{elemento.titulo}</Typography>
          <Typography variant="body2" color="text.secondary">{elemento.detalle}</Typography>
        </Stack>
        <Typography sx={{ color: coloresMovimiento[elemento.tono], fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', maxWidth: '40%', overflowWrap: 'anywhere' }}>{elemento.importe}</Typography>
      </ListItem>
    );
  }

  if (elementos.length === 0) {
    return <EstadoVacio titulo="Sin movimientos" descripcion="Todavía no hay movimientos para mostrar." />;
  }
  return <List aria-label={etiqueta} disablePadding>{elementos.map(mostrarMovimiento)}</List>;
}
