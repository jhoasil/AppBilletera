import { useId } from 'react';
import Box from '@mui/material/Box';
import { IconoCatalogo } from './IconoCatalogo';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

/** Opción visual independiente de las entidades y de los repositorios de catálogos. */
export interface OpcionCatalogo {
  id: string;
  nombre: string;
  icono?: string | null;
  color?: string | null;
  deshabilitada?: boolean;
}

/** Selección controlada, opciones y mensajes proporcionados por el formulario. */
interface PropiedadesSelectorCatalogo {
  etiqueta: string;
  valor: string;
  opciones: readonly OpcionCatalogo[];
  alCambiar: (id: string) => void;
  ayuda?: string;
  error?: string;
  obligatorio?: boolean;
  deshabilitado?: boolean;
}

/** Muestra un catálogo recibido por propiedades sin cargar datos ni permitir editarlo. */
export function SelectorCatalogo({
  etiqueta, valor, opciones, alCambiar, ayuda, error,
  obligatorio = false, deshabilitado = false,
}: PropiedadesSelectorCatalogo) {
  const identificador = useId();

  /** Comunica al formulario la identidad elegida sin resolver reglas de negocio. */
  function cambiarSeleccion(evento: { target: { value: unknown } }) {
    if (typeof evento.target.value === 'string') alCambiar(evento.target.value);
  }

  /** Presenta cada opción respetando su disponibilidad para nuevas selecciones. */
  function mostrarOpcion(opcion: OpcionCatalogo) {
    return <MenuItem key={opcion.id} value={opcion.id} disabled={opcion.deshabilitada}><Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, maxWidth: '100%', overflowWrap: 'anywhere' }}>{opcion.icono && <IconoCatalogo identificador={opcion.icono} color={opcion.color ?? null} />}{opcion.nombre}</Box></MenuItem>;
  }

  return (
    <TextField select id={identificador} label={etiqueta} value={valor}
      onChange={cambiarSeleccion} required={obligatorio}
      disabled={deshabilitado || opciones.length === 0} error={Boolean(error)}
      helperText={error || ayuda || (opciones.length === 0 ? 'No hay opciones disponibles.' : undefined)}>
      <MenuItem value="">Sin seleccionar</MenuItem>
      {opciones.map(mostrarOpcion)}
    </TextField>
  );
}
