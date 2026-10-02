import type { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';

/** Campo controlado para propiedades textuales de los formularios de catálogo. */
interface PropiedadesCampoTexto {
  etiqueta: string;
  valor: string;
  alCambiar: (valor: string) => void;
  tipo?: string;
  obligatorio?: boolean;
}

/** Adapta el evento de Material UI a una propiedad textual del borrador. */
export function CampoTextoCatalogo({ etiqueta, valor, alCambiar, tipo = 'text', obligatorio = false }: PropiedadesCampoTexto) {
  /** Entrega la edición sin persistir ni transformar el texto. */
  function cambiar(evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) { alCambiar(evento.target.value); }
  return <TextField label={etiqueta} value={valor} type={tipo} onChange={cambiar} required={obligatorio}
    slotProps={{ inputLabel: { shrink: true } }} />;
}
