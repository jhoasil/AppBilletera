import { useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import BarChart from '@mui/icons-material/BarChart';
import Chip from '@mui/material/Chip';
import CardActionArea from '@mui/material/CardActionArea';
import { alpha } from '@mui/material/styles';
import { IconoCatalogo } from './IconoCatalogo';
import { BuscadorCatalogo } from './BuscadorCatalogo';
import { SelectorCatalogo } from './SelectorCatalogo';
import { tokensVisuales } from '../../app/theme/tokens';
import { normalizarBusqueda } from '../../core/services/normalizarBusqueda';
import type { CatalogosOperaciones } from '../../app/data/useCatalogosOperaciones';
import type { LineaCobro } from '../../core/services/CargaIngreso';
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
import type { ConsultaOperaciones, PaginaResultado, ConsultaGastos } from '../../core/repositories/ConsultasRepositorio';
import { useParametroRuta } from '../../app/navigation/useParametroRuta';

/** Campos mínimos para presentar una operación con auditoría y total monetario. */
export interface RegistroOperacion { id: string; fecha: string; descripcion: string | null; importeCentavos: number; moneda: string; actualizadoEn: string; actividadId?: string | null; categoriaId?: string }
/** Acciones de aplicación consumidas por el ABM sin conocer sus repositorios físicos. */
export interface ServicioABM<Entidad extends RegistroOperacion, Carga> {
  /** Consulta una página de operaciones mediante el servicio, sin cargar toda la historia. */ listar(consulta: ConsultaOperaciones): Promise<PaginaResultado<Entidad>>;
  /** Recupera una operación y su carga editable para preservar referencias históricas. */ obtener(id: string): Promise<{ entidad: Entidad; carga: Carga }>;
  /** Confirma una operación nueva mediante la transacción del servicio. */ crear(carga: Carga): Promise<void>;
  /** Guarda cambios solo si la revisión esperada continúa vigente. */ editar(id: string, carga: Carga, actualizadoEnEsperado: string): Promise<void>;
  /** Solicita el borrado lógico con control de revisión, conservando trazabilidad. */ eliminar(id: string, actualizadoEnEsperado: string): Promise<void>;
}
/** Configuración del listado reutilizable con formulario específico de cada operación. */
interface PropiedadesPantallaOperaciones<Entidad extends RegistroOperacion, Carga extends { lineas: readonly LineaCobro[] }> {
  catalogos: CatalogosOperaciones;
  titulo: string; singular: string; tono?: 'ingreso' | 'gasto'; servicio: ServicioABM<Entidad, Carga>;
  formulario: (inicial: Carga | undefined, guardar: (carga: Carga) => Promise<void>, completar: () => void) => ReactNode;
}

/** Presenta listado paginado, detalle editable y confirmación de borrado lógico con filtros de período. */
export function PantallaOperaciones<Entidad extends RegistroOperacion, Carga extends { lineas: readonly LineaCobro[] }>({ titulo, singular, servicio, formulario, catalogos, tono }: PropiedadesPantallaOperaciones<Entidad, Carga>) {
  const [menu, establecerMenu] = useState<{ ancla: HTMLElement; entidad: Entidad } | null>(null);
  const cargaDirecta = useParametroRuta('nuevo');
  const [pagina, establecerPagina] = useState(0);
  const [revision, establecerRevision] = useState(0);
  const [desde, establecerDesde] = useState(''); const [hasta, establecerHasta] = useState('');
  const [filtros, establecerFiltros] = useState({ desde: '', hasta: '', actividadId: '', categoriaId: '' });
  const [actividadId, establecerActividadId] = useState(''); const [categoriaId, establecerCategoriaId] = useState('');
  const [periodo, establecerPeriodo] = useState('Todos'); const [opciones, establecerOpciones] = useState(false);
  const [busqueda, establecerBusqueda] = useState(''); const [textoConsulta, establecerTextoConsulta] = useState('');
  const [distribuciones, establecerDistribuciones] = useState<Record<string, readonly LineaCobro[]>>({});
  const [errorDetalles, establecerErrorDetalles] = useState('');
  const color = tono === 'ingreso' ? 'success' : 'error';
  /** Espera brevemente entre teclas para evitar recorrer la base por cada pulsación. */
  function buscar() {
    const espera = setTimeout(/** Aplica la búsqueda estable desde la primera página. */ function aplicarBusqueda() { establecerPagina(0); establecerTextoConsulta(busqueda); }, 200);
    /** Descarta una búsqueda sustituida por una pulsación posterior. */
    function cancelarBusqueda() { clearTimeout(espera); }
    return cancelarBusqueda;
  }
  useEffect(buscar, [busqueda]);
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
    async function completar(datos: PaginaResultado<Entidad>) {
      if (!vigente) return;
      establecerResultado(datos); establecerCargando(false); establecerDistribuciones({}); establecerErrorDetalles('');
      // Solo se recuperan distribuciones de la página; nunca se deduce la billetera desde preferencias.
      const detalles = await Promise.allSettled(datos.elementos.map(async /** Consulta las distribuciones vigentes de una operación visible. */ function recuperar(entidad) { const registro = await servicio.obtener(entidad.id); return [entidad.id, registro.carga.lineas] as const; }));
      if (!vigente) return;
      const lineas: Record<string, readonly LineaCobro[]> = {};
      for (const detalle of detalles) if (detalle.status === 'fulfilled') lineas[detalle.value[0]] = detalle.value[1];
      establecerDistribuciones(lineas);
      if (detalles.some(/** Detecta distribuciones que requieren reintento. */ function fallo(detalle) { return detalle.status === 'rejected'; })) establecerErrorDetalles('Algunas distribuciones no pudieron cargarse. Reintentá para consultar sus billeteras históricas.');
    }
    /** Conserva el error de lectura para permitir reintentar. */
    function fallar(causa: unknown) { if (vigente) { establecerError(mensaje(causa)); establecerCargando(false); } }
    const texto = normalizarBusqueda(textoConsulta);
    const consulta: ConsultaGastos = { limite: 20, desplazamiento: pagina * 20, resumir: true,
      ...(filtros.desde ? { desde: filtros.desde } : {}), ...(filtros.hasta ? { hasta: filtros.hasta } : {}),
      ...(filtros.actividadId ? { actividadId: filtros.actividadId } : {}), ...(filtros.categoriaId ? { categoriaId: filtros.categoriaId } : {}),
      busqueda: texto, actividadesCoincidentes: catalogos.actividades.filter(/** Selecciona coincidencias del filtro o grupo actual. */ function coincide(registro) { return normalizarBusqueda(registro.nombre).includes(texto); }).map(/** Extrae la identidad estable para filtrar antes de paginar. */ function identidad(registro) { return registro.id; }),
      categoriasCoincidentes: catalogos.categorias.filter(/** Selecciona coincidencias del filtro o grupo actual. */ function coincide(registro) { return normalizarBusqueda(registro.nombre).includes(texto); }).map(/** Extrae la identidad estable para filtrar antes de paginar. */ function identidad(registro) { return registro.id; }),
    };
    void servicio.listar(consulta).then(completar, fallar);
    /** Cancela la actualización visual al cambiar de contexto. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, [servicio, pagina, revision, filtros, textoConsulta, catalogos]);
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
    establecerPagina(0); establecerFiltros({ desde, hasta, actividadId, categoriaId }); establecerPeriodo('Personalizar'); establecerOpciones(false);
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
  /** Recupera los detalles antes de editar; el menú y el título comparten la misma acción. */
  async function abrirOperacion(entidad: Entidad) {
    establecerPendiente(true); establecerError('');
    try { establecerSeleccion(await servicio.obtener(entidad.id)); establecerNuevo(false); }
    catch (causa) { establecerError(mensaje(causa)); }
    finally { establecerPendiente(false); }
  }
  /** Formatea fechas locales de límites inclusivos sin desplazamientos por UTC. */
  function fechaLocal(fecha: Date) { return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`; }
  /** Aplica un período rápido y vuelve a la primera página manteniendo filtros de catálogo. */
  function cambiarPeriodo(valor: string) {
    if (valor === 'Personalizar') { establecerOpciones(true); return; }
    const hoy = new Date(); const mes = hoy.getMonth() - (valor === 'Mes anterior' ? 1 : 0);
    const inicio = valor === 'Todos' ? '' : fechaLocal(new Date(hoy.getFullYear(), mes, 1));
    const fin = valor === 'Todos' ? '' : fechaLocal(new Date(hoy.getFullYear(), mes + 1, 0));
    establecerDesde(inicio); establecerHasta(fin); establecerPagina(0); establecerPeriodo(valor);
    establecerFiltros({ ...filtros, desde: inicio, hasta: fin }); establecerError('');
  }
  /** Obtiene el mes legible sin cambiar las fechas de negocio. */
  function nombreMes(mes: string) { const nombre = new Date(`${mes}-01T12:00:00`).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }); return nombre.charAt(0).toUpperCase() + nombre.slice(1); }
  /** Presenta dinero exacto conservando moneda y centavos. */
  function dinero(centavos: number, moneda: string) { return formatearImporte(crearImporte(centavos, moneda)); }
  const totales = new Map((resultado.totales ?? []).map(/** Adapta el total por moneda ya calculado por el repositorio. */ function total(registro) { return [registro.moneda, registro.importeCentavos]; }));
  const meses = [...new Set(resultado.elementos.map(/** Obtiene el grupo mensual de una operación visible. */ function mes(entidad) { return entidad.fecha.slice(0, 7); }))];
  /** Presenta icono, datos y monto a la derecha; el menú mantiene el borrado confirmado. */
  function mostrar(entidad: Entidad) {
    const catalogo = tono === 'ingreso' ? catalogos.actividades.find(/** Resuelve nombres e iconos por identidad histórica. */ function identificar(registro) { return registro.id === entidad.actividadId; }) : catalogos.categorias.find(/** Resuelve nombres e iconos por identidad histórica. */ function identificar(registro) { return registro.id === entidad.categoriaId; });
    const actividad = catalogos.actividades.find(/** Resuelve la actividad opcional del gasto por identidad. */ function identificarActividad(registro) { return registro.id === entidad.actividadId; });
    /** Recupera la revisión persistida antes de abrir la edición. */
    function abrir() { void abrirOperacion(entidad); }
    return <Card key={entidad.id} sx={{ position: 'relative', borderRadius: `${tokensVisuales.radioTarjeta}px` }}>
      <CardActionArea onClick={abrir} disabled={pendiente} aria-label={`Ver ${singular}: ${catalogo?.nombre ?? 'Registro histórico'}, ${entidad.fecha}`}>
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '40px minmax(0, 1fr) auto', gap: 1, alignItems: 'start', '@media (max-width: 359px)': { gridTemplateColumns: '40px minmax(0, 1fr)' } }}>
            <IconoCatalogo identificador={catalogo?.icono ?? null} color={catalogo?.color ?? null} contenedor />
            <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}><Typography sx={{ fontWeight: 700 }}>{catalogo?.nombre ?? (tono === 'ingreso' ? 'Actividad histórica' : 'Categoría histórica')}</Typography><Typography variant="body2" color="text.secondary">{new Date(`${entidad.fecha}T12:00:00`).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Typography>{entidad.descripcion && <Typography variant="body2" color="text.secondary">{entidad.descripcion}</Typography>}{tono === 'gasto' && entidad.actividadId && <Typography variant="caption" color="text.secondary">Actividad: {actividad?.nombre ?? 'Actividad histórica'}</Typography>}</Box>
            <Stack direction="row" sx={{ alignItems: 'center', '@media (max-width: 359px)': { gridColumn: 2 } }}><Typography sx={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere', color: `${color}.main`, maxWidth: 180 }}>{dinero(entidad.importeCentavos, entidad.moneda)}</Typography><ChevronRight sx={{ color: 'text.secondary', fontSize: 20 }} /></Stack>
          </Box>
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1, pl: { sm: 6 }, pr: 4 }}>{distribuciones[entidad.id]?.map(/** Presenta una distribución con la moneda de su cabecera. */ function mostrarLinea(linea, indice) { return mostrarDistribucionMoneda(linea, indice, entidad.moneda); })}</Stack>
        </CardContent>
      </CardActionArea>
      <IconButton sx={{ position: 'absolute', right: 0, bottom: 0 }} aria-label={`Acciones de ${singular} del ${entidad.fecha}`} disabled={pendiente} onClick={/** Reserva el menú contextual para acciones sobre esta operación. */ function abrirMenu(evento) { establecerMenu({ ancla: evento.currentTarget, entidad }); }}><MoreVert fontSize="small" /></IconButton>
    </Card>;
  }
  /** Mantiene la moneda de la operación incluso si falta o cambia el catálogo de billetera. */
  function mostrarDistribucionMoneda(linea: LineaCobro, indice: number, moneda: string) {
    const medio = catalogos.medios.find(/** Resuelve nombres e iconos por identidad histórica. */ function identificar(registro) { return registro.id === linea.medioPagoId; });
    const billetera = catalogos.billeteras.find(/** Resuelve nombres e iconos por identidad histórica. */ function identificar(registro) { return registro.id === linea.billeteraId; });
    return <Chip key={indice} icon={<IconoCatalogo identificador={medio?.icono ?? null} color={medio?.color ?? null} />} label={`${medio?.nombre ?? 'Medio histórico'}${linea.billeteraId && billetera?.nombre === medio?.nombre ? '' : ` (${linea.billeteraId ? billetera?.nombre ?? 'Billetera histórica' : 'Legado: billetera sin registrar'})`} · ${dinero(linea.importeCentavos, moneda)}`} sx={{ height: 'auto', minHeight: 28, borderRadius: '8px', maxWidth: '100%', '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 }, '& .MuiSvgIcon-root': { fontSize: 18 } }} />;
  }
  if (nuevo || seleccion) return <Stack spacing={2}><CabeceraPagina titulo={`${seleccion ? 'Detalle de' : 'Nuevo'} ${singular}`} regreso={{ alPulsar: volver, etiqueta: "Volver al listado", deshabilitado: pendiente }} />{formulario(seleccion?.carga, guardar, completado)}</Stack>;
  return <Stack spacing={2}>
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}><Typography component="h1" variant="h2">{titulo}</Typography><Button startIcon={<Add />} color={color} variant="contained" onClick={crear} disabled={pendiente} aria-label={`Agregar ${singular}`} sx={{ borderRadius: '24px', px: 2, color: /** Mantiene legible la acción sobre su color semántico. */ function contraste(tema) { return tema.palette[color].contrastText; } }}>Agregar</Button></Stack>
    {confirmacion && <Alert severity="success">{confirmacion}</Alert>}{error && <Alert severity="error" action={<Button onClick={reintentar}>Reintentar</Button>}>{error}</Alert>}
    <Stack direction="row" useFlexGap sx={{ gap: 0.75, flexWrap: 'wrap' }}>{['Todos', 'Este mes', 'Mes anterior', 'Personalizar'].map(/** Presenta un filtro rápido de período. */ function opcion(valor) { return <Button key={valor} size="small" disabled={pendiente} aria-pressed={periodo === valor} onClick={/** Aplica el período elegido sin modificar operaciones. */ function elegir() { cambiarPeriodo(valor); }} sx={{ borderRadius: '24px', minWidth: 0, px: 1, fontSize: 12, bgcolor: /** Deriva el fondo suave de la paleta vigente. */ function fondo(tema) { return alpha(periodo === valor ? tema.palette[color].main : tema.palette.primary.main, periodo === valor ? 0.14 : 0.04); }, color: periodo === valor ? `${color}.main` : 'text.secondary' }}>{valor}</Button>; })}</Stack>
    <Box sx={{ borderRadius: `${tokensVisuales.radioTarjeta}px`, p: 2, bgcolor: /** Deriva el fondo suave de la paleta vigente. */ function fondo(tema) { return alpha(tema.palette[color].main, 0.1); }, display: 'flex', alignItems: 'center', gap: 1.5 }}><BarChart sx={{ color: `${color}.main`, fontSize: 36 }} /><Box sx={{ minWidth: 0, flex: 1 }}><Typography>Total de {titulo.toLocaleLowerCase('es-AR')}</Typography>{cargando ? <Typography>Calculando…</Typography> : error ? <Typography>No disponible</Typography> : [...(totales.size ? totales : new Map([['ARS', 0]]))].map(/** Presenta cada moneda sin conversiones ni sumas entre divisas. */ function mostrarTotal([moneda, total]) { return <Typography key={moneda} sx={{ fontSize: 32, fontWeight: 700, color: `${color}.main`, overflowWrap: 'anywhere' }}>{dinero(total, moneda)}</Typography>; })}<Button size="small" onClick={/** Abre los controles del período sin cambiarlo todavía. */ function abrirFiltros() { establecerOpciones(true); }} sx={{ p: 0, color: 'text.secondary', textAlign: 'left' }}>{periodo === 'Todos' ? 'Todos los períodos' : periodo === 'Personalizar' ? `${filtros.desde || 'Inicio'} — ${filtros.hasta || 'Sin límite'}` : nombreMes(filtros.desde.slice(0, 7))}<ChevronRight fontSize="small" /></Button></Box></Box>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', '& .MuiTextField-root': { flex: 1, minWidth: 0 } }}><BuscadorCatalogo etiqueta={`Buscar ${titulo.toLocaleLowerCase('es-AR')}…`} valor={busqueda} alCambiar={establecerBusqueda} /><IconButton aria-label="Filtros de operaciones" aria-expanded={opciones} onClick={/** Muestra u oculta los filtros avanzados. */ function alternarFiltros() { establecerOpciones(!opciones); }} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}><FilterAltOutlined /></IconButton></Stack>
    {opciones && <Card><CardContent><Stack spacing={1}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><CampoTextoCatalogo etiqueta="Desde" valor={desde} alCambiar={establecerDesde} tipo="date" /><CampoTextoCatalogo etiqueta="Hasta" valor={hasta} alCambiar={establecerHasta} tipo="date" /></Stack><SelectorCatalogo etiqueta="Actividad" valor={actividadId} opciones={catalogos.actividades} alCambiar={establecerActividadId} />{tono === 'gasto' && <SelectorCatalogo etiqueta="Categoría" valor={categoriaId} opciones={catalogos.categorias} alCambiar={establecerCategoriaId} />}<Button onClick={filtrar} disabled={pendiente}>Aplicar filtros</Button></Stack></CardContent></Card>}
    {errorDetalles && <Alert severity="warning" action={<Button onClick={reintentar}>Reintentar</Button>}>{errorDetalles}</Alert>}
    {cargando ? <CircularProgress aria-label="Cargando operaciones" /> : error ? null : resultado.elementos.length ? meses.map(/** Presenta el mes y sus subtotales completos del filtro. */ function grupo(mes) { return <Stack key={mes} spacing={1}><Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}><Typography variant="h6">{nombreMes(mes)}</Typography><Box>{resultado.resumen?.filter(/** Selecciona coincidencias del filtro o grupo actual. */ function coincide(subtotal) { return subtotal.mes === mes; }).map(/** Muestra el subtotal mensual de una moneda. */ function subtotal(registro) { return <Typography key={registro.moneda} sx={{ fontWeight: 700, color: `${color}.main` }}>{dinero(registro.importeCentavos, registro.moneda)}</Typography>; })}</Box></Stack>{resultado.elementos.filter(/** Selecciona coincidencias del filtro o grupo actual. */ function coincide(entidad) { return entidad.fecha.startsWith(mes); }).map(mostrar)}</Stack>; }) : <EstadoVacio titulo={`Sin ${titulo.toLocaleLowerCase('es-AR')}`} descripcion="Agregá una operación o cambiá la búsqueda y los filtros." />}
    <Stack direction="row" useFlexGap spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}><Button disabled={cargando || pendiente || pagina === 0} onClick={anterior}>Anterior</Button><Typography>Página {pagina + 1} · {resultado.total}</Typography><Button disabled={cargando || pendiente || (pagina + 1) * 20 >= resultado.total} onClick={siguiente}>Siguiente</Button></Stack>
    <Menu anchorEl={menu?.ancla ?? null} open={Boolean(menu)} onClose={/** Cierra las acciones contextuales sin escribir datos. */ function cerrarMenu() { establecerMenu(null); }}><MenuItem disabled={pendiente} onClick={/** Recupera la revisión persistida para abrir la edición. */ function editarDesdeMenu() { if (menu) void abrirOperacion(menu.entidad); establecerMenu(null); }}>Ver detalle / Editar</MenuItem><MenuItem disabled={pendiente} onClick={/** Abre la confirmación de eliminación lógica. */ function solicitarBorrado() { establecerAEliminar(menu?.entidad ?? null); establecerMenu(null); }}>Eliminar {singular}</MenuItem></Menu>
    <Dialog open={Boolean(aEliminar)} onClose={cancelarEliminacion} aria-labelledby="confirmar-borrado-operacion"><DialogTitle id="confirmar-borrado-operacion">Eliminar {singular}</DialogTitle><DialogContent>Se invalidarán la operación, sus detalles y sus movimientos de billetera. El historial se conservará.</DialogContent><DialogActions><Button onClick={cancelarEliminacion} disabled={pendiente}>Cancelar</Button><Button color="error" onClick={eliminar} loading={pendiente}>Eliminar</Button></DialogActions></Dialog>
  </Stack>;
}
