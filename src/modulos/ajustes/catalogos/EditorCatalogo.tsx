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
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { BotonAccion } from '../../../compartido/componentes/BotonAccion';
import { EstadoVacio } from '../../../compartido/componentes/EstadoVacio';
import { ServicioCatalogo, type EntidadCatalogo } from '../../../nucleo/servicios/ServicioCatalogo';
import { CampoTextoCatalogo } from '../../../compartido/componentes/CampoTextoCatalogo';
import { IconoCatalogo } from '../../../compartido/componentes/IconoCatalogo';

/** Contrato visual para reutilizar el listado y diálogo sin mezclar campos de entidades. */
export interface PropiedadesEditorCatalogo<Entidad extends EntidadCatalogo> {
  singular: string;
  servicio: ServicioCatalogo<Entidad>;
  crearNuevo: () => Entidad;
  campos: (entidad: Entidad, actualizar: (cambios: Partial<Entidad>) => void) => ReactNode;
  detalle?: (entidad: Entidad) => string;
}

/** Presenta un ABM paginado con errores visibles y controles deshabilitados durante escrituras. */
export function EditorCatalogo<Entidad extends EntidadCatalogo>({ singular, servicio, crearNuevo, campos, detalle }: PropiedadesEditorCatalogo<Entidad>) {
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

  /** Carga una página e ignora respuestas obsoletas al cambiar de destino o paginación. */
  function cargar() {
    let vigente = true;
    establecerCargando(true); establecerError('');
    /** Actualiza el listado solo si corresponde a la página vigente. */
    function completar(resultado: { elementos: readonly Entidad[]; total: number }) { if (vigente) { establecerElementos(resultado.elementos); establecerTotal(resultado.total); establecerCargando(false); } }
    /** Presenta un error de lectura con posibilidad de reintentar. */
    function fallar(causa: unknown) { if (vigente) { establecerError(mensajeError(causa)); establecerCargando(false); } }
    void servicio.listar(pagina).then(completar, fallar);
    /** Cancela únicamente la actualización visual; la lectura del motor termina normalmente. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, [servicio, pagina, revision]);
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
    try { await servicio.guardar(borrador); establecerBorrador(null); recargar(); }
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
    return <Card key={entidad.id}><CardContent><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
      <IconoCatalogo identificador={entidad.icono} />
      <Stack sx={{ flex: 1 }}><Typography variant="h6">{entidad.nombre}</Typography>
        <Typography variant="body2" color="text.secondary">{detalle?.(entidad) ?? (entidad.activo ? 'Activo' : 'Inactivo')}</Typography></Stack>
      <Button onClick={editar} disabled={pendiente} aria-label={`Consultar o editar ${entidad.nombre}`}>Editar</Button>
      <FormControlLabel label={entidad.activo ? 'Activo' : 'Inactivo'} control={<Switch checked={entidad.activo} onChange={cambiarActivo} disabled={pendiente} slotProps={{ input: { 'aria-label': `Activar ${entidad.nombre}` } }} />} />
    </Stack></CardContent></Card>;
  }
  return <Stack spacing={2}>
    <BotonAccion etiqueta={`Crear ${singular}`} alPulsar={crear} deshabilitado={pendiente} />
    {error && <Alert severity="error" action={<Button onClick={recargar}>Reintentar</Button>}>{error}</Alert>}
    {cargando ? <CircularProgress aria-label="Cargando catálogo" /> : elementos.length ? elementos.map(mostrarEntidad) : !error && <EstadoVacio titulo="Sin registros" descripcion="Creá el primer registro de este catálogo." />}
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <Button onClick={anterior} disabled={pagina === 0 || cargando || pendiente}>Anterior</Button>
      <Typography variant="body2">Página {pagina + 1} · {total} registros</Typography>
      <Button onClick={siguiente} disabled={(pagina + 1) * 20 >= total || cargando || pendiente}>Siguiente</Button>
    </Stack>
    <Dialog open={Boolean(borrador)} onClose={cerrar} fullWidth maxWidth="sm" aria-labelledby={`${formularioId}-titulo`}>
      <DialogTitle id={`${formularioId}-titulo`}>{borrador?.id ? 'Editar' : 'Crear'} {singular}</DialogTitle>
      <DialogContent><Stack component="form" id={formularioId} onSubmit={guardar} spacing={2} sx={{ pt: 1 }}>
        {errorFormulario && <Alert severity="error">{errorFormulario}</Alert>}
        {borrador && <><CampoTextoCatalogo etiqueta="Nombre" valor={borrador.nombre} alCambiar={cambiarNombre} obligatorio />{campos(borrador, actualizar)}</>}
      </Stack></DialogContent>
      <DialogActions><Button onClick={cerrar} disabled={pendiente}>Cancelar</Button><Button type="submit" form={formularioId} variant="contained" loading={pendiente}>Guardar</Button></DialogActions>
    </Dialog>
  </Stack>;
}
