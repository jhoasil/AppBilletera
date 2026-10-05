import { resolverMonedaOperacion, monedaOtrasLineas } from '../../core/money/resolverMonedaOperacion';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Save from '@mui/icons-material/Save';
import TrendingUp from '@mui/icons-material/TrendingUp';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import ChatBubbleOutlined from '@mui/icons-material/ChatBubbleOutlined';
import Info from '@mui/icons-material/Info';
import Settings from '@mui/icons-material/Settings';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
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
import { OpcionesMediosOperacion } from './OpcionesMediosOperacion';
import { fechaActual } from '../dates/fechaActual';
import { formatearImporte } from '../money/formatearImporte';
import { crearImporte } from '../../core/money/Importe';
import { interpretarCampoRapido } from '../../core/money/calcularCargaRapida';
import type { CargaIngreso, LineaCobro } from '../../core/services/CargaIngreso';
import type { MedioPago } from '../../core/entities/MedioPago';

/** Edición textual de una distribución; su dinero se convierte únicamente mediante dominio. */
interface LineaFormulario { medioPagoId: string; billeteraId: string; importe: string; agregadaManualmente?: boolean }
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
  const [lineas, establecerLineas] = useState<readonly LineaFormulario[]>([]);
  const [billeteraReferencia, establecerBilleteraReferencia] = useState('');
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
  const resumenOperacion = resolverMonedaOperacion(lineas, datos?.billeteras ?? [], inicial?.moneda, billeteraReferencia, tipo);
  const moneda = resumenOperacion.moneda ?? '';
  const total = resumenOperacion.totalCentavos;
  const errorImportes = resumenOperacion.error;
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
    function cambiarBilletera(valor: string) { cambiar({ billeteraId: valor }); establecerBilleteraReferencia(valor); }
    /** Mantiene el destino histórico aunque esté inactivo. */
    function billeteraDisponible(registro: { activo: boolean; id: string; moneda: string }) { return registro.activo || registro.id === linea.billeteraId; }
    const monedaRequerida = monedaOtrasLineas(lineas, indice, datos?.billeteras ?? [], inicial?.moneda);
    /** Etiqueta la moneda de cada destino y bloquea combinaciones incompatibles con otros cobros. */
    function opcionBilletera(registro: { id: string; nombre: string; moneda: string }) { return { ...registro, nombre: `${registro.nombre} · ${registro.moneda}`, deshabilitada: Boolean(monedaRequerida && registro.moneda !== monedaRequerida) }; }
    return <Box key={`${linea.medioPagoId}-${indice}`} sx={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr) minmax(100px, 30%)', alignItems: 'center', gap: 1, p: 1, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 }, '@media (max-width:359px)': { gridTemplateColumns: '40px minmax(0, 1fr)', '& > .importe-cobro': { gridColumn: '1 / -1' } } }}>
      <Box sx={{ display: 'flex', borderRadius: '50%', overflow: 'hidden', width: 44, height: 44 }}><IconoCatalogo identificador={medio?.icono ?? null} color={medio?.color ?? null} contenedor tamano={44} /></Box>
      <Box sx={{ minWidth: 0, '& .MuiInput-root': { minHeight: 28 }, '& .MuiSelect-select': { py: 0.5 } }}><Typography sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>{medio?.nombre ?? 'Medio histórico'}</Typography><SelectorCatalogo etiqueta={`Billetera real ${medio?.nombre ?? ''}`} valor={linea.billeteraId} alCambiar={cambiarBilletera} opciones={datos?.billeteras.filter(billeteraDisponible).map(opcionBilletera) ?? []} obligatorio enLinea /></Box>
      <Box className="importe-cobro" sx={{ minWidth: 0 }}><CampoImporte etiqueta={`Importe ${medio?.nombre ?? ''}`} valor={linea.importe} alCambiar={cambiarImporte} compacto alineadoDerecha etiquetaOculta /></Box>
    </Box>;
  }
  /** Añade un medio activo elegido en opciones avanzadas sin duplicar ni modificar otras filas. */
  function agregarMedioOperacion(id: string) {
    const medio = datos?.medios.find(/** Resuelve una opción activa del catálogo real. */ function identificar(medio) { return medio.id === id && medio.activo; });
    if (pendiente || !medio || lineas.some(/** Impide repetir un medio ya presente. */ function incluida(linea) { return linea.medioPagoId === id; })) return;
    establecerLineas([...lineas, { medioPagoId: id, billeteraId: medio.billeteraPredeterminadaId ?? '', importe: '', agregadaManualmente: true }]);
  }
  /** Retira una distribución del borrador, conservando importes y destinos de las restantes. */
  function quitarMedioOperacion(id: string) {
    if (!pendiente) establecerLineas(lineas.filter(/** Conserva las filas de otros medios. */ function conservar(linea) { return linea.medioPagoId !== id; }));
  }
  /** Presenta el total separado de los medios, con los errores exactos resueltos por dominio. */
  function mostrarTotalOperacion() {
    return errorImportes ? <Alert severity="error">{errorImportes}</Alert> : !moneda ? <Alert severity="info">Seleccioná una billetera para determinar la moneda de la operación.</Alert> : <Box aria-live="polite" sx={/** Adapta el resumen semántico a ambas paletas sin alterar el importe. */ function apariencia(tema) { const estado = estadosFinancieros[tema.palette.mode === 'dark' ? 'oscuro' : 'claro'][tipo]; return { p: 2, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: estado.fondo, color: estado.texto }; }}>
      <Box aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 48, height: 48, flexShrink: 0, borderRadius: '50%', bgcolor: tipo === 'ingreso' ? 'success.main' : 'error.main', color: tipo === 'ingreso' ? 'success.contrastText' : 'error.contrastText' }}>{tipo === 'ingreso' ? <TrendingUp sx={{ fontSize: 32 }} /> : <ArrowDownward sx={{ fontSize: 32 }} />}</Box>
      <Box sx={{ minWidth: 0 }}><Typography sx={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>{tipo === 'ingreso' ? 'TOTAL INGRESO' : 'TOTAL GASTO'}</Typography><Typography sx={{ fontSize: 32, fontWeight: 700, overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }}>{formatearImporte(crearImporte(total, moneda))}</Typography></Box>
    </Box>;
  }
  /** Confirma solo líneas positivas; las preferencias se escriben después del guardado efectivo. */
  async function guardar(evento: FormEvent) {
    evento.preventDefault(); if (pendiente || !alGuardar) return;
    establecerError(''); establecerConfirmacion('');
    if (errorImportes || !moneda || total === 0 || (tipo === 'ingreso' && !actividad) || (tipo === 'gasto' && (!categoria || !descripcion.trim()))) { establecerError(errorImportes || 'Completá los campos obligatorios e indicá un total mayor a cero.'); return; }
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
      <Paper variant="outlined" sx={{ p: 1.5, '& .MuiInputBase-input:not(.MuiSelect-select)': { py: 1.5 }, '& label, & [id$="-etiqueta"]': { color: 'text.secondary', fontWeight: 500 } }}><Stack spacing={1.5}>
      {/* Cada operación conserva la agrupación de campos aprobada en su referencia. */}
      {tipo === 'gasto' && <SelectorCatalogo etiqueta="Categoría" valor={categoria} alCambiar={establecerCategoria} opciones={datos.categorias.filter(categoriaDisponible)} obligatorio etiquetaExterior destacado />}
        <SelectorCatalogo etiqueta={tipo === 'ingreso' ? 'Actividad' : 'Actividad (opcional)'} valor={actividad} alCambiar={establecerActividad} opciones={datos.actividades.filter(actividadDisponible)} obligatorio={tipo === 'ingreso'} etiquetaExterior destacado />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 1.5, '@media (min-width:390px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' } }}>
          <CampoTextoCatalogo etiqueta="Fecha" valor={fecha} alCambiar={establecerFecha} tipo="date" obligatorio etiquetaExterior />
          <CampoTextoCatalogo etiqueta="Descripción" valor={descripcion} alCambiar={establecerDescripcion} obligatorio={tipo === 'gasto'} etiquetaExterior icono={<DescriptionOutlined />} ejemplo={tipo === 'ingreso' ? 'Carrera matutina' : 'Carga de nafta'} />
        </Box>
        <CampoTextoCatalogo etiqueta="Observaciones (opcional)" valor={observaciones} alCambiar={establecerObservaciones} etiquetaExterior icono={<ChatBubbleOutlined />} ejemplo={tipo === 'ingreso' ? 'Ej. Zona centro, buen día' : 'Zona centro, estación'} />
      </Stack></Paper>
      <Paper variant="outlined" sx={{ p: 1.5 }}><Stack spacing={1}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}><Typography variant="h6">{tipo === 'ingreso' ? 'Medios de cobro' : 'Medios de pago'}{moneda ? ` · ${moneda}` : ''}</Typography></Stack>
        <Typography variant="body2" color="text.secondary">Ingresá solamente los medios utilizados.</Typography>
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: `${tokensVisuales.radioTarjeta}px`, overflow: 'hidden' }}>{lineas.map(mostrarLinea)}</Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}><Info aria-hidden="true" sx={{ fontSize: 18 }} /><Typography variant="body2">Los campos vacíos cuentan como 0.</Typography></Stack>
      </Stack></Paper>
    </Stack>
    {mostrarTotalOperacion()}
    {resumenImpacto && moneda && !errorImportes && resumenImpacto(moneda, lineas.map(/** Prepara distribuciones positivas para la vista previa delegada al dominio. */ function convertir(linea) { return { medioPagoId: linea.medioPagoId, billeteraId: linea.billeteraId || null, importeCentavos: interpretarCampoRapido(linea.importe) }; }).filter(/** Excluye líneas vacías de la vista previa, igual que en el guardado. */ function positiva(linea) { return linea.importeCentavos > 0; }))}
    {!alGuardar && <Alert severity="info">La persistencia se conectará en la siguiente tarea.</Alert>}
    <Button startIcon={<Save />} fullWidth type="submit" variant="contained" color="primary" loading={pendiente} disabled={!alGuardar || Boolean(errorImportes) || total === 0}>{etiquetaGuardar ?? `Guardar ${tipo}`}</Button>
    {<Paper component="details" variant="outlined" sx={{ p: 1.5, '& > summary': { display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', listStyle: 'none', '&::-webkit-details-marker': { display: 'none' } }, '&[open] .flecha-opciones': { transform: 'rotate(180deg)' } }}>
      <Box component="summary"><Settings aria-hidden="true" sx={{ color: 'text.secondary' }} /><Typography>Opciones avanzadas</Typography><ExpandMore className="flecha-opciones" aria-hidden="true" sx={{ ml: 'auto', color: 'text.secondary' }} /></Box>
      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}><OpcionesMediosOperacion tipo={tipo} medios={datos.medios} incluidos={lineas.map(/** Identifica los medios presentes sin transportar importes al panel. */ function identidad(linea) { return linea.medioPagoId; })} manuales={lineas.filter(/** Distingue adiciones explícitas de sugerencias de carga rápida. */ function manual(linea) { return linea.agregadaManualmente; }).map(/** Entrega las identidades añadidas al panel. */ function identidad(linea) { return linea.medioPagoId; })} pendiente={pendiente} alAgregar={agregarMedioOperacion} alQuitar={quitarMedioOperacion} /></Box>
    </Paper>}
  </Stack>;
}
