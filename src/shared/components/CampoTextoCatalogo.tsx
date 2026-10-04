import { useId, type ChangeEvent, type ReactNode } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

/** Campo controlado para propiedades textuales de los formularios de catálogo. */
interface PropiedadesCampoTexto {
  etiqueta: string;
  multilinea?: boolean;
  valor: string;
  alCambiar: (valor: string) => void;
  tipo?: string;
  obligatorio?: boolean;
  etiquetaExterior?: boolean;
  icono?: ReactNode;
  ejemplo?: string | undefined;
}

/** Adapta el evento de Material UI a una propiedad textual del borrador. */
export function CampoTextoCatalogo({ etiqueta, valor, alCambiar, tipo = 'text', obligatorio = false, etiquetaExterior = false, icono, ejemplo, multilinea = false }: PropiedadesCampoTexto) {
  const identificador = useId();
  /** Entrega la edición sin persistir ni transformar el texto. */
  function cambiar(evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) { alCambiar(evento.target.value); }
  return <Box sx={{ minWidth: 0 }}>
    {etiquetaExterior && <Typography component="label" htmlFor={identificador} sx={{ display: 'block', mb: 1 }}>{etiqueta}</Typography>}
    <TextField multiline={multilinea} minRows={multilinea ? 3 : undefined} fullWidth id={identificador} label={etiquetaExterior ? undefined : etiqueta} value={valor} type={tipo} onChange={cambiar} required={obligatorio} placeholder={ejemplo}
      slotProps={{ inputLabel: { shrink: true }, input: { ...(icono && { startAdornment: <InputAdornment position="start">{icono}</InputAdornment> }) } }} />
  </Box>;
}
