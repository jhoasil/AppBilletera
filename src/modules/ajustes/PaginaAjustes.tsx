import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Palette from '@mui/icons-material/Palette';
import WorkOutline from '@mui/icons-material/WorkOutlineOutlined';
import Category from '@mui/icons-material/Category';
import Payments from '@mui/icons-material/Payments';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Backup from '@mui/icons-material/Backup';
import Info from '@mui/icons-material/Info';
import { useState } from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { SelectorModoTema } from '../../app/theme/SelectorModoTema';
import { CabeceraPagina } from '../../shared/components/CabeceraPagina';
import { RespaldoDatos } from './RespaldoDatos';
import { CatalogoMediosPago } from './catalogos/CatalogoMediosPago';
import { CatalogoCategoriasGasto } from './catalogos/CatalogoCategoriasGasto';
import { CatalogoActividades } from './catalogos/CatalogoActividades';
import { CatalogoBilleteras } from './catalogos/CatalogoBilleteras';
import { InformacionAplicacion } from './InformacionAplicacion';

const secciones = [
  { id: 'apariencia', titulo: 'Apariencia', grupo: 'Configuración', descripcion: 'Tema del dispositivo, claro u oscuro', icono: Palette },
  { id: 'actividades', titulo: 'Actividades', grupo: 'Catálogos', descripcion: 'Trabajos y fuentes de ingreso', icono: WorkOutline },
  { id: 'categorias', titulo: 'Categorías de gastos', grupo: 'Catálogos', descripcion: 'Clasificación de tus gastos', icono: Category },
  { id: 'medios', titulo: 'Medios de pago', grupo: 'Catálogos', descripcion: 'Formas de pago y preferencias de carga', icono: Payments },
  { id: 'billeteras', titulo: 'Billeteras', grupo: 'Catálogos', descripcion: 'Configuración de ubicaciones del dinero', icono: AccountBalanceWallet },
  { id: 'datos', titulo: 'Respaldo', grupo: 'Datos', descripcion: 'Exportar e importar tus datos', icono: Backup },
  { id: 'informacion', titulo: 'Información de la aplicación', grupo: 'Información', descripcion: 'Versión y plataformas compatibles', icono: Info },
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
    const Icono = destino.icono;
    return <ListItemButton key={destino.id} onClick={abrir} sx={{ minHeight: 72, px: 2 }}><ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}><Icono /></ListItemIcon><ListItemText primary={destino.titulo} secondary={destino.descripcion} /><ChevronRight aria-hidden="true" sx={{ color: 'text.secondary' }} /></ListItemButton>;
  }
  /** Encuentra el título de la sección elegida. */
  function buscarSeccion(destino: (typeof secciones)[number]) { return destino.id === seccion; }
  if (!seccion) return <Stack spacing={3}>
    <CabeceraPagina titulo="Ajustes" descripcion="Administrá tus catálogos, apariencia y datos." />
    {(['Configuración', 'Catálogos', 'Datos', 'Información'] as const).map(/** Separa accesos por finalidad sin introducir configuraciones que todavía no existen. */ function mostrarGrupo(grupo) { return <Stack key={grupo} spacing={1}><Typography variant="h6">{grupo}</Typography><Paper variant="outlined"><List aria-label={grupo}>{secciones.filter(/** Elige destinos del grupo actual. */ function pertenece(destino) { return destino.grupo === grupo; }).map(mostrarAcceso)}</List></Paper></Stack>; })}
  </Stack>;
  return <Stack spacing={3}>
    <CabeceraPagina titulo={secciones.find(buscarSeccion)?.titulo ?? 'Ajustes'} acciones={<Button onClick={volver}>Volver a Ajustes</Button>} />
    {seccion === 'actividades' ? <CatalogoActividades /> : seccion === 'categorias' ? <CatalogoCategoriasGasto /> : seccion === 'medios' ? <CatalogoMediosPago /> : seccion === 'billeteras' ? <CatalogoBilleteras /> : seccion === 'apariencia' ? <SelectorModoTema /> : seccion === 'informacion' ? <InformacionAplicacion /> : <RespaldoDatos />}
  </Stack>;
}
