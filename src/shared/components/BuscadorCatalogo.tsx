import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/Search';
import type { ChangeEvent } from 'react';

/** Busca texto de catálogo con etiqueta accesible y lupa, sin consultar ni alterar entidades. */
export function BuscadorCatalogo({ etiqueta, valor, alCambiar }: { etiqueta: string; valor: string; alCambiar: (valor: string) => void }) {
  /** Conserva el texto del usuario para que el editor aplique su búsqueda existente. */
  function cambiar(evento: ChangeEvent<HTMLInputElement>) { alCambiar(evento.target.value); }
  return <TextField label={etiqueta} placeholder={etiqueta} value={valor} onChange={cambiar} type="search" slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }} />;
}
