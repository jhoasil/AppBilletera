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
import Close from '@mui/icons-material/Close';
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
  const [seleccion, establecerSeleccion] = useState('');
  const anios = Array.from({ length: Math.min(9999, anio + 100) - Math.max(1, anio - 100) + 1 }, /** Ofrece años cercanos sin crear miles de controles a la vez. */ function opcion(_valor, indice) { return Math.max(1, anio - 100) + indice; });
  const subtitulo = seleccion ? tipo === 'month' ? `${meses[Number(seleccion.slice(5, 7)) - 1]} de ${seleccion.slice(0, 4)}` : new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(fechaCalendario(Number(seleccion.slice(0, 4)), Number(seleccion.slice(5, 7)) - 1, Number(seleccion.slice(8, 10)))) : 'Sin fecha seleccionada';
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
    establecerAnio(nuevoAnio); establecerMes(Number(referencia.slice(5, 7)) - 1); establecerSeleccion(valor || (tipo === 'month' ? hoy.slice(0, 7) : hoy)); establecerAbierto(true);
  }
  /** Descarta el borrador al cerrar y conserva siempre la fecha original del formulario. */
  function cancelar() { establecerAbierto(false); }
  /** Permite abrir con teclado sin enviar accidentalmente el formulario. */
  function abrirConTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Enter' || evento.key === ' ') { evento.preventDefault(); abrir(evento); }
  }
  /** Confirma una elección ISO y devuelve el foco al campo mediante el diálogo de Material UI. */
  function confirmar() { alCambiar(seleccion); establecerAbierto(false); }
  /** Preselecciona hoy y lo muestra sin modificar el formulario hasta aceptar. */
  function elegirHoy() { establecerSeleccion(tipo === 'month' ? hoy.slice(0, 7) : hoy); establecerAnio(Number(hoy.slice(0, 4))); establecerMes(Number(hoy.slice(5, 7)) - 1); }
  /** Prepara el borrado de fechas opcionales; cancelar también descarta esta acción. */
  function borrar() { if (!obligatorio) establecerSeleccion(''); }
  /** Desplaza el calendario un mes o año dentro del rango de fechas ISO de cuatro dígitos. */
  function desplazar(delta: number) {
    const siguiente = fechaCalendario(anio + (tipo === 'month' ? delta : 0), mes + (tipo === 'date' ? delta : 0), 1);
    const nuevoAnio = siguiente.getUTCFullYear();
    if (nuevoAnio < 1 || nuevoAnio > 9999) return;
    establecerAnio(nuevoAnio); establecerMes(siguiente.getUTCMonth());
  }
  /** Navega al período anterior sin modificar la fecha seleccionada. */
  function anterior() { desplazar(-1); }
  /** Navega al período siguiente sin modificar la fecha seleccionada. */
  function siguiente() { desplazar(1); }
  /** Navega al año elegido sin alterar la fecha pendiente de confirmación. */
  function cambiarAnio(evento: ChangeEvent<HTMLInputElement>) {
    establecerAnio(Number(evento.target.value));
  }
  /** Presenta años válidos en el desplegable de navegación. */
  function opcionAnio(valor: number) { return <MenuItem key={valor} value={valor}>{valor}</MenuItem>; }
  /** Cambia el mes visible desde un catálogo español, sin confirmar todavía el día. */
  function cambiarMes(evento: ChangeEvent<HTMLInputElement>) { establecerMes(Number(evento.target.value)); }
  /** Presenta opciones de navegación mensual con nombres en español. */
  function opcionMes(nombre: string, indice: number) { return <MenuItem key={nombre} value={indice}>{nombre}</MenuItem>; }
  /** Presenta encabezados de semana sin confundirlos con botones de fechas. */
  function diaSemana(nombre: string, indice: number) { return <Typography key={indice} variant="caption" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>{nombre}</Typography>; }
  /** Crea una celda accesible que preselecciona el día sin cambiar el formulario. */
  function celda(_valor: unknown, indice: number) {
    const dia = indice - primerDia + 1;
    if (dia < 1 || dia > dias) return <Box key={indice} aria-hidden="true" />;
    const fecha = `${periodo}-${String(dia).padStart(2, '0')}`;
    /** Preselecciona la fecha exacta de esta celda sin pasar por un instante local. */
    function elegir() { establecerSeleccion(fecha); }
    return <Button key={indice} onClick={elegir} aria-label={`${dia} de ${meses[mes]} de ${anio}`} aria-pressed={seleccion === fecha} variant={seleccion === fecha ? 'contained' : hoy === fecha ? 'outlined' : 'text'} sx={{ minWidth: 0, minHeight: 0, width: '100%', maxWidth: 44, aspectRatio: '1', justifySelf: 'center', p: 0, borderRadius: '50%', color: seleccion === fecha ? 'primary.contrastText' : 'text.primary' }}>{dia}</Button>;
  }
  /** Presenta un mes como elección pendiente cuando el campo representa un período mensual. */
  function celdaMes(nombre: string, indice: number) {
    const fecha = `${String(anio).padStart(4, '0')}-${String(indice + 1).padStart(2, '0')}`;
    /** Preselecciona el período mensual sin añadir un día inexistente al contrato. */
    function elegir() { establecerSeleccion(fecha); }
    return <Button key={nombre} onClick={elegir} aria-label={`${nombre} de ${anio}`} aria-pressed={seleccion === fecha} variant={seleccion === fecha ? 'contained' : hoy.slice(0, 7) === fecha ? 'outlined' : 'text'} sx={{ minWidth: 0, minHeight: 44 }}>{nombre.slice(0, 3)}</Button>;
  }
  return <Box sx={{ minWidth: 0 }}>
    {etiquetaExterior && <Typography component="label" htmlFor={identificador} sx={{ display: 'block', mb: 1 }}>{etiqueta}</Typography>}
    <TextField id={identificador} fullWidth label={etiquetaExterior ? undefined : etiqueta} value={texto} required={obligatorio} onClick={abrir} onKeyDown={abrirConTeclado} placeholder={tipo === 'month' ? 'Seleccionar mes' : 'dd/mm/aaaa'}
      slotProps={{ inputLabel: { shrink: true }, htmlInput: { 'aria-haspopup': 'dialog', 'aria-expanded': abierto }, input: { readOnly: true, endAdornment: <InputAdornment position="end"><IconButton aria-label={`Abrir calendario: ${etiqueta}`} onClick={abrir} edge="end"><CalendarToday sx={{ fontSize: 20 }} /></IconButton></InputAdornment> } }} />
    <Dialog open={abierto} onClose={cancelar} fullWidth maxWidth="xs" aria-labelledby={`${identificador}-titulo`} sx={{ '& .MuiDialog-paper': { m: 1, width: 'calc(100% - 16px)' } }}>
      <DialogTitle id={`${identificador}-cabecera`} sx={{ p: 2 }}><Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}><Typography component="span" variant="h6" id={`${identificador}-titulo`}>{tipo === 'month' ? 'Seleccionar mes' : 'Seleccionar fecha'}</Typography><IconButton aria-label="Cerrar calendario" onClick={cancelar} sx={{ bgcolor: 'action.hover' }}><Close /></IconButton></Stack><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} aria-live="polite">{subtitulo.charAt(0).toUpperCase() + subtitulo.slice(1)}</Typography></DialogTitle>
      <DialogContent sx={{ px: 2, pb: 3 }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 2, pt: 1 }}>
          <IconButton aria-label={tipo === 'month' ? 'Año anterior' : 'Mes anterior'} onClick={anterior} disabled={anio === 1 && (tipo === 'month' || mes === 0)} sx={{ bgcolor: 'action.hover', p: 0, width: 32, height: 32, minWidth: 32, minHeight: 32 }}><ChevronLeft /></IconButton>
          {tipo === 'date' && <TextField select label="Mes" value={mes} onChange={cambiarMes} size="small" sx={{ flex: 1, minWidth: 0, '& .MuiSelect-select': { pl: 1, pr: '24px !important' }, '& .MuiSelect-icon': { right: 4 } }} slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ display: 'none', '@media (min-width:390px)': { display: 'flex' } }}><CalendarToday sx={{ fontSize: 18 }} /></InputAdornment> } }}>{meses.map(opcionMes)}</TextField>}
          <TextField select label="Año" value={anio} onChange={cambiarAnio} size="small" sx={{ width: tipo === 'month' ? '100%' : 84, flexShrink: tipo === 'month' ? 1 : 0 }} slotProps={{ select: { MenuProps: { slotProps: { paper: { sx: { maxHeight: 280 } } } } } }}>{anios.map(opcionAnio)}</TextField>
          <IconButton aria-label={tipo === 'month' ? 'Año siguiente' : 'Mes siguiente'} onClick={siguiente} disabled={anio === 9999 && (tipo === 'month' || mes === 11)} sx={{ bgcolor: 'action.hover', p: 0, width: 32, height: 32, minWidth: 32, minHeight: 32 }}><ChevronRight /></IconButton>
        </Stack>
        <Box role="group" aria-label={tipo === 'month' ? `Meses de ${anio}` : `${meses[mes]} de ${anio}`} sx={{ display: 'grid', gridTemplateColumns: `repeat(${tipo === 'month' ? 3 : 7}, minmax(0, 1fr))`, gap: 0.5 }}>
          {tipo === 'month' ? meses.map(celdaMes) : <>{semana.map(diaSemana)}{Array.from({ length: filas * 7 }, celda)}</>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', borderTop: 1, borderColor: 'divider', p: 2, gap: 0.5 }}><Button onClick={elegirHoy} sx={{ mr: 'auto', minWidth: 0 }}>{tipo === 'month' ? 'Este mes' : 'Hoy'}</Button>{!obligatorio && <Button onClick={borrar} sx={{ minWidth: 0 }}>Borrar</Button>}<Button onClick={cancelar} sx={{ minWidth: 0 }}>Cancelar</Button><Button onClick={confirmar} variant="contained" disabled={obligatorio && !seleccion} sx={{ borderRadius: 6 }}>Aceptar</Button></DialogActions>
    </Dialog>
  </Box>;
}
