import Settings from '@mui/icons-material/Settings';
import Bolt from '@mui/icons-material/Bolt';
import Download from '@mui/icons-material/Download';
import Upload from '@mui/icons-material/Upload';
import { alpha } from '@mui/material/styles';
import { useTema } from '../../app/theme/useTema';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Palette from '@mui/icons-material/Palette';
import WorkOutline from '@mui/icons-material/WorkOutlineOutlined';
import Category from '@mui/icons-material/Category';
import Payments from '@mui/icons-material/Payments';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Info from '@mui/icons-material/Info';
import { useState } from 'react';
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
  { id: 'apariencia', titulo: 'Apariencia', grupo: 'Preferencias', descripcion: 'Tema del dispositivo, claro u oscuro', icono: Palette },
  { id: 'actividades', titulo: 'Actividades', grupo: 'Catálogos', descripcion: 'Trabajos y fuentes de ingreso', icono: WorkOutline },
  { id: 'categorias', titulo: 'Categorías de gastos', grupo: 'Catálogos', descripcion: 'Clasificación de tus gastos', icono: Category },
  { id: 'medios', titulo: 'Medios de pago', grupo: 'Catálogos', descripcion: 'Formas de pago y preferencias de carga', icono: Payments },
  { id: 'billeteras', titulo: 'Billeteras', grupo: 'Catálogos', descripcion: 'Configuración de ubicaciones del dinero', icono: AccountBalanceWallet },
  { id: 'carga', titulo: 'Carga rápida', grupo: 'Preferencias', descripcion: 'Medios de pago en formularios', icono: Bolt },
  { id: 'exportar', titulo: 'Exportar respaldo', grupo: 'Respaldo y datos', descripcion: 'Generar archivo de respaldo (JSON)', icono: Download },
  { id: 'importar', titulo: 'Importar respaldo', grupo: 'Respaldo y datos', descripcion: 'Incorporar desde un archivo (JSON)', icono: Upload },
  { id: 'informacion', titulo: 'Información de la aplicación', grupo: 'Información', descripcion: 'Versión y plataformas compatibles', icono: Info },
] as const;
/** Destinos de configuración habilitados desde Ajustes. */
type SeccionAjustes = (typeof secciones)[number]['id'];

/** Presenta los accesos de configuración, con una sola sección abierta y retorno al menú. */
export function PaginaAjustes() {
  const { modo } = useTema();
  const [seccion, establecerSeccion] = useState<SeccionAjustes | null>(null);
  /** Devuelve a la lista de accesos de Ajustes. */
  function volver() { establecerSeccion(null); }
  // Los grupos usan superficies del tema: conservan separación en oscuro sin fondos arbitrarios.
  /** Crea un acceso táctil a una sección de configuración. */
  function mostrarAcceso(destino: (typeof secciones)[number]) {
    /** Abre la sección elegida sin crear ni editar catálogos desde otros módulos. */
    function abrir() { establecerSeccion(destino.id); }
    const Icono = destino.icono;
    const color = destino.id === 'actividades' || destino.id === 'billeteras' || destino.id === 'carga' ? 'success' : destino.id === 'categorias' ? 'warning' : destino.id === 'medios' ? 'secondary' : 'primary';
    return <ListItemButton key={destino.id} onClick={abrir} sx={{ minHeight: 64, px: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}><ListItemIcon sx={{ minWidth: 48, color: `${color}.main` }}><Box sx={{ width: 44, height: 44, display: 'grid', placeItems: 'center', bgcolor: /** Deriva el fondo del icono según el tema activo. */ function fondo(tema) { return alpha(tema.palette[color].main, 0.12); }, borderRadius: '12px' }}><Icono /></Box></ListItemIcon><ListItemText primary={destino.titulo} secondary={destino.descripcion} slotProps={{ primary: { sx: { fontWeight: 600, fontSize: 14 } }, secondary: { sx: { fontSize: 12 } } }} />{destino.id === 'apariencia' && <Typography variant="caption" sx={{ mx: 1 }}>{modo === 'sistema' ? 'Sistema' : modo === 'claro' ? 'Claro' : 'Oscuro'}</Typography>}<ChevronRight aria-hidden="true" sx={{ color: 'text.secondary' }} /></ListItemButton>;
  }
  /** Encuentra el título de la sección elegida. */
  function buscarSeccion(destino: (typeof secciones)[number]) { return destino.id === seccion; }
  if (!seccion) return <Stack spacing={2}>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}><Typography component="h1" variant="h2">Ajustes</Typography><Settings color="action" /></Stack>
    {(['Catálogos', 'Preferencias', 'Respaldo y datos', 'Información'] as const).map(/** Separa accesos por finalidad sin introducir configuraciones que todavía no existen. */ function mostrarGrupo(grupo) { return <Stack key={grupo} spacing={1}><Box><Typography variant="h6">{grupo}</Typography><Typography variant="body2" color="text.secondary">{grupo === 'Catálogos' ? 'Administrá las opciones que usás en la app' : grupo === 'Preferencias' ? 'Configurá la app a tu gusto' : grupo === 'Respaldo y datos' ? 'Protegé tu información' : 'Acerca de la aplicación'}</Typography></Box><Paper variant="outlined"><List disablePadding aria-label={grupo}>{secciones.filter(/** Elige destinos del grupo actual. */ function pertenece(destino) { return destino.grupo === grupo; }).map(mostrarAcceso)}</List></Paper></Stack>; })}
  </Stack>;
  if (seccion === 'actividades') return <CatalogoActividades alVolver={volver} />;
  return <Stack spacing={2}>
    <CabeceraPagina titulo={secciones.find(buscarSeccion)?.titulo ?? 'Ajustes'} regreso={{ alPulsar: volver, etiqueta: "Volver a Ajustes" }} />
    {seccion === 'categorias' ? <CatalogoCategoriasGasto /> : (seccion === 'medios' || seccion === 'carga') ? <CatalogoMediosPago /> : seccion === 'billeteras' ? <CatalogoBilleteras /> : seccion === 'apariencia' ? <SelectorModoTema /> : seccion === 'informacion' ? <InformacionAplicacion /> : <RespaldoDatos />}
  </Stack>;
}
