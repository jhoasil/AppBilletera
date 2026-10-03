import { useContext, useEffect, useRef, type ReactNode } from 'react';
import { IconoCatalogo } from './IconoCatalogo';
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { ContextoCabecera } from '../../app/navigation/ContextoCabecera';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** Título, descripción y acciones opcionales de una página. */
interface PropiedadesCabeceraPagina {
  titulo: string;
  icono?: string | null;
  color?: string | null;
  descripcion?: string;
  acciones?: ReactNode;
  regreso?: { href?: string; alPulsar?: () => void; deshabilitado?: boolean; etiqueta: string };
}

/** Unifica la jerarquía del título y adapta las acciones a móvil y escritorio. */
export function CabeceraPagina({ titulo, descripcion, acciones, regreso, icono = null, color = null }: PropiedadesCabeceraPagina) {
  const publicar = useContext(ContextoCabecera);
  const retorno = useRef(regreso);
  retorno.current = regreso;
  const contextual = Boolean(regreso); const href = regreso?.href; const etiqueta = regreso?.etiqueta ?? 'Volver'; const deshabilitado = regreso?.deshabilitado ?? false;
  /** Publica solo metadatos estables; la referencia del callback evita ciclos al renderizar la página. */
  function sincronizar() {
    if (!publicar) return;
    if (contextual) publicar({ titulo, icono, color, ...(href ? { href } : {}), etiqueta, deshabilitado, alVolver: regresar });
    else publicar(null);
    /** Invoca el retorno vigente sin asumir que la ruta anterior del navegador es el destino correcto. */
    function regresar() { retorno.current?.alPulsar?.(); }
    /** Retira la cabecera al abandonar la pantalla para que no permanezca un título anterior. */
    function limpiar() { publicar?.(null); }
    return limpiar;
  }
  useEffect(sincronizar, [publicar, contextual, titulo, icono, color, href, etiqueta, deshabilitado]);
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, display: contextual ? { xs: 'none', md: 'flex' } : 'flex' }}>
      <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>{icono && <IconoCatalogo identificador={icono} color={color} contenedor />}<Typography component="h1" variant="h2">{titulo}</Typography></Stack>
        {descripcion && <Typography color="text.secondary" sx={{ mt: 1 }}>{descripcion}</Typography>}
      </Box>
      {regreso && <Button {...(regreso.href ? { component: 'a', href: regreso.href } : { onClick: regreso.alPulsar })} disabled={deshabilitado} startIcon={<ArrowBack />}>{etiqueta}</Button>}
      {acciones && <Box>{acciones}</Box>}
    </Stack>
  );
}
