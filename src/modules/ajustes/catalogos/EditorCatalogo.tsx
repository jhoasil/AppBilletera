import ArrowBack from '@mui/icons-material/ArrowBack';
import Add from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react';
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
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { BuscadorCatalogo } from '../../../shared/components/BuscadorCatalogo';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { listarCatalogo } from '../../../app/data/datosCargaRapida';
import { BotonAccion } from '../../../shared/components/BotonAccion';
import { EstadoVacio } from '../../../shared/components/EstadoVacio';
import { ServicioCatalogo, type EntidadCatalogo } from '../../../core/services/ServicioCatalogo';
import { CampoTextoCatalogo } from '../../../shared/components/CampoTextoCatalogo';
import { IconoCatalogo } from '../../../shared/components/IconoCatalogo';

/** Contrato visual para reutilizar el listado y diálogo sin mezclar campos de entidades. */
export interface PropiedadesEditorCatalogo<Entidad extends EntidadCatalogo> {
  singular: string;
  alVolver?: () => void;
  actividad?: boolean;
  servicio: ServicioCatalogo<Entidad>;
  crearNuevo: () => Entidad;
  campos: (entidad: Entidad, actualizar: (cambios: Partial<Entidad>) => void) => ReactNode;
  detalle?: (entidad: Entidad) => ReactNode;
  etiquetaCrear?: string;
  masculino?: boolean;
  alturaTarjeta?: number;
  tamanoIcono?: number;
  textoBusqueda?: (entidad: Entidad) => string;
  guardarPersonalizado?: (entidad: Entidad) => Promise<void>;
  accionAdicional?: (entidad: Entidad, deshabilitado: boolean) => ReactNode;
}

/** Presenta un ABM paginado con errores visibles y controles deshabilitados durante escrituras. */
export function EditorCatalogo<Entidad extends EntidadCatalogo>({ singular, alVolver, actividad = false, servicio, crearNuevo, campos, detalle, guardarPersonalizado, accionAdicional, etiquetaCrear, alturaTarjeta, tamanoIcono = 48, textoBusqueda }: PropiedadesEditorCatalogo<Entidad>) {
  const [elementos, establecerElementos] = useState<readonly Entidad[]>([]);
  const [total, establecerTotal] = useState(0);
  const [pagina, establecerPagina] = useState(0);
  const [revision, establecerRevision] = useState(0);
  const [cargando, establecerCargando] = useState(true);
  const [pendiente, establecerPendiente] = useState(false);
  const [error, establecerError] = useState('');
  const [errorFormulario, establecerErrorFormulario] = useState('');
  const [borrador, establecerBorrador] = useState<Entidad | null>(null);
  const formularioId = useId();
  const [busqueda, establecerBusqueda] = useState('');
  const [filtro, establecerFiltro] = useState('Todas');
  /** Busca solamente metadatos de catálogo y reinicia la página para no ocultar coincidencias. */
  function buscar(valor: string) { establecerBusqueda(valor); establecerPagina(0); }
  /** Compara nombre y los campos visibles sin distinguir mayúsculas. */
  function coincide(entidad: Entidad) { return (!actividad || filtro === 'Todas' || (filtro === 'Archivadas' ? ('estado' in entidad && entidad.estado === 'archivado') : (!('estado' in entidad) || entidad.estado !== 'archivado') && entidad.activo === (filtro === 'Activas'))) && (textoBusqueda?.(entidad) ?? entidad.nombre).toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es')); }
  const filtrados = textoBusqueda ? elementos.filter(coincide) : elementos;
  const visibles = textoBusqueda ? filtrados.slice(pagina * 20, (pagina + 1) * 20) : filtrados;
  const totalVisible = textoBusqueda ? filtrados.length : total;

  /** Carga una página e ignora respuestas obsoletas al cambiar de destino o paginación. */
  function cargar() {
    let vigente = true;
    establecerCargando(true); establecerError('');
    /** Actualiza el listado solo si corresponde a la página vigente. */
    function completar(resultado: { elementos: readonly Entidad[]; total: number }) { if (vigente) { establecerElementos(resultado.elementos); establecerTotal(resultado.total); establecerCargando(false); establecerPagina(/** Corrige una página que quedó fuera de rango al cambiar un catálogo. */ function acotar(actual) { return Math.min(actual, Math.max(0, Math.ceil(resultado.total / 20) - 1)); }); } }
    /** Presenta un error de lectura con posibilidad de reintentar. */
    function fallar(causa: unknown) { if (vigente) { establecerError(mensajeError(causa)); establecerCargando(false); } }
    /** Carga únicamente catálogos pequeños cuando hay búsqueda; conserva las páginas de otros listados. */
    async function consultar() { if (!textoBusqueda) return servicio.listar(pagina); const registros = await listarCatalogo(servicio); return { elementos: registros, total: registros.length }; }
    void consultar().then(completar, fallar);
    /** Cancela únicamente la actualización visual; la lectura del motor termina normalmente. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, [servicio, textoBusqueda ? 0 : pagina, revision]);
  /** Extrae un mensaje legible de errores de servicio. */
  function mensajeError(causa: unknown) { return causa instanceof Error ? causa.message : 'No se pudo completar la operación.'; }
  /** Fuerza una lectura actualizada sin borrar datos. */
  function recargar() { establecerRevision(revision + 1); }
  /** Abre un formulario con los valores propios de una nueva entidad. */
  function crear() { establecerErrorFormulario(''); establecerBorrador(crearNuevo()); }
  /** Cierra un formulario únicamente cuando no se está guardando. */
  function cerrar() { if (!pendiente) establecerBorrador(null); }
  /** Actualiza campos locales sin escribir hasta confirmar el formulario. */
  function actualizar(cambios: Partial<Entidad>) {
    /** Mezcla la edición con el borrador vigente evitando perder cambios concurrentes del formulario. */
    function mezclar(anterior: Entidad | null) { return anterior ? { ...anterior, ...cambios } : null; }
    establecerBorrador(mezclar);
  }
  /** Actualiza el nombre común a los cuatro catálogos. */
  function cambiarNombre(nombre: string) { actualizar({ nombre } as Partial<Entidad>); }
  /** Persiste la entidad y vuelve a consultar la página, comunicando los fallos sin cerrar el diálogo. */
  async function guardar(evento: FormEvent) {
    evento.preventDefault(); if (!borrador || pendiente) return;
    establecerPendiente(true); establecerErrorFormulario('');
    try { if (guardarPersonalizado) await guardarPersonalizado(borrador); else await servicio.guardar(borrador); establecerBorrador(null); recargar(); }
    catch (causa) { establecerErrorFormulario(mensajeError(causa)); }
    finally { establecerPendiente(false); }
  }
  /** Retrocede una página dentro del catálogo. */
  function anterior() { establecerPagina(Math.max(0, pagina - 1)); }
  /** Avanza una página dentro del catálogo. */
  function siguiente() { establecerPagina(pagina + 1); }
  /** Presenta un registro y sus operaciones de consulta, edición y activación. */
  function mostrarEntidad(entidad: Entidad) {
    /** Abre los datos persistidos del registro para consultarlos o editarlos. */
    function editar() { establecerErrorFormulario(''); establecerBorrador({ ...entidad }); }
    /** Cambia la disponibilidad conservando la identidad y el historial. */
    async function cambiarActivo() {
      establecerPendiente(true);
      try { await servicio.cambiarActivo(entidad.id, !entidad.activo); recargar(); }
      catch (causa) { establecerError(mensajeError(causa)); }
      finally { establecerPendiente(false); }
    }
    return <Card key={entidad.id} sx={{ p: 0 }}><CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, minHeight: alturaTarjeta ?? 88 }}>
      {/* En 320 px las acciones bajan de fila para conservar nombres y chips completos. */}
      <Box sx={{ display: 'grid', gridTemplateColumns: `${tamanoIcono}px minmax(0, 1fr) auto`, gap: actividad ? 1 : 1.5, alignItems: 'center', '@media (max-width:359px)': { gridTemplateColumns: `${tamanoIcono}px minmax(0, 1fr)` } }}>
        <IconoCatalogo identificador={entidad.icono} color={entidad.color} contenedor tamano={tamanoIcono} />
        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}><Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: actividad ? 14 : undefined, overflowWrap: 'anywhere' }}>{entidad.nombre}</Typography>
          {detalle && <Box sx={{ color: 'text.secondary', fontSize: 14 }}>{detalle(entidad)}</Box>}
          <Chip size="small" sx={{ display: actividad ? 'none' : undefined, alignSelf: 'flex-start' }} label={entidad.activo ? 'Disponible' : 'No disponible'} color={entidad.activo ? 'success' : 'default'} variant="outlined" />
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', '@media (max-width:359px)': { gridColumn: '2 / -1', justifyContent: 'space-between' } }}><Stack sx={{ alignItems: 'center', flexShrink: 0 }}><Typography variant="caption" sx={{ display: actividad ? 'none' : undefined }}>Disponible</Typography><Switch size={actividad ? 'small' : 'medium'} color={actividad ? 'success' : 'primary'} checked={entidad.activo} onChange={cambiarActivo} disabled={pendiente} slotProps={{ input: { 'aria-label': `${entidad.activo ? 'Desactivar' : 'Activar'} ${entidad.nombre}` } }} /></Stack>
        <IconButton size={actividad ? 'small' : 'medium'} onClick={editar} disabled={pendiente} aria-label={`Consultar o editar ${entidad.nombre}`}><ChevronRight /></IconButton></Stack>
      </Box>
      {accionAdicional && <Box sx={{ mt: 1 }}>{accionAdicional(entidad, pendiente)}</Box>}
    </CardContent></Card>;
  }
  if (actividad && borrador) return <Stack spacing={2}>
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}><IconButton onClick={cerrar} disabled={pendiente} aria-label="Volver a Actividades"><ArrowBack /></IconButton><Typography component="h1" variant="h2">{borrador.id ? 'Editar actividad' : 'Nueva actividad'}</Typography></Stack>
    <Card component="form" id={formularioId} onSubmit={guardar} sx={{ p: 2 }}><Stack component="fieldset" disabled={pendiente} spacing={2} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
      {errorFormulario && <Alert severity="error">{errorFormulario}</Alert>}
      <CampoTextoCatalogo etiqueta="Nombre *" etiquetaExterior valor={borrador.nombre} alCambiar={cambiarNombre} obligatorio icono={<IconoCatalogo identificador={borrador.icono} />} />
      {campos(borrador, actualizar)}
      <FormControlLabel label="Disponible para nuevas operaciones" control={<Switch color="success" checked={borrador.activo} onChange={/** Cambia disponibilidad del borrador sin modificar historia. */ function disponibilidad(_evento, activo) { actualizar({ activo } as Partial<Entidad>); }} />} />
    </Stack></Card>
    <Button type="submit" form={formularioId} variant="contained" color="success" startIcon={<Check />} loading={pendiente}>Guardar cambios</Button><Button onClick={cerrar} disabled={pendiente} sx={{ bgcolor: 'action.hover' }}>Cancelar</Button>
  </Stack>;
  return <Stack spacing={2}>
    {actividad && <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}><IconButton onClick={alVolver} aria-label="Volver a Ajustes"><ArrowBack /></IconButton><Typography component="h1" variant="h2" sx={{ flex: 1 }}>Actividades</Typography><Button variant="contained" color="success" startIcon={<Add />} onClick={crear} sx={{ borderRadius: '24px', color: 'common.white' }}>Agregar</Button></Stack>}
    {textoBusqueda && <BuscadorCatalogo etiqueta={`Buscar ${singular}`} valor={busqueda} alCambiar={buscar} />}
    {actividad && <ToggleButtonGroup exclusive value={filtro} onChange={/** Filtra antes de paginar y vuelve al principio del resultado. */ function filtrar(_evento, valor: string | null) { if (valor) { establecerFiltro(valor); establecerPagina(0); } }} sx={{ gap: 1, overflowX: 'auto', '& .MuiToggleButton-root': { border: 0, borderRadius: '24px !important', textTransform: 'none', px: 1, fontSize: 12, '&.Mui-selected': { color: 'success.main', bgcolor: 'action.selected' } } }}>{['Todas', 'Activas', 'Inactivas', 'Archivadas'].map(/** Ofrece estados de consulta con nombre explícito. */ function opcion(valor) { return <ToggleButton key={valor} value={valor}>{valor}</ToggleButton>; })}</ToggleButtonGroup>}
    {error && <Alert severity="error" action={<Button onClick={recargar}>Reintentar</Button>}>{error}</Alert>}
    {cargando ? <CircularProgress aria-label="Cargando catálogo" /> : visibles.length ? visibles.map(mostrarEntidad) : !error && <EstadoVacio titulo={busqueda || (actividad && filtro !== 'Todas') ? "Sin coincidencias" : "Sin registros"} descripcion={busqueda || (actividad && filtro !== 'Todas') ? "Probá con otro nombre o filtro." : "Creá el primer registro de este catálogo."} />}
    <Stack direction="row" useFlexGap spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
      <Button onClick={anterior} disabled={pagina === 0 || cargando || pendiente}>Anterior</Button>
      <Typography variant="body2">Página {pagina + 1} · {totalVisible} registros</Typography>
      <Button onClick={siguiente} disabled={(pagina + 1) * 20 >= totalVisible || cargando || pendiente}>Siguiente</Button>
    </Stack>
    {/* La acción de alta queda dentro del flujo para no tapar la navegación ni el teclado. */}
    {!actividad && <BotonAccion etiqueta={etiquetaCrear ?? `Crear ${singular}`} alPulsar={crear} deshabilitado={pendiente} />}
    <Dialog open={Boolean(borrador)} onClose={cerrar} fullWidth maxWidth="sm" aria-labelledby={`${formularioId}-titulo`}>
      <DialogTitle id={`${formularioId}-titulo`}>{borrador?.id ? 'Editar' : 'Crear'} {singular}</DialogTitle>
      <DialogContent><Stack component="form" id={formularioId} onSubmit={guardar} spacing={2} sx={{ pt: 1 }}>
        {errorFormulario && <Alert severity="error">{errorFormulario}</Alert>}
        {borrador && <Stack component="fieldset" disabled={pendiente} spacing={2} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}><CampoTextoCatalogo etiqueta="Nombre" valor={borrador.nombre} alCambiar={cambiarNombre} obligatorio />{campos(borrador, actualizar)}</Stack>}
      </Stack></DialogContent>
      <DialogActions><Button onClick={cerrar} disabled={pendiente}>Cancelar</Button><Button type="submit" form={formularioId} variant="contained" loading={pendiente}>Guardar</Button></DialogActions>
    </Dialog>
  </Stack>;
}
