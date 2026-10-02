import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { TarjetaResumen } from '../../shared/components/TarjetaResumen';
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
    <Stack spacing={2} sx={{ maxWidth: 640 }}>
    <Typography color="text.secondary">La elección se aplica a toda la aplicación y se recuerda en este dispositivo. Sistema sigue los cambios de apariencia del dispositivo.</Typography>
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
    <TarjetaResumen titulo="Vista previa" valor="AppBilletera" tono="destacado" detalle="Los fondos, formularios y colores financieros siguen el tema seleccionado." />
    <Alert severity="success">Ingreso registrado</Alert>
    <Alert severity="error">Revisá el importe antes de guardar</Alert>
    </Stack>
  );
}
