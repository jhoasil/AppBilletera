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
  servicio: ServicioCatalogo<Entidad>;
  crearNuevo: () => Entidad;
  campos: (entidad: Entidad, actualizar: (cambios: Partial<Entidad>) => void) => ReactNode;
  detalle?: (entidad: Entidad) => ReactNode;
  etiquetaCrear?: string;
  alturaTarjeta?: number;
  tamanoIcono?: number;
  textoBusqueda?: (entidad: Entidad) => string;
  guardarPersonalizado?: (entidad: Entidad) => Promise<void>;
  accionAdicional?: (entidad: Entidad, deshabilitado: boolean) => ReactNode;
}

/** Presenta un ABM paginado con errores visibles y controles deshabilitados durante escrituras. */
export function EditorCatalogo<Entidad extends EntidadCatalogo>({ singular, servicio, crearNuevo, campos, detalle, guardarPersonalizado, accionAdicional, etiquetaCrear, alturaTarjeta, tamanoIcono = 48, textoBusqueda }: PropiedadesEditorCatalogo<Entidad>) {
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
  /** Busca solamente metadatos de catálogo y reinicia la página para no ocultar coincidencias. */
  function buscar(valor: string) { establecerBusqueda(valor); establecerPagina(0); }
  /** Compara nombre y los campos visibles sin distinguir mayúsculas. */
  function coincide(entidad: Entidad) { return (textoBusqueda?.(entidad) ?? entidad.nombre).toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es')); }
  const filtrados = textoBusqueda ? elementos.filter(coincide) : elementos;
  const visibles = textoBusqueda ? filtrados.slice(pagina * 20, (pagina + 1) * 20) : filtrados;
  const totalVisible = textoBusqueda ? filtrados.length : total;

  /** Carga una página e ignora respuestas obsoletas al cambiar de destino o paginación. */
  function cargar() {
    let vigente = true;
    establecerCargando(true); establecerError('');
    /** Actualiza el listado solo si corresponde a la página vigente. */
    function completar(resultado: { elementos: readonly Entidad[]; total: number }) { if (vigente) { establecerElementos(resultado.elementos); establecerTotal(resultado.total); establecerCargando(false); } }
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
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
        <Box sx={{ width: tamanoIcono, height: tamanoIcono, flexShrink: 0, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', borderRadius: 1.5 }}><IconoCatalogo identificador={entidad.icono} /></Box>
        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}><Typography variant="subtitle1" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{entidad.nombre}</Typography>
          {detalle && <Box sx={{ color: 'text.secondary', fontSize: 14 }}>{detalle(entidad)}</Box>}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}><Chip size="small" label={entidad.activo ? 'Activa' : 'Inactiva'} variant="outlined" />
          {entidad.color && <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box component="span" sx={{ width: 12, height: 12, bgcolor: entidad.color, borderRadius: '50%', border: '1px solid', borderColor: 'divider' }} />Color {entidad.color}</Typography>}</Stack>
        </Stack>
        <Switch checked={entidad.activo} onChange={cambiarActivo} disabled={pendiente} slotProps={{ input: { 'aria-label': `${entidad.activo ? 'Desactivar' : 'Activar'} ${entidad.nombre}` } }} />
      </Stack>
      <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}><Button onClick={editar} disabled={pendiente} aria-label={`Consultar o editar ${entidad.nombre}`}>Editar</Button>{accionAdicional?.(entidad, pendiente)}</Stack>
    </CardContent></Card>;
  }
  return <Stack spacing={2}>
    <BotonAccion etiqueta={etiquetaCrear ?? `Crear ${singular}`} alPulsar={crear} deshabilitado={pendiente} />
    {textoBusqueda && <CampoTextoCatalogo etiqueta={`Buscar ${singular}`} valor={busqueda} alCambiar={buscar} />}
    {error && <Alert severity="error" action={<Button onClick={recargar}>Reintentar</Button>}>{error}</Alert>}
    {cargando ? <CircularProgress aria-label="Cargando catálogo" /> : visibles.length ? visibles.map(mostrarEntidad) : !error && <EstadoVacio titulo={busqueda ? "Sin coincidencias" : "Sin registros"} descripcion={busqueda ? "Probá con otro nombre o tipo." : "Creá el primer registro de este catálogo."} />}
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <Button onClick={anterior} disabled={pagina === 0 || cargando || pendiente}>Anterior</Button>
      <Typography variant="body2">Página {pagina + 1} · {totalVisible} registros</Typography>
      <Button onClick={siguiente} disabled={(pagina + 1) * 20 >= totalVisible || cargando || pendiente}>Siguiente</Button>
    </Stack>
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
