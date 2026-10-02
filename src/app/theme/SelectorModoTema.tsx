import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { useTema } from './useTema';

/** Ofrece las tres preferencias de apariencia para elegir un tema o seguir al dispositivo. */
export function SelectorModoTema() {
  const { modo, cambiarModo } = useTema();

  /** Valida el valor del selector antes de actualizar la preferencia compartida. */
  function seleccionarModo(evento: SelectChangeEvent) {
    const nuevoModo = evento.target.value;
    if (nuevoModo === 'sistema' || nuevoModo === 'claro' || nuevoModo === 'oscuro') {
      cambiarModo(nuevoModo);
    }
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="etiqueta-modo-tema">Apariencia</InputLabel>
      <Select
        labelId="etiqueta-modo-tema"
        id="modo-tema"
        label="Apariencia"
        value={modo}
        onChange={seleccionarModo}
      >
        <MenuItem value="sistema">Sistema</MenuItem>
        <MenuItem value="claro">Claro</MenuItem>
        <MenuItem value="oscuro">Oscuro</MenuItem>
      </Select>
    </FormControl>
  );
}
