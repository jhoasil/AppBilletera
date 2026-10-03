import { useEffect, useState, type FormEvent } from 'react';
import Calculate from '@mui/icons-material/Calculate';
import Edit from '@mui/icons-material/Edit';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import Tune from '@mui/icons-material/Tune';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { IconoCatalogo } from '../../shared/components/IconoCatalogo';
import { estadosFinancieros, tokensVisuales } from '../../app/theme/tokens';
import { useParametroRuta } from '../../app/navigation/useParametroRuta';
import { servicioDetalleBilletera } from '../../app/data/servicioDetalleBilletera';
import { servicioConciliacion } from '../../app/data/servicioConciliacion';
import { calcularConciliacion, type ConfirmacionConciliacion } from '../../core/services/calcularConciliacion';
import type { DetalleBilletera } from '../../core/repositories/RepositorioDetalleBilletera';
import { crearImporte } from '../../core/money/Importe';
import { formatearImporte } from '../../shared/money/formatearImporte';
import { CabeceraPagina } from '../../shared/components/CabeceraPagina';
import { CampoImporte } from '../../shared/components/CampoImporte';
import { CampoTextoCatalogo } from '../../shared/components/CampoTextoCatalogo';

/** Conecta la confirmación sin exponer persistencia a la pantalla. */
interface PropiedadesConciliacion { alConfirmar?: (datos: ConfirmacionConciliacion) => Promise<void> }

/** Muestra saldo calculado, real y diferencia, ofreciendo registrar faltantes o ajustar explícitamente. */
export function PaginaConciliacion({ alConfirmar = confirmarConciliacion }: PropiedadesConciliacion) {
  const id = useParametroRuta('id');
  const realInicial = useParametroRuta('real');
  const [datos, establecerDatos] = useState<DetalleBilletera | null>(null);
  const [real, establecerReal] = useState(realInicial); const [motivo, establecerMotivo] = useState(''); const [observaciones, establecerObservaciones] = useState('');
  const [error, establecerError] = useState(''); const [pendiente, establecerPendiente] = useState(false); const [revision, establecerRevision] = useState(0);
  /** Carga una instantánea y descarta lecturas de otra billetera. */
  function cargar() {
    let vigente = true; establecerDatos(null); establecerError('');
    /** Publica el saldo calculado recibido desde persistencia. */
    function completar(resultado: DetalleBilletera) { if (vigente) establecerDatos(resultado); }
    /** Presenta errores de lectura sin asumir un saldo cero. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudo consultar el saldo.'); }
    void servicioDetalleBilletera.consultar(id).then(completar, fallar);
    /** Impide actualizar una pantalla desmontada. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, [id, revision]);
  /** Restaura el saldo declarado al volver de una operación real y al cambiar de billetera. */
  function restaurarSaldoReal() { establecerReal(realInicial); }
  useEffect(restaurarSaldoReal, [id, realInicial]);
  let comparacion: ReturnType<typeof calcularConciliacion> | undefined; let errorReal = '';
  try { if (datos && real.trim()) comparacion = calcularConciliacion(datos.saldoCentavos, real, datos.billetera.moneda); }
  catch (causa) { errorReal = causa instanceof Error ? causa.message : 'Saldo real inválido.'; }
  /** Actualiza el saldo observado antes de volver a confirmar. */
  function actualizar() { establecerRevision(revision + 1); }
  /** Confirma una decisión expresa; nunca convierte automáticamente la diferencia en ingreso o gasto. */
  async function confirmar(evento: FormEvent) {
    evento.preventDefault(); if (!datos || !comparacion || !alConfirmar || pendiente) return;
    establecerPendiente(true); establecerError('');
    try { await alConfirmar({ billeteraId: id, saldoEsperadoCentavos: datos.saldoCentavos, saldoRealCentavos: comparacion.saldoRealCentavos, motivo, observaciones }); window.location.hash = `#/billetera?id=${id}`; }
    catch (causa) { establecerError(causa instanceof Error ? causa.message : 'No se pudo confirmar la conciliación.'); }
    finally { establecerPendiente(false); }
  }
  return <Stack spacing={2} sx={{ maxWidth: tokensVisuales.anchoFormulario, width: '100%' }}>
    <CabeceraPagina titulo={`Conciliar ${datos?.billetera.nombre ?? 'billetera'}`} regreso={{ href: `#/billetera?id=${id}`, etiqueta: "Volver a billetera", deshabilitado: pendiente }} />
    {error && <Alert severity="error" action={<Button onClick={actualizar} disabled={pendiente}>Actualizar saldo</Button>}>{error}</Alert>}
    {!datos ? !error && <CircularProgress aria-label="Consultando saldo" /> : <Stack component="form" onSubmit={confirmar} spacing={2}>
      <Paper variant="outlined" sx={{ minHeight: 96, p: 2 }}><Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}><IconoCatalogo identificador={datos.billetera.icono} color={datos.billetera.color} contenedor /><Typography variant="h6">{datos.billetera.nombre} · {datos.billetera.moneda}</Typography></Stack><Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: 'center' }}><Calculate color="primary" /><Typography variant="body2" color="text.secondary">Saldo calculado · solo lectura</Typography></Stack><Typography sx={{ fontSize: 32, fontWeight: 700, overflowWrap: 'anywhere' }}>{formatearImporte(crearImporte(datos.saldoCentavos, datos.billetera.moneda))}</Typography></Paper>
      <Stack component="fieldset" disabled={pendiente} spacing={2} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        {/* La comparación mantiene un solo campo editable: el dinero contado fuera de la app. */}
        <Paper variant="outlined" sx={{ p: 2 }}><Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}><Edit color="primary" /><Typography>Saldo contado</Typography></Stack><CampoImporte etiqueta="Saldo real" valor={real} alCambiar={establecerReal} error={errorReal} obligatorio ayuda="Importe con hasta dos decimales, sin separadores de miles." /></Paper>
        {comparacion && <Paper aria-live="polite" sx={/** Destaca signo e importe con superficies financieras de ambos temas. */ function apariencia(tema) { const colores = estadosFinancieros[tema.palette.mode === 'dark' ? 'oscuro' : 'claro']; const estado = comparacion.diferenciaCentavos < 0 ? colores.gasto : colores.ingreso; return { minHeight: 96, p: 2, bgcolor: comparacion.diferenciaCentavos === 0 ? 'action.hover' : estado.fondo, color: comparacion.diferenciaCentavos === 0 ? 'text.primary' : estado.texto }; }}><Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>{comparacion.diferenciaCentavos === 0 ? <CheckCircleOutline /> : <ErrorOutline />}<Typography>Diferencia · saldo real menos saldo calculado</Typography></Stack><Typography sx={{ fontSize: 32, fontWeight: 700, overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }}>{comparacion.diferenciaCentavos > 0 ? '+' : ''}{formatearImporte(crearImporte(comparacion.diferenciaCentavos, datos.billetera.moneda))}</Typography></Paper>}
        {comparacion && comparacion.diferenciaCentavos !== 0 && <CampoTextoCatalogo etiqueta="Motivo" valor={motivo} alCambiar={establecerMotivo} obligatorio />}
        <CampoTextoCatalogo etiqueta="Observaciones (opcional)" valor={observaciones} alCambiar={establecerObservaciones} />
        {comparacion?.diferenciaCentavos === 0 && <Alert severity="success">Los saldos coinciden. No se generará un ajuste.</Alert>}
        {comparacion && comparacion.diferenciaCentavos !== 0 && <>
          <Alert severity="info">Si falta una operación real, registrala primero y luego actualizá el saldo. Un ajuste documenta la diferencia y se mantiene separado de ingresos y gastos.</Alert>
        </>}
      </Stack>
      {!alConfirmar && <Alert severity="info">La confirmación del ajuste se conectará en el siguiente paso de implementación.</Alert>}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', '@media (min-width:360px)': { gridTemplateColumns: comparacion?.diferenciaCentavos ? '1fr 1fr' : '1fr' }, gap: 1.5 }}>
        {comparacion && comparacion.diferenciaCentavos !== 0 && <Button component="a" href={`#/movimiento-faltante?id=${encodeURIComponent(id)}&real=${encodeURIComponent(real)}`} variant="outlined" disabled={pendiente || !datos.billetera.activo} sx={{ minHeight: 112 }}><Stack spacing={1} sx={{ alignItems: 'flex-start', textAlign: 'left' }}><AddCircleOutline /><span>Registrar movimiento faltante</span><Typography variant="body2">{comparacion.diferenciaCentavos < 0 ? 'Gasto' : 'Ingreso'} real omitido</Typography></Stack></Button>}
        <Button fullWidth type="submit" variant="outlined" loading={pendiente} sx={{ minHeight: comparacion?.diferenciaCentavos ? 112 : 48 }} disabled={!alConfirmar || !comparacion || !datos.billetera.activo}><Stack spacing={1} sx={{ alignItems: 'flex-start', textAlign: 'left' }}>{comparacion?.diferenciaCentavos === 0 ? <CheckCircleOutline /> : <Tune color="secondary" />}<span>{comparacion?.diferenciaCentavos === 0 ? 'Confirmar coincidencia' : 'Ajustar diferencia'}</span>{comparacion?.diferenciaCentavos !== 0 && <Typography variant="body2">Documentar la diferencia sin afectar resultados</Typography>}</Stack></Button>
      </Box>
    </Stack>}
  </Stack>;
}

/** Conecta la pantalla con el servicio de conciliación transaccional. */
function confirmarConciliacion(datos: ConfirmacionConciliacion) { return servicioConciliacion.confirmar(datos); }
