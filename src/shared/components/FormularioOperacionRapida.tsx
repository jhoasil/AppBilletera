import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import Check from '@mui/icons-material/Check';
import Save from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { estadosFinancieros, tokensVisuales } from '../../app/theme/tokens';
import { cargarDatosIngreso } from '../../app/data/datosCargaRapida';
import { preferenciasUI } from '../../app/preferences/ServicioPreferenciasUI';
import { CampoTextoCatalogo } from './CampoTextoCatalogo';
import { CampoImporte } from './CampoImporte';
import { SelectorCatalogo } from './SelectorCatalogo';
import { IconoCatalogo } from './IconoCatalogo';
import { fechaActual } from '../dates/fechaActual';
import { formatearImporte } from '../money/formatearImporte';
import { crearImporte } from '../../core/money/Importe';
import { calcularCargaRapida, interpretarCampoRapido } from '../../core/money/calcularCargaRapida';
import type { CargaIngreso, LineaCobro } from '../../core/services/CargaIngreso';
import type { MedioPago } from '../../core/entities/MedioPago';

/** Edición textual de una distribución; su dinero se convierte únicamente mediante dominio. */
interface LineaFormulario { medioPagoId: string; billeteraId: string; importe: string }
/** Formulario conectado mediante una acción de aplicación, sin acceso a IndexedDB. */
export interface PropiedadesFormularioOperacion { tipo: 'ingreso' | 'gasto'; alGuardar?: (carga: CargaOperacion) => Promise<void>; inicial?: CargaIngreso & { categoriaId?: string }; alCompletar?: () => void; etiquetaGuardar?: string; resumenImpacto?: (moneda: string, lineas: readonly LineaCobro[]) => ReactNode }
/** Datos comunes de pantalla; la actividad vacía se convierte en null para un gasto. */
export interface CargaOperacion extends CargaIngreso { categoriaId: string }

/** Precarga la actividad y muestra los cobros rápidos con suma exacta y ceros sin persistir. */
export function FormularioOperacionRapida({ tipo, alGuardar, inicial, alCompletar, resumenImpacto, etiquetaGuardar }: PropiedadesFormularioOperacion) {
  const [datos, establecerDatos] = useState<Awaited<ReturnType<typeof cargarDatosIngreso>> | null>(null);
  const [actividad, establecerActividad] = useState(inicial?.actividadId ?? '');
  const [categoria, establecerCategoria] = useState(inicial?.categoriaId ?? '');
  const [fecha, establecerFecha] = useState(inicial?.fecha ?? fechaActual());
  const [descripcion, establecerDescripcion] = useState(inicial?.descripcion ?? '');
  const [observaciones, establecerObservaciones] = useState(inicial?.observaciones ?? '');
  const [moneda, establecerMoneda] = useState(inicial?.moneda ?? 'ARS');
  const [lineas, establecerLineas] = useState<readonly LineaFormulario[]>([]);
  const [error, establecerError] = useState('');
  const [errorCarga, establecerErrorCarga] = useState('');
  const [revision, establecerRevision] = useState(0);
  const [pendiente, establecerPendiente] = useState(false);
  const [confirmacion, establecerConfirmacion] = useState('');
  /** Carga catálogos y conserva datos históricos al abrir una edición. */
  function cargar() {
    let vigente = true; establecerErrorCarga('');
    /** Prepara medios rápidos sin valores financieros prefijados. */
    function completar(resultado: Awaited<ReturnType<typeof cargarDatosIngreso>>) {
      if (!vigente) return;
      establecerDatos(resultado);
      /** Ofrece actividades activas y la identidad histórica seleccionada. */
      function disponible(registro: { activo: boolean; id: string }) { return registro.activo || registro.id === inicial?.actividadId; }
      if (!inicial) {
        establecerActividad(preferenciasUI.obtenerDisponible(tipo === 'ingreso' ? 'ultima_actividad_ingreso' : 'ultima_actividad_gasto', resultado.actividades.filter(disponible)));
        establecerCategoria(preferenciasUI.obtenerDisponible('ultima_categoria_gasto', resultado.categorias.filter(disponible)));
      }
      /** Crea una fila vacía por cada medio rápido, o recupera las distribuciones históricas. */
      function preparar(medio: MedioPago): LineaFormulario { return { medioPagoId: medio.id, billeteraId: medio.billeteraPredeterminadaId ?? '', importe: '' }; }
      /** Incluye solamente medios activos configurados para carga rápida. */
      function rapido(medio: MedioPago) { return medio.activo && medio.mostrarEnCargaRapida; }
      /** Convierte centavos históricos a texto decimal exacto sin formateo con miles. */
      function recuperar(linea: LineaCobro): LineaFormulario { const centavos = BigInt(linea.importeCentavos); return { medioPagoId: linea.medioPagoId, billeteraId: linea.billeteraId ?? '', importe: `${centavos / 100n},${String(centavos % 100n).padStart(2, '0')}` }; }
      establecerLineas(inicial ? inicial.lineas.map(recuperar) : resultado.medios.filter(rapido).map(preparar));
    }
    /** Comunica un fallo de lectura con reintento. */
    function fallar(causa: unknown) { if (vigente) establecerErrorCarga(causa instanceof Error ? causa.message : 'No se pudieron cargar los catálogos.'); }
    void cargarDatosIngreso().then(completar, fallar);
    /** Ignora la respuesta cuando se abandona la pantalla. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, [inicial, revision, tipo]);
  /** Reintenta la lectura manteniendo el formulario visible. */
  function reintentar() { establecerRevision(revision + 1); }
  /** Obtiene el texto de cada importe para calcular el total en dominio. */
  function texto(linea: LineaFormulario) { return linea.importe; }
  let total = 0; let errorImportes = '';
  try { total = calcularCargaRapida(lineas.map(texto), moneda); }
  catch (causa) { errorImportes = causa instanceof Error ? causa.message : 'El importe no es válido.'; }
  /** Ofrece catálogos activos sin ocultar una identidad usada en la operación editada. */
  function actividadDisponible(registro: { activo: boolean; id: string }) { return registro.activo || registro.id === inicial?.actividadId; }
  /** Conserva la categoría histórica únicamente para la operación que la utilizó. */
  function categoriaDisponible(registro: { activo: boolean; id: string }) { return registro.activo || registro.id === inicial?.categoriaId; }
  /** Presenta una fila rápida y permite elegir el destino real del dinero. */
  function mostrarLinea(linea: LineaFormulario, indice: number) {
    /** Encuentra la etiqueta e icono del medio. */
    function coincide(medio: MedioPago) { return medio.id === linea.medioPagoId; }
    const medio = datos?.medios.find(coincide);
    /** Cambia una fila sin perder las demás distribuciones. */
    function cambiar(cambios: Partial<LineaFormulario>) {
      /** Mezcla únicamente la posición editada. */
      function mezclar(actual: LineaFormulario, posicion: number) { return posicion === indice ? { ...actual, ...cambios } : actual; }
      establecerLineas(lineas.map(mezclar));
    }
    /** Conserva el importe escrito para validarlo y sumar sin redondeo. */
    function cambiarImporte(valor: string) { cambiar({ importe: valor }); }
    /** Actualiza la billetera real, independiente del medio de cobro. */
    function cambiarBilletera(valor: string) { cambiar({ billeteraId: valor }); }
    /** Mantiene el destino histórico aunque esté inactivo. */
    function billeteraDisponible(registro: { activo: boolean; id: string; moneda: string }) { return (registro.activo && registro.moneda === moneda) || registro.id === linea.billeteraId; }
    /** Retira un medio opcional del borrador. */
    function quitar() { establecerLineas(lineas.filter(conservar)); }
    /** Conserva todas las posiciones excepto la retirada. */
    function conservar(_actual: LineaFormulario, posicion: number) { return posicion !== indice; }
    // El importe comparte fila con el medio; la billetera sigue visible y editable debajo.
    return <Card key={`${linea.medioPagoId}-${indice}`} variant="outlined"><CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}><Stack spacing={1.5}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(110px, 42%)', gap: 1, alignItems: 'center' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}><IconoCatalogo identificador={medio?.icono ?? null} color={medio?.color ?? null} contenedor tamano={32} /><Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere', fontSize: 14 }}>{medio?.nombre ?? 'Medio histórico'}</Typography></Stack>
        <CampoImporte etiqueta={`Importe ${medio?.nombre ?? ''}`} valor={linea.importe} alCambiar={cambiarImporte} compacto />
      </Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}><Box sx={{ flex: 1, minWidth: 0 }}><SelectorCatalogo etiqueta="Billetera real" valor={linea.billeteraId} alCambiar={cambiarBilletera} opciones={datos?.billeteras.filter(billeteraDisponible) ?? []} obligatorio /></Box><IconButton aria-label={`Quitar ${medio?.nombre ?? 'medio'}`} onClick={quitar}><Close /></IconButton></Stack>
    </Stack></CardContent></Card>;
  }
  /** Agrega un medio activo que no esté presente, sin editar su catálogo. */
  function mostrarMedio(medio: MedioPago) {
    /** Detecta si el medio ya tiene una fila. */
    function usado(linea: LineaFormulario) { return linea.medioPagoId === medio.id; }
    if (!medio.activo || lineas.some(usado)) return null;
    /** Añade una distribución con la billetera sugerida. */
    function agregar() { establecerLineas([...lineas, { medioPagoId: medio.id, billeteraId: medio.billeteraPredeterminadaId ?? '', importe: '' }]); }
    return <Button key={medio.id} onClick={agregar}>Agregar {medio.nombre}</Button>;
  }
  /** Confirma solo líneas positivas; las preferencias se escriben después del guardado efectivo. */
  async function guardar(evento: FormEvent) {
    evento.preventDefault(); if (pendiente || !alGuardar) return;
    establecerError(''); establecerConfirmacion('');
    if (errorImportes || total === 0 || (tipo === 'ingreso' && !actividad) || (tipo === 'gasto' && (!categoria || !descripcion.trim()))) { establecerError(errorImportes || 'Completá los campos obligatorios e indicá un total mayor a cero.'); return; }
    /** Convierte las filas al contrato del servicio. */
    function convertir(linea: LineaFormulario): LineaCobro { return { medioPagoId: linea.medioPagoId, billeteraId: linea.billeteraId || null, importeCentavos: interpretarCampoRapido(linea.importe) }; }
    /** Excluye ceros de la persistencia. */
    function positiva(linea: LineaCobro) { return linea.importeCentavos > 0; }
    establecerPendiente(true);
    try {
      await alGuardar({ actividadId: actividad, categoriaId: categoria, fecha, descripcion, observaciones, moneda, lineas: lineas.map(convertir).filter(positiva) });
      preferenciasUI.recordar(tipo === 'ingreso' ? 'ultima_actividad_ingreso' : 'ultima_actividad_gasto', actividad || null);
      if (tipo === 'gasto') preferenciasUI.recordar('ultima_categoria_gasto', categoria);
      establecerConfirmacion(tipo === 'ingreso' ? 'Ingreso guardado.' : 'Gasto guardado.');
      if (alCompletar) alCompletar(); else establecerRevision(revision + 1);
    } catch (causa) { establecerError(causa instanceof Error ? causa.message : 'No se pudo guardar la operación.'); }
    finally { establecerPendiente(false); }
  }
  if (!datos) return errorCarga ? <Alert severity="error" action={<Button onClick={reintentar}>Reintentar</Button>}>{errorCarga}</Alert> : <CircularProgress aria-label={tipo === 'ingreso' ? 'Cargando medios de cobro' : 'Cargando medios de pago'} />;
  return <Stack component="form" onSubmit={guardar} spacing={2} sx={{ maxWidth: tokensVisuales.anchoFormulario, width: '100%' }}>
    {errorCarga && <Alert severity="error">{errorCarga}</Alert>}{error && <Alert severity="error">{error}</Alert>}{confirmacion && <Alert severity="success">{confirmacion}</Alert>}
    <Stack component="fieldset" disabled={pendiente} spacing={2} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
      <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={2}>
      {tipo === 'gasto' && <SelectorCatalogo etiqueta="Categoría" valor={categoria} alCambiar={establecerCategoria} opciones={datos.categorias.filter(categoriaDisponible)} obligatorio />}
      <SelectorCatalogo etiqueta={tipo === 'ingreso' ? 'Actividad' : 'Actividad (opcional)'} valor={actividad} alCambiar={establecerActividad} opciones={datos.actividades.filter(actividadDisponible)} obligatorio={tipo === 'ingreso'} />
      <CampoTextoCatalogo etiqueta="Fecha" valor={fecha} alCambiar={establecerFecha} tipo="date" obligatorio />
      <CampoTextoCatalogo etiqueta={tipo === 'ingreso' ? 'Descripción (opcional)' : 'Descripción'} valor={descripcion} alCambiar={establecerDescripcion} obligatorio={tipo === 'gasto'} />
      <CampoTextoCatalogo etiqueta="Observaciones (opcional)" valor={observaciones} alCambiar={establecerObservaciones} />
      <details><summary>Moneda: {moneda}</summary><Stack sx={{ pt: 2 }}><CampoTextoCatalogo etiqueta="Moneda" valor={moneda} alCambiar={establecerMoneda} obligatorio /></Stack></details>
      </Stack></Paper>
      <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={1.5}>
      <Typography variant="h6">{tipo === 'ingreso' ? 'Medios de cobro' : 'Medios de pago'} · {moneda}</Typography>
      <Typography variant="body2" color="text.secondary">Vacío equivale a 0. Usá coma o punto decimal, sin separadores de miles. El destino sugerido puede cambiarse en cada medio.</Typography>{lineas.map(mostrarLinea)}
      <Stack direction="row" sx={{ flexWrap: 'wrap' }}>{datos.medios.map(mostrarMedio)}</Stack>
      </Stack></Paper>
      {errorImportes ? <Alert severity="error">{errorImportes}</Alert> : <Paper aria-live="polite" sx={/** Usa la misma superficie financiera para ingresos y gastos en ambos temas. */ function apariencia(tema) { const estado = estadosFinancieros[tema.palette.mode === 'dark' ? 'oscuro' : 'claro'][tipo]; return { minHeight: 68, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, bgcolor: estado.fondo, color: estado.texto }; }}><Typography sx={{ fontWeight: 600 }}>TOTAL</Typography><Typography sx={{ fontSize: 24, fontWeight: 700, overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }}>{formatearImporte(crearImporte(total, moneda))}</Typography></Paper>}
    </Stack>
    {resumenImpacto && !errorImportes && resumenImpacto(moneda, lineas.map(/** Prepara distribuciones positivas para la vista previa delegada al dominio. */ function convertir(linea) { return { medioPagoId: linea.medioPagoId, billeteraId: linea.billeteraId || null, importeCentavos: interpretarCampoRapido(linea.importe) }; }).filter(/** Excluye líneas vacías de la vista previa, igual que en el guardado. */ function positiva(linea) { return linea.importeCentavos > 0; }))}
    {!alGuardar && <Alert severity="info">La persistencia se conectará en la siguiente tarea.</Alert>}
    <Button startIcon={tipo === 'gasto' ? <Check /> : <Save />} fullWidth type="submit" variant="contained" color={tipo === 'ingreso' ? 'success' : 'error'} loading={pendiente} disabled={!alGuardar || Boolean(errorImportes) || total === 0}>{etiquetaGuardar ?? `Guardar ${tipo}`}</Button>
  </Stack>;
}
