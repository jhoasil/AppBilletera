import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { CampoTextoCatalogo } from './CampoTextoCatalogo';

/** Colores de catálogo almacenados como metadatos, sin alterar la paleta global. */
const opcionesColor = [
  { nombre: 'Azul', valor: '#005bea' }, { nombre: 'Verde', valor: '#00843d' },
  { nombre: 'Rojo', valor: '#d92332' }, { nombre: 'Violeta', valor: '#7352c7' },
  { nombre: 'Naranja', valor: '#a85b00' }, { nombre: 'Gris', valor: '#475569' },
];

/** Ofrece colores sugeridos y un valor personalizado, con selección visible en ambos temas. */
export function SelectorColor({ valor, alCambiar, compacto = false }: { compacto?: boolean; valor: string | null; alCambiar: (valor: string) => void }) {
  /** Presenta una opción textual cuyo estado no depende exclusivamente del color. */
  function mostrar(opcion: (typeof opcionesColor)[number]) {
    /** Actualiza el metadato de color del borrador. */
    function seleccionar() { alCambiar(opcion.valor); }
    return <Button key={opcion.valor} variant={valor?.toLowerCase() === opcion.valor ? 'outlined' : 'text'} aria-pressed={valor?.toLowerCase() === opcion.valor} onClick={seleccionar} aria-label={opcion.nombre} title={opcion.nombre} sx={compacto ? { minWidth: 44, width: 44, height: 44, borderRadius: '50%', p: 0.5 } : undefined}>{compacto ? <Box sx={{ width: 32, height: 32, bgcolor: opcion.valor, borderRadius: '50%' }} /> : opcion.nombre}</Button>;
  }
  const campo = <CampoTextoCatalogo etiqueta="Color hexadecimal (opcional)" valor={valor ?? ''} alCambiar={alCambiar} />;
  return <Stack spacing={1}>{compacto && <Typography>Color</Typography>}<Stack direction="row" sx={{ flexWrap: 'wrap' }}>{opcionesColor.map(mostrar)}</Stack>
    {compacto ? <details><summary>Color personalizado</summary>{campo}</details> : campo}</Stack>;
}
