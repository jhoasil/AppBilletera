import { useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Add from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CabeceraPagina } from './CabeceraPagina';
import { CampoTextoCatalogo } from './CampoTextoCatalogo';
import { EstadoVacio } from './EstadoVacio';
import { formatearImporte } from '../money/formatearImporte';
import { crearImporte } from '../../core/money/Importe';
import type { ConsultaOperaciones, PaginaResultado } from '../../core/repositories/ConsultasRepositorio';
import { useParametroRuta } from '../../app/navigation/useParametroRuta';

/** Campos mínimos para presentar una operación con auditoría y total monetario. */
export interface RegistroOperacion { id: string; fecha: string; descripcion: string | null; importeCentavos: number; moneda: string; actualizadoEn: string }
/** Acciones de aplicación consumidas por el ABM sin conocer sus repositorios físicos. */
export interface ServicioABM<Entidad extends RegistroOperacion, Carga> {
  /** Consulta una página de operaciones mediante el servicio, sin cargar toda la historia. */ listar(consulta: ConsultaOperaciones): Promise<PaginaResultado<Entidad>>;
  /** Recupera una operación y su carga editable para preservar referencias históricas. */ obtener(id: string): Promise<{ entidad: Entidad; carga: Carga }>;
  /** Confirma una operación nueva mediante la transacción del servicio. */ crear(carga: Carga): Promise<void>;
  /** Guarda cambios solo si la revisión esperada continúa vigente. */ editar(id: string, carga: Carga, actualizadoEnEsperado: string): Promise<void>;
  /** Solicita el borrado lógico con control de revisión, conservando trazabilidad. */ eliminar(id: string, actualizadoEnEsperado: string): Promise<void>;
}
/** Configuración del listado reutilizable con formulario específico de cada operación. */
interface PropiedadesPantallaOperaciones<Entidad extends RegistroOperacion, Carga> {
  titulo: string; singular: string; detalle?: (entidad: Entidad) => ReactNode; tono?: 'ingreso' | 'gasto'; servicio: ServicioABM<Entidad, Carga>;
  formulario: (inicial: Carga | undefined, guardar: (carga: Carga) => Promise<void>, completar: () => void) => ReactNode;
}

/** Presenta listado paginado, detalle editable y confirmación de borrado lógico con filtros de período. */
export function PantallaOperaciones<Entidad extends RegistroOperacion, Carga>({ titulo, singular, servicio, formulario, detalle, tono }: PropiedadesPantallaOperaciones<Entidad, Carga>) {
  const [menu, establecerMenu] = useState<{ ancla: HTMLElement; entidad: Entidad } | null>(null);
  const cargaDirecta = useParametroRuta('nuevo');
  const [pagina, establecerPagina] = useState(0);
  const [revision, establecerRevision] = useState(0);
  const [desde, establecerDesde] = useState(''); const [hasta, establecerHasta] = useState('');
  const [filtros, establecerFiltros] = useState({ desde: '', hasta: '' });
  const [resultado, establecerResultado] = useState<PaginaResultado<Entidad>>({ elementos: [], total: 0 });
  const [cargando, establecerCargando] = useState(true);
  const [pendiente, establecerPendiente] = useState(false);
  const [error, establecerError] = useState('');
  const [confirmacion, establecerConfirmacion] = useState('');
  const [nuevo, establecerNuevo] = useState(false);
  const [seleccion, establecerSeleccion] = useState<{ entidad: Entidad; carga: Carga } | null>(null);
  const [aEliminar, establecerAEliminar] = useState<Entidad | null>(null);
  /** Abre una carga directa desde Inicio o desde una conciliación sin un menú intermedio. */
  function abrirCargaDirecta() { if (cargaDirecta === '1') { establecerNuevo(true); establecerSeleccion(null); } }
  useEffect(abrirCargaDirecta, [cargaDirecta]);
  /** Consulta una página acotada, descartando respuestas de filtros o páginas anteriores. */
  function cargar() {
    let vigente = true; establecerCargando(true); establecerError('');
    /** Presenta únicamente una respuesta todavía vigente. */
    function completar(datos: PaginaResultado<Entidad>) { if (vigente) { establecerResultado(datos); establecerCargando(false); } }
    /** Conserva el error de lectura para permitir reintentar. */
    function fallar(causa: unknown) { if (vigente) { establecerError(mensaje(causa)); establecerCargando(false); } }
    void servicio.listar({ limite: 20, desplazamiento: pagina * 20, ...(filtros.desde ? { desde: filtros.desde } : {}), ...(filtros.hasta ? { hasta: filtros.hasta } : {}) }).then(completar, fallar);
    /** Cancela la actualización visual al cambiar de contexto. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, [servicio, pagina, revision, filtros]);
  /** Extrae un error legible sin ocultar fallos de integridad o concurrencia. */
  function mensaje(causa: unknown) { return causa instanceof Error ? causa.message : 'No se pudo completar la operación.'; }
  /** Abre una carga nueva independiente de la selección anterior. */
  function crear() { establecerNuevo(true); establecerSeleccion(null); establecerConfirmacion(''); }
  /** Regresa al listado sin escribir cambios del formulario. */
  function volver() { establecerNuevo(false); establecerSeleccion(null); }
  /** Actualiza el listado tras una operación confirmada. */
  function completado() { volver(); establecerConfirmacion('Operación guardada.'); establecerRevision(revision + 1); }
  /** Guarda mediante creación o edición controlada por su versión persistida. */
  function guardar(carga: Carga) { return seleccion ? servicio.editar(seleccion.entidad.id, carga, seleccion.entidad.actualizadoEn) : servicio.crear(carga); }
  /** Aplica un período válido desde la primera página. */
  function filtrar() {
    if (desde && hasta && desde > hasta) { establecerError('El inicio del período no puede superar su fin.'); return; }
    establecerPagina(0); establecerFiltros({ desde, hasta });
  }
  /** Reintenta la página vigente después de un fallo. */
  function reintentar() { establecerRevision(revision + 1); }
  /** Retrocede dentro del listado. */
  function anterior() { establecerPagina(Math.max(0, pagina - 1)); }
  /** Avanza dentro del listado. */
  function siguiente() { establecerPagina(pagina + 1); }
  /** Cierra el diálogo de borrado cuando no hay una escritura pendiente. */
  function cancelarEliminacion() { if (!pendiente) establecerAEliminar(null); }
  /** Invalida la operación y sus efectos solo después de la confirmación del usuario en la pantalla. */
  async function eliminar() {
    if (!aEliminar || pendiente) return; establecerPendiente(true); establecerError('');
    try { await servicio.eliminar(aEliminar.id, aEliminar.actualizadoEn); establecerAEliminar(null); establecerPagina(0); establecerRevision(revision + 1); establecerConfirmacion('Operación eliminada; su historial se conserva.'); }
    catch (causa) { establecerError(mensaje(causa)); establecerAEliminar(null); }
    finally { establecerPendiente(false); }
  }
  /** Presenta fecha, total y accesos al detalle y al borrado lógico. */
  function mostrar(entidad: Entidad) {
    /** Recupera detalles vigentes antes de abrir su consulta y edición. */
    async function abrir() {
      establecerPendiente(true); establecerError('');
      try { establecerSeleccion(await servicio.obtener(entidad.id)); establecerNuevo(false); }
      catch (causa) { establecerError(mensaje(causa)); }
      finally { establecerPendiente(false); }
    }
    // Una sola fila reserva el menú para acciones; eliminar siempre requiere confirmación.
    return <Card key={entidad.id}><CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{ color: tono === 'ingreso' ? 'success.main' : 'error.main', bgcolor: 'action.hover', borderRadius: '50%', p: 1, display: 'flex' }}>{tono === 'ingreso' ? <ArrowDownward /> : <ArrowUpward />}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}><Button onClick={abrir} disabled={pendiente} sx={{ p: 0, minWidth: 0, justifyContent: 'flex-start', textAlign: 'left', color: 'text.primary', overflowWrap: 'anywhere' }}>{detalle ? detalle(entidad) : entidad.descripcion || singular}</Button>{detalle && entidad.descripcion && <Typography variant="body2">{entidad.descripcion}</Typography>}<Typography variant="caption" color="text.secondary">{new Date(`${entidad.fecha}T12:00:00`).toLocaleDateString('es-AR')}</Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere', color: tono === 'ingreso' ? 'success.main' : tono === 'gasto' ? 'error.main' : 'text.primary' }}>{tono === 'ingreso' ? '+' : tono === 'gasto' ? '-' : ''}{formatearImporte(crearImporte(entidad.importeCentavos, entidad.moneda))}</Typography></Box>
        <IconButton aria-label={`Acciones de ${singular} del ${entidad.fecha}`} disabled={pendiente} onClick={function abrirMenu(evento) { establecerMenu({ ancla: evento.currentTarget, entidad }); }}><MoreVert /></IconButton>
      </Stack>
    </CardContent></Card>;
  }
  if (nuevo || seleccion) return <Stack spacing={2}><CabeceraPagina titulo={`${seleccion ? 'Detalle de' : 'Nuevo'} ${singular}`} regreso={{ alPulsar: volver, etiqueta: "Volver al listado", deshabilitado: pendiente }} />{formulario(seleccion?.carga, guardar, completado)}</Stack>;
  return <Stack spacing={2}>
    <CabeceraPagina titulo={titulo} acciones={<Button startIcon={<Add />} variant="contained" onClick={crear} disabled={pendiente}>Agregar {singular}</Button>} />
    {confirmacion && <Alert severity="success">{confirmacion}</Alert>}{error && <Alert severity="error" action={<Button onClick={reintentar}>Reintentar</Button>}>{error}</Alert>}
    <details><summary>Período: {filtros.desde || 'inicio'} — {filtros.hasta || 'hoy y futuros'}</summary><Stack sx={{ pt: 2 }} direction={{ xs: 'column', sm: 'row' }} spacing={1}><CampoTextoCatalogo etiqueta="Desde" valor={desde} alCambiar={establecerDesde} tipo="date" /><CampoTextoCatalogo etiqueta="Hasta" valor={hasta} alCambiar={establecerHasta} tipo="date" /><Button onClick={filtrar} disabled={pendiente}>Aplicar período</Button></Stack></details>
    {cargando ? <CircularProgress aria-label="Cargando operaciones" /> : resultado.elementos.length ? resultado.elementos.map(mostrar) : !error && <EstadoVacio titulo="Sin operaciones" descripcion="Agregá una operación o cambiá el período." />}
    <Stack direction="row" useFlexGap spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}><Button disabled={cargando || pendiente || pagina === 0} onClick={anterior}>Anterior</Button><Typography>Página {pagina + 1} · {resultado.total}</Typography><Button disabled={cargando || pendiente || (pagina + 1) * 20 >= resultado.total} onClick={siguiente}>Siguiente</Button></Stack>
    <Menu anchorEl={menu?.ancla ?? null} open={Boolean(menu)} onClose={function cerrarMenu() { establecerMenu(null); }}><MenuItem onClick={function solicitarBorrado() { establecerAEliminar(menu?.entidad ?? null); establecerMenu(null); }}>Eliminar {singular}</MenuItem></Menu>
    <Dialog open={Boolean(aEliminar)} onClose={cancelarEliminacion} aria-labelledby="confirmar-borrado-operacion"><DialogTitle id="confirmar-borrado-operacion">Eliminar {singular}</DialogTitle><DialogContent>Se invalidarán la operación, sus detalles y sus movimientos de billetera. El historial se conservará.</DialogContent><DialogActions><Button onClick={cancelarEliminacion} disabled={pendiente}>Cancelar</Button><Button color="error" onClick={eliminar} loading={pendiente}>Eliminar</Button></DialogActions></Dialog>
  </Stack>;
}
