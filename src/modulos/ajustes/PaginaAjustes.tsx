import { useState } from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { SelectorModoTema } from '../../app/tema/SelectorModoTema';
import { CabeceraPagina } from '../../compartido/componentes/CabeceraPagina';
import { EstadoVacio } from '../../compartido/componentes/EstadoVacio';
import { CatalogoMediosPago } from './catalogos/CatalogoMediosPago';
import { CatalogoCategoriasGasto } from './catalogos/CatalogoCategoriasGasto';
import { CatalogoActividades } from './catalogos/CatalogoActividades';

const secciones = [
  { id: 'actividades', titulo: 'Actividades' },
  { id: 'categorias', titulo: 'Categorías de gastos' },
  { id: 'medios', titulo: 'Medios de pago' },
  { id: 'billeteras', titulo: 'Billeteras' },
  { id: 'apariencia', titulo: 'Apariencia' },
  { id: 'datos', titulo: 'Datos' },
  { id: 'informacion', titulo: 'Información' },
] as const;
/** Destinos de configuración habilitados desde Ajustes. */
type SeccionAjustes = (typeof secciones)[number]['id'];

/** Presenta los accesos de configuración, con una sola sección abierta y retorno al menú. */
export function PaginaAjustes() {
  const [seccion, establecerSeccion] = useState<SeccionAjustes | null>(null);
  /** Devuelve a la lista de accesos de Ajustes. */
  function volver() { establecerSeccion(null); }
  /** Crea un acceso táctil a una sección de configuración. */
  function mostrarAcceso(destino: (typeof secciones)[number]) {
    /** Abre la sección elegida sin crear ni editar catálogos desde otros módulos. */
    function abrir() { establecerSeccion(destino.id); }
    return <ListItemButton key={destino.id} onClick={abrir} sx={{ minHeight: 56 }}><ListItemText primary={destino.titulo} /></ListItemButton>;
  }
  /** Encuentra el título de la sección elegida. */
  function buscarSeccion(destino: (typeof secciones)[number]) { return destino.id === seccion; }
  if (!seccion) return <Stack spacing={3}>
    <CabeceraPagina titulo="Ajustes" descripcion="Administrá tus catálogos, apariencia y datos." />
    <Paper variant="outlined"><List aria-label="Secciones de Ajustes">{secciones.map(mostrarAcceso)}</List></Paper>
  </Stack>;
  return <Stack spacing={3}>
    <CabeceraPagina titulo={secciones.find(buscarSeccion)?.titulo ?? 'Ajustes'} acciones={<Button onClick={volver}>Volver a Ajustes</Button>} />
    {seccion === 'actividades' ? <CatalogoActividades /> : seccion === 'categorias' ? <CatalogoCategoriasGasto /> : seccion === 'medios' ? <CatalogoMediosPago /> : seccion === 'apariencia' ? <SelectorModoTema /> : <EstadoVacio titulo="Sección en preparación" descripcion="Esta configuración se incorporará en su tarea correspondiente." />}
  </Stack>;
}
