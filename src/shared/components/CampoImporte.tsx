import { useId, type ChangeEvent } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

/** Valor textual controlado por el formulario; su conversión monetaria pertenece al dominio. */
interface PropiedadesCampoImporte {
  etiqueta: string;
  valor: string;
  alCambiar: (valor: string) => void;
  simbolo?: string;
  ayuda?: string;
  compacto?: boolean;
  error?: string;
  deshabilitado?: boolean;
  obligatorio?: boolean;
  alineadoDerecha?: boolean;
  etiquetaOculta?: boolean;
}

/** Facilita la escritura de un importe con teclado decimal sin convertir ni calcular dinero. */
export function CampoImporte({
  etiqueta, valor, alCambiar, simbolo = '$', ayuda, error,
  deshabilitado = false, obligatorio = false, compacto = false, alineadoDerecha = false, etiquetaOculta = false,
}: PropiedadesCampoImporte) {
  const identificador = useId();

  /** Entrega el texto sin transformaciones para que el formulario conserve la edición del usuario. */
  function cambiarTexto(evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    alCambiar(evento.target.value);
  }

  return (
    <TextField id={identificador} label={etiquetaOculta ? undefined : etiqueta} value={valor} onChange={cambiarTexto}
      placeholder={alineadoDerecha ? '0' : undefined}
      sx={{ '& input': { fontSize: 18, fontWeight: 600, fontVariantNumeric: 'tabular-nums', ...(alineadoDerecha && { textAlign: 'right' }) } }} type="text" disabled={deshabilitado} required={obligatorio}
      error={Boolean(error)} helperText={error || ayuda || (compacto ? undefined : ' ')}
      slotProps={{
        htmlInput: { inputMode: 'decimal', ...(etiquetaOculta && { 'aria-label': etiqueta }) },
        input: { startAdornment: <InputAdornment position="start">{simbolo}</InputAdornment> },
      }} />
  );
}
