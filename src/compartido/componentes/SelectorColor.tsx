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
export function SelectorColor({ valor, alCambiar }: { valor: string | null; alCambiar: (valor: string) => void }) {
  /** Presenta una opción textual cuyo estado no depende exclusivamente del color. */
  function mostrar(opcion: (typeof opcionesColor)[number]) {
    /** Actualiza el metadato de color del borrador. */
    function seleccionar() { alCambiar(opcion.valor); }
    return <Button key={opcion.valor} variant={valor?.toLowerCase() === opcion.valor ? 'outlined' : 'text'} aria-pressed={valor?.toLowerCase() === opcion.valor} onClick={seleccionar}>{opcion.nombre}</Button>;
  }
  return <Stack spacing={1}><Stack direction="row" sx={{ flexWrap: 'wrap' }}>{opcionesColor.map(mostrar)}</Stack>
    <CampoTextoCatalogo etiqueta="Color hexadecimal (opcional)" valor={valor ?? ''} alCambiar={alCambiar} /></Stack>;
}
