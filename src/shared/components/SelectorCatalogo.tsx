import { useId } from 'react';
import Box from '@mui/material/Box';
import { IconoCatalogo } from './IconoCatalogo';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ChevronRight from '@mui/icons-material/ChevronRight';

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
  etiquetaExterior?: boolean;
  compacto?: boolean;
  enLinea?: boolean;
}

/** Muestra un catálogo recibido por propiedades sin cargar datos ni permitir editarlo. */
export function SelectorCatalogo({
  etiqueta, valor, opciones, alCambiar, ayuda, error,
  obligatorio = false, deshabilitado = false, etiquetaExterior = false, compacto = false, enLinea = false,
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

  /** Mantiene la billetera visible como texto editable, con el mismo catálogo y menú accesible. */
  function mostrarSeleccion(id: unknown) {
    const opcion = opciones.find(/** Resuelve solamente el nombre del destino elegido. */ function identificar(opcion) { return opcion.id === id; });
    return opcion ? `Billetera: ${opcion.nombre}` : 'Seleccionar billetera';
  }

  return (
    <Box sx={{ minWidth: 0 }}>
    {etiquetaExterior && <Typography id={`${identificador}-etiqueta`} sx={{ mb: 1 }}>{etiqueta}</Typography>}
    <TextField fullWidth select id={identificador} variant={enLinea ? 'standard' : 'outlined'} label={etiquetaExterior || enLinea ? undefined : etiqueta} value={valor}
      sx={enLinea ? { '& .MuiInput-root': { minHeight: 44, fontSize: 13, color: 'text.secondary' }, '& .MuiSelect-select': { whiteSpace: 'normal', py: 1, pr: 3 } } : compacto ? { '& .MuiOutlinedInput-root': { minHeight: 48 }, '& .MuiSelect-select': { py: 1.5 } } : undefined}
      slotProps={{ input: { ...(enLinea && { disableUnderline: true }) }, select: { ...(etiquetaExterior && { labelId: `${identificador}-etiqueta` }), ...(enLinea && { displayEmpty: true, renderValue: mostrarSeleccion, IconComponent: ChevronRight, SelectDisplayProps: { 'aria-label': etiqueta } }) } }}
      onChange={cambiarSeleccion} required={obligatorio}
      disabled={deshabilitado || opciones.length === 0} error={Boolean(error)}
      helperText={error || ayuda || (opciones.length === 0 ? 'No hay opciones disponibles.' : undefined)}>
      <MenuItem value="">Sin seleccionar</MenuItem>
      {opciones.map(mostrarOpcion)}
    </TextField></Box>
  );
}
