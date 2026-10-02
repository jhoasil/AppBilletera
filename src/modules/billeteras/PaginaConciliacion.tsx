import { useEffect, useState, type FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useParametroRuta } from '../../app/navigation/useParametroRuta';
import { servicioDetalleBilletera } from '../../app/data/servicioDetalleBilletera';
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
export function PaginaConciliacion({ alConfirmar }: PropiedadesConciliacion) {
  const id = useParametroRuta('id');
  const [datos, establecerDatos] = useState<DetalleBilletera | null>(null);
  const [real, establecerReal] = useState(''); const [motivo, establecerMotivo] = useState(''); const [observaciones, establecerObservaciones] = useState('');
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
  return <Stack spacing={2} sx={{ maxWidth: 640 }}>
    <CabeceraPagina titulo={`Conciliar ${datos?.billetera.nombre ?? 'billetera'}`} acciones={<Button component="a" href={`#/billetera?id=${id}`} disabled={pendiente}>Volver</Button>} />
    {error && <Alert severity="error" action={<Button onClick={actualizar} disabled={pendiente}>Actualizar saldo</Button>}>{error}</Alert>}
    {!datos ? !error && <CircularProgress aria-label="Consultando saldo" /> : <Stack component="form" onSubmit={confirmar} spacing={2}>
      <Typography variant="h5">Saldo calculado: {formatearImporte(crearImporte(datos.saldoCentavos, datos.billetera.moneda))}</Typography>
      <Stack component="fieldset" disabled={pendiente} spacing={2} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        <CampoImporte etiqueta="Saldo real" valor={real} alCambiar={establecerReal} error={errorReal} obligatorio ayuda="Importe con hasta dos decimales, sin separadores de miles." />
        {comparacion && <Typography variant="h5" color={comparacion.diferenciaCentavos < 0 ? 'error.main' : 'success.main'}>Diferencia: {formatearImporte(crearImporte(comparacion.diferenciaCentavos, datos.billetera.moneda))}</Typography>}
        <CampoTextoCatalogo etiqueta="Motivo" valor={motivo} alCambiar={establecerMotivo} obligatorio={Boolean(comparacion?.diferenciaCentavos)} />
        <CampoTextoCatalogo etiqueta="Observación (opcional)" valor={observaciones} alCambiar={establecerObservaciones} />
        {comparacion?.diferenciaCentavos === 0 && <Alert severity="success">Los saldos coinciden. No se generará un ajuste.</Alert>}
        {comparacion && comparacion.diferenciaCentavos !== 0 && <>
          <Alert severity="info">Si falta una operación real, registrala primero y luego actualizá el saldo. Un ajuste documenta la diferencia y se mantiene separado de ingresos y gastos.</Alert>
          <Button component="a" href={`#/${comparacion.diferenciaCentavos < 0 ? 'gastos' : 'ingresos'}?nuevo=1`}>Registrar {comparacion.diferenciaCentavos < 0 ? 'gasto' : 'ingreso'} faltante</Button>
        </>}
      </Stack>
      {!alConfirmar && <Alert severity="info">La confirmación del ajuste se conectará en el siguiente paso de implementación.</Alert>}
      <Button type="submit" variant="contained" loading={pendiente} disabled={!alConfirmar || !comparacion || !datos.billetera.activo}>{comparacion?.diferenciaCentavos === 0 ? 'Confirmar coincidencia' : 'Ajustar diferencia'}</Button>
    </Stack>}
  </Stack>;
}
