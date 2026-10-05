import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import List from '@mui/icons-material/List';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { IconoCatalogo } from './IconoCatalogo';
import type { MedioPago } from '../../core/entities/MedioPago';

/** Gestiona medios del borrador sin modificar el catálogo ni los datos persistidos. */
interface PropiedadesOpcionesMedios {
  tipo: 'ingreso' | 'gasto';
  medios: readonly MedioPago[];
  incluidos: readonly string[];
  manuales: readonly string[];
  pendiente: boolean;
  alAgregar: (id: string) => void;
  alQuitar: (id: string) => void;
}

/** Presenta las acciones avanzadas y un selector de medios reales sin duplicar distribuciones. */
export function OpcionesMediosOperacion({ tipo, medios, incluidos, manuales, pendiente, alAgregar, alQuitar }: PropiedadesOpcionesMedios) {
  const [selector, establecerSelector] = useState<'adicionales' | 'todos' | null>(null);
  /** Ofrece solamente activos fuera de la carga rápida que aún no están en el borrador. */
  function adicional(medio: MedioPago) { return medio.activo && !medio.mostrarEnCargaRapida && !incluidos.includes(medio.id); }
  /** Abre la selección de medios adicionales, sin crear filas hasta elegir uno. */
  function abrirAdicionales() { establecerSelector('adicionales'); }
  /** Permite gestionar también medios rápidos ya incluidos o retirados. */
  function abrirTodos() { establecerSelector('todos'); }
  /** Cierra el selector sin modificar el borrador. */
  function cerrar() { establecerSelector(null); }
  /** Presenta icono, nombre y acción; los importes permanecen en el bloque principal. */
  function mostrarMedio(medio: MedioPago, enSelector = false) {
    const incluido = incluidos.includes(medio.id);
    /** Agrega el medio una sola vez y cierra la selección rápida de adicionales. */
    function agregar() { alAgregar(medio.id); if (selector === 'adicionales') cerrar(); }
    /** Retira únicamente el medio elegido del borrador. */
    function quitar() { alQuitar(medio.id); }
    return <Box key={medio.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', p: 0.75, display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
      <IconoCatalogo identificador={medio.icono} color={medio.color} tamano={32} />
      <Box sx={{ minWidth: 0, flex: 1 }}><Typography sx={{ overflowWrap: 'anywhere' }}>{medio.nombre}</Typography>{enSelector && medio.mostrarEnCargaRapida && <Typography variant="caption" color="text.secondary">Carga rápida</Typography>}</Box>
      <Button size="small" disabled={pendiente} startIcon={incluido ? <Delete /> : <Add />} color={incluido ? 'error' : 'primary'} onClick={incluido ? quitar : agregar} aria-label={`${incluido ? 'Quitar' : 'Agregar'} ${medio.nombre}`} sx={{ flexShrink: 0, ...(incluido && { bgcolor: 'action.hover' }) }}>{incluido ? 'Quitar' : 'Agregar'}</Button>
    </Box>;
  }
  /** Incluye medios añadidos y los históricos fuera de carga rápida, incluso inactivos. */
  function manual(medio: MedioPago) { return incluidos.includes(medio.id) && (manuales.includes(medio.id) || !medio.mostrarEnCargaRapida); }
  /** Adapta la lista manual al renderizador común sin tratar el índice como una opción. */
  function mostrarManual(medio: MedioPago) { return mostrarMedio(medio); }
  /** Presenta cada opción activa con su disponibilidad actual en el borrador. */
  function mostrarOpcion(medio: MedioPago) { return mostrarMedio(medio, true); }
  /** Excluye inactivos del selector de altas sin ocultar los históricos ya presentes. */
  function disponible(medio: MedioPago) { return selector === 'todos' ? medio.activo : adicional(medio); }
  const agregados = medios.filter(manual);
  const opciones = medios.filter(disponible);
  return <>
    <Stack spacing={1.5} divider={<Divider />}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 1, alignItems: 'center', '@media (max-width:399px)': { gridTemplateColumns: 'minmax(0, 1fr)' } }}>
        <Box><Typography sx={{ fontWeight: 600 }}>Agregar otro medio de {tipo === 'ingreso' ? 'cobro' : 'pago'}</Typography><Typography variant="body2" color="text.secondary">Usá un medio activo que no esté en la carga rápida.</Typography></Box>
        <Button variant="outlined" startIcon={<Add />} onClick={abrirAdicionales} disabled={pendiente || !medios.some(adicional)} sx={{ flexShrink: 0 }}>Agregar medio</Button>
      </Box>
      <Stack spacing={0.75}><Typography sx={{ fontWeight: 600 }}>Medios agregados manualmente</Typography>{agregados.length ? agregados.map(mostrarManual) : <Typography variant="body2" color="text.secondary">Todavía no agregaste otros medios.</Typography>}</Stack>
      <Button fullWidth variant="outlined" startIcon={<List />} endIcon={<ChevronRight sx={{ ml: 'auto' }} />} onClick={abrirTodos} disabled={pendiente}>Mostrar todos los medios activos</Button>
    </Stack>
    <Dialog open={selector !== null} onClose={cerrar} fullWidth maxWidth="sm">
      <DialogTitle>{selector === 'todos' ? 'Todos los medios activos' : `Agregar medio de ${tipo === 'ingreso' ? 'cobro' : 'pago'}`}</DialogTitle>
      <DialogContent><Stack spacing={1}>{opciones.length ? opciones.map(mostrarOpcion) : <Typography>No hay otros medios activos disponibles.</Typography>}</Stack></DialogContent>
      <DialogActions><Button onClick={cerrar}>Cerrar</Button></DialogActions>
    </Dialog>
  </>;
}
