import { useEffect, useState, type FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { cargarDatosIngreso } from '../../app/datos/datosCargaRapida';
import { preferenciasUI } from '../../app/preferencias/ServicioPreferenciasUI';
import { CampoTextoCatalogo } from '../../shared/componentes/CampoTextoCatalogo';
import { CampoImporte } from '../../shared/componentes/CampoImporte';
import { SelectorCatalogo } from '../../shared/componentes/SelectorCatalogo';
import { IconoCatalogo } from '../../shared/componentes/IconoCatalogo';
import { fechaActual } from '../../shared/fechas/fechaActual';
import { formatearImporte } from '../../shared/dinero/formatearImporte';
import { crearImporte } from '../../core/money/Importe';
import { calcularCargaRapida, interpretarCampoRapido } from '../../core/money/calcularCargaRapida';
import type { CargaIngreso, LineaCobro } from '../../core/services/CargaIngreso';
import type { MedioPago } from '../../core/entities/MedioPago';

/** Edición textual de una distribución; su dinero se convierte únicamente mediante dominio. */
interface LineaFormulario { medioPagoId: string; billeteraId: string; importe: string }
/** Formulario conectado mediante una acción de aplicación, sin acceso a IndexedDB. */
export interface PropiedadesFormularioOperacion { tipo: 'ingreso' | 'gasto'; alGuardar?: (carga: CargaOperacion) => Promise<void>; inicial?: CargaIngreso & { categoriaId?: string }; alCompletar?: () => void }
/** Datos comunes de pantalla; la actividad vacía se convierte en null para un gasto. */
export interface CargaOperacion extends CargaIngreso { categoriaId: string }

/** Precarga la actividad y muestra los cobros rápidos con suma exacta y ceros sin persistir. */
export function FormularioOperacionRapida({ tipo, alGuardar, inicial, alCompletar }: PropiedadesFormularioOperacion) {
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
    return <Card key={`${linea.medioPagoId}-${indice}`} variant="outlined"><CardContent><Stack spacing={1}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><IconoCatalogo identificador={medio?.icono ?? null} /><Typography variant="subtitle1">{medio?.nombre ?? 'Medio histórico'}</Typography><Button onClick={quitar} sx={{ ml: 'auto' }}>Quitar</Button></Stack>
      <CampoImporte etiqueta={`Importe ${medio?.nombre ?? ''}`} valor={linea.importe} alCambiar={cambiarImporte} ayuda="Vacío equivale a 0. Usá coma o punto decimal, sin miles." />
      <SelectorCatalogo etiqueta="Billetera" valor={linea.billeteraId} alCambiar={cambiarBilletera} opciones={datos?.billeteras.filter(billeteraDisponible) ?? []} ayuda="Sin billetera: la operación no modifica un saldo." />
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
  if (!datos) return errorCarga ? <Alert severity="error" action={<Button onClick={reintentar}>Reintentar</Button>}>{errorCarga}</Alert> : <CircularProgress aria-label="Cargando medios de cobro" />;
  return <Stack component="form" onSubmit={guardar} spacing={2} sx={{ maxWidth: 640 }}>
    {errorCarga && <Alert severity="error">{errorCarga}</Alert>}{error && <Alert severity="error">{error}</Alert>}{confirmacion && <Alert severity="success">{confirmacion}</Alert>}
    <Stack component="fieldset" disabled={pendiente} spacing={2} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
      {tipo === 'gasto' && <SelectorCatalogo etiqueta="Categoría" valor={categoria} alCambiar={establecerCategoria} opciones={datos.categorias.filter(categoriaDisponible)} obligatorio />}
      <SelectorCatalogo etiqueta={tipo === 'ingreso' ? 'Actividad' : 'Actividad (opcional)'} valor={actividad} alCambiar={establecerActividad} opciones={datos.actividades.filter(actividadDisponible)} obligatorio={tipo === 'ingreso'} />
      <CampoTextoCatalogo etiqueta="Fecha" valor={fecha} alCambiar={establecerFecha} tipo="date" obligatorio />
      <CampoTextoCatalogo etiqueta="Moneda" valor={moneda} alCambiar={establecerMoneda} obligatorio />
      <Typography variant="h6">{tipo === 'ingreso' ? 'Medios de cobro' : 'Medios de pago'}</Typography>{lineas.map(mostrarLinea)}
      <Stack direction="row" sx={{ flexWrap: 'wrap' }}>{datos.medios.map(mostrarMedio)}</Stack>
      {errorImportes ? <Alert severity="error">{errorImportes}</Alert> : <Typography variant="h5" color={tipo === 'ingreso' ? 'success.main' : 'error.main'} aria-live="polite">Total {formatearImporte(crearImporte(total, moneda))}</Typography>}
      <CampoTextoCatalogo etiqueta={tipo === 'ingreso' ? 'Descripción (opcional)' : 'Descripción'} valor={descripcion} alCambiar={establecerDescripcion} obligatorio={tipo === 'gasto'} />
      <CampoTextoCatalogo etiqueta="Observaciones (opcional)" valor={observaciones} alCambiar={establecerObservaciones} />
    </Stack>
    {!alGuardar && <Alert severity="info">La persistencia se conectará en la siguiente tarea.</Alert>}
    <Button type="submit" variant="contained" color={tipo === 'ingreso' ? 'success' : 'error'} loading={pendiente} disabled={!alGuardar || Boolean(errorImportes) || total === 0}>Guardar {tipo}</Button>
  </Stack>;
}
