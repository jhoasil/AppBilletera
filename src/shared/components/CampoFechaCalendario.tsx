import { useId, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CalendarToday from '@mui/icons-material/CalendarToday';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { fechaActual } from '../dates/fechaActual';

const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'] as const;
const semana = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'] as const;

/** Conserva el contrato ISO de los campos existentes y el carácter opcional de cada fecha. */
interface PropiedadesCampoFecha {
  etiqueta: string;
  valor: string;
  alCambiar: (valor: string) => void;
  tipo: 'date' | 'month';
  obligatorio: boolean;
  etiquetaExterior: boolean;
}

/** Construye una fecha de calendario para calcular celdas sin conversiones de zona horaria. */
function fechaCalendario(anio: number, mes: number, dia: number): Date {
  const fecha = new Date(0);
  fecha.setUTCFullYear(anio, mes, dia);
  return fecha;
}

/** Selecciona días o meses con controles del theme y entrega fechas ISO sin alterar el día elegido. */
export function CampoFechaCalendario({ etiqueta, valor, alCambiar, tipo, obligatorio, etiquetaExterior }: PropiedadesCampoFecha) {
  const identificador = useId();
  const hoy = fechaActual();
  const [abierto, establecerAbierto] = useState(false);
  const [anio, establecerAnio] = useState(Number(hoy.slice(0, 4)));
  const [mes, establecerMes] = useState(Number(hoy.slice(5, 7)) - 1);
  const [textoAnio, establecerTextoAnio] = useState(hoy.slice(0, 4));
  const anioValido = /^\d{1,4}$/.test(textoAnio) && Number(textoAnio) >= 1 && Number(textoAnio) <= 9999;
  const periodo = `${String(anio).padStart(4, '0')}-${String(mes + 1).padStart(2, '0')}`;
  const primerDia = (fechaCalendario(anio, mes, 1).getUTCDay() + 6) % 7;
  const dias = fechaCalendario(anio, mes + 1, 0).getUTCDate();
  const filas = Math.ceil((primerDia + dias) / 7);
  const texto = valor ? tipo === 'month' ? `${meses[Number(valor.slice(5, 7)) - 1] ?? ''} de ${valor.slice(0, 4)}` : `${valor.slice(8, 10)}/${valor.slice(5, 7)}/${valor.slice(0, 4)}` : '';

  /** Abre el calendario en la fecha existente o en hoy sin cambiar el valor del formulario. */
  function abrir(evento: { currentTarget: HTMLElement }) {
    if (evento.currentTarget.closest('fieldset:disabled')) return;
    const referencia = /^\d{4}-\d{2}/.test(valor) ? valor : hoy;
    const nuevoAnio = Number(referencia.slice(0, 4));
    establecerAnio(nuevoAnio); establecerTextoAnio(String(nuevoAnio)); establecerMes(Number(referencia.slice(5, 7)) - 1); establecerAbierto(true);
  }
  /** Cierra el diálogo conservando la fecha original cuando no se eligió una nueva. */
  function cancelar() { establecerAbierto(false); }
  /** Permite abrir con teclado sin enviar accidentalmente el formulario. */
  function abrirConTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Enter' || evento.key === ' ') { evento.preventDefault(); abrir(evento); }
  }
  /** Confirma una elección ISO y devuelve el foco al campo mediante el diálogo de Material UI. */
  function confirmar(fecha: string) { alCambiar(fecha); establecerAbierto(false); }
  /** Selecciona el día o mes actual según el tipo del campo. */
  function elegirHoy() { confirmar(tipo === 'month' ? hoy.slice(0, 7) : hoy); }
  /** Limpia exclusivamente fechas opcionales por decisión explícita del usuario. */
  function borrar() { if (!obligatorio) confirmar(''); }
  /** Desplaza el calendario un mes o año dentro del rango de fechas ISO de cuatro dígitos. */
  function desplazar(delta: number) {
    const siguiente = fechaCalendario(anio + (tipo === 'month' ? delta : 0), mes + (tipo === 'date' ? delta : 0), 1);
    const nuevoAnio = siguiente.getUTCFullYear();
    if (nuevoAnio < 1 || nuevoAnio > 9999) return;
    establecerAnio(nuevoAnio); establecerTextoAnio(String(nuevoAnio)); establecerMes(siguiente.getUTCMonth());
  }
  /** Navega al período anterior sin modificar la fecha seleccionada. */
  function anterior() { desplazar(-1); }
  /** Navega al período siguiente sin modificar la fecha seleccionada. */
  function siguiente() { desplazar(1); }
  /** Permite escribir el año para llegar rápidamente a fechas alejadas. */
  function cambiarAnio(evento: ChangeEvent<HTMLInputElement>) {
    const texto = evento.target.value; establecerTextoAnio(texto);
    if (/^\d{1,4}$/.test(texto) && Number(texto) >= 1 && Number(texto) <= 9999) establecerAnio(Number(texto));
  }
  /** Cambia el mes visible desde un catálogo español, sin confirmar todavía el día. */
  function cambiarMes(evento: ChangeEvent<HTMLInputElement>) { establecerMes(Number(evento.target.value)); }
  /** Presenta opciones de navegación mensual con nombres en español. */
  function opcionMes(nombre: string, indice: number) { return <MenuItem key={nombre} value={indice}>{nombre}</MenuItem>; }
  /** Presenta encabezados de semana sin confundirlos con botones de fechas. */
  function diaSemana(nombre: string, indice: number) { return <Typography key={indice} variant="caption" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>{nombre}</Typography>; }
  /** Crea una celda accesible; cada elección confirma solamente el día mostrado. */
  function celda(_valor: unknown, indice: number) {
    const dia = indice - primerDia + 1;
    if (dia < 1 || dia > dias) return <Box key={indice} aria-hidden="true" />;
    const fecha = `${periodo}-${String(dia).padStart(2, '0')}`;
    /** Confirma la fecha exacta de esta celda sin pasar por un instante local. */
    function elegir() { confirmar(fecha); }
    return <Button key={indice} onClick={elegir} disabled={!anioValido} aria-label={`${dia} de ${meses[mes]} de ${anio}`} aria-pressed={valor === fecha} variant={valor === fecha ? 'contained' : hoy === fecha ? 'outlined' : 'text'} sx={{ minWidth: 0, minHeight: 40, p: 0, borderRadius: '50%' }}>{dia}</Button>;
  }
  /** Presenta un mes como elección final cuando el campo representa un período mensual. */
  function celdaMes(nombre: string, indice: number) {
    const fecha = `${String(anio).padStart(4, '0')}-${String(indice + 1).padStart(2, '0')}`;
    /** Confirma el período mensual sin añadir un día inexistente al contrato. */
    function elegir() { confirmar(fecha); }
    return <Button key={nombre} onClick={elegir} disabled={!anioValido} aria-label={`${nombre} de ${anio}`} aria-pressed={valor === fecha} variant={valor === fecha ? 'contained' : hoy.slice(0, 7) === fecha ? 'outlined' : 'text'} sx={{ minWidth: 0, minHeight: 44 }}>{nombre.slice(0, 3)}</Button>;
  }
  return <Box sx={{ minWidth: 0 }}>
    {etiquetaExterior && <Typography component="label" htmlFor={identificador} sx={{ display: 'block', mb: 1 }}>{etiqueta}</Typography>}
    <TextField id={identificador} fullWidth label={etiquetaExterior ? undefined : etiqueta} value={texto} required={obligatorio} onClick={abrir} onKeyDown={abrirConTeclado} placeholder={tipo === 'month' ? 'Seleccionar mes' : 'dd/mm/aaaa'}
      slotProps={{ inputLabel: { shrink: true }, htmlInput: { 'aria-haspopup': 'dialog', 'aria-expanded': abierto }, input: { readOnly: true, endAdornment: <InputAdornment position="end"><IconButton aria-label={`Abrir calendario: ${etiqueta}`} onClick={abrir} edge="end"><CalendarToday sx={{ fontSize: 20 }} /></IconButton></InputAdornment> } }} />
    <Dialog open={abierto} onClose={cancelar} fullWidth maxWidth="xs" aria-labelledby={`${identificador}-titulo`}>
      <DialogTitle id={`${identificador}-titulo`}>{tipo === 'month' ? 'Seleccionar mes' : 'Seleccionar fecha'} · {etiqueta}</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 2, pt: 1 }}>
          <IconButton aria-label={tipo === 'month' ? 'Año anterior' : 'Mes anterior'} onClick={anterior} disabled={!anioValido || (anio === 1 && (tipo === 'month' || mes === 0))}><ChevronLeft /></IconButton>
          {tipo === 'date' && <TextField select label="Mes" value={mes} onChange={cambiarMes} size="small" sx={{ flex: 1, minWidth: 0 }}>{meses.map(opcionMes)}</TextField>}
          {tipo === 'month' && <TextField label="Año" value={textoAnio} onChange={cambiarAnio} size="small" type="number" error={!anioValido} fullWidth slotProps={{ htmlInput: { min: 1, max: 9999, inputMode: 'numeric' } }} />}
          <IconButton aria-label={tipo === 'month' ? 'Año siguiente' : 'Mes siguiente'} onClick={siguiente} disabled={!anioValido || (anio === 9999 && (tipo === 'month' || mes === 11))}><ChevronRight /></IconButton>
        </Stack>
        {tipo === 'date' && <TextField label="Año" value={textoAnio} onChange={cambiarAnio} size="small" type="number" error={!anioValido} fullWidth sx={{ mb: 1 }} slotProps={{ htmlInput: { min: 1, max: 9999, inputMode: 'numeric' } }} />}
        {!anioValido && <Typography variant="caption" color="error">Ingresá un año entre 1 y 9999.</Typography>}
        <Box role="group" aria-label={tipo === 'month' ? `Meses de ${anio}` : `${meses[mes]} de ${anio}`} sx={{ display: 'grid', gridTemplateColumns: `repeat(${tipo === 'month' ? 3 : 7}, minmax(0, 1fr))`, gap: 0.5 }}>
          {tipo === 'month' ? meses.map(celdaMes) : <>{semana.map(diaSemana)}{Array.from({ length: filas * 7 }, celda)}</>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap' }}>{!obligatorio && <Button onClick={borrar}>Borrar</Button>}<Button onClick={elegirHoy}>{tipo === 'month' ? 'Este mes' : 'Hoy'}</Button><Button onClick={cancelar}>Cancelar</Button></DialogActions>
    </Dialog>
  </Box>;
}
