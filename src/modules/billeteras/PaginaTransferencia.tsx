import { useEffect, useState, type FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { cargarBilleterasConSaldo } from '../../app/data/cargarBilleterasConSaldo';
import Paper from '@mui/material/Paper';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { IconoCatalogo } from '../../shared/components/IconoCatalogo';
import { tokensVisuales } from '../../app/theme/tokens';
import { servicioTransferencias } from '../../app/data/servicioTransferencias';
import { CabeceraPagina } from '../../shared/components/CabeceraPagina';
import { CampoTextoCatalogo } from '../../shared/components/CampoTextoCatalogo';
import { CampoImporte } from '../../shared/components/CampoImporte';
import { SelectorBilletera } from '../../shared/components/SelectorBilletera';
import { fechaActual } from '../../shared/dates/fechaActual';
import { crearImporte } from '../../core/money/Importe';
import { interpretarImporte } from '../../core/money/interpretarImporte';
import { formatearImporte } from '../../shared/money/formatearImporte';
import type { BilleteraConSaldo } from '../../core/repositories/RepositorioConsultaBilleteras';

/** Recupera una billetera de origen sugerida desde un enlace, sin guardar dinero en preferencias. */
function leerOrigen() { return new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('origen') ?? ''; }

/** Presenta una transferencia rápida entre dos billeteras distintas de la misma moneda. */
export function PaginaTransferencia() {
  const [billeteras, establecerBilleteras] = useState<readonly BilleteraConSaldo[] | null>(null);
  const [origen, establecerOrigen] = useState(leerOrigen); const [destino, establecerDestino] = useState('');
  const [importe, establecerImporte] = useState(''); const [fecha, establecerFecha] = useState(fechaActual); const [descripcion, establecerDescripcion] = useState('');
  const [pendiente, establecerPendiente] = useState(false); const [error, establecerError] = useState(''); const [confirmacion, establecerConfirmacion] = useState('');
  const [revision, establecerRevision] = useState(0);
  /** Carga destinos activos y permite reintentar sin escribir movimientos. */
  function cargar() {
    let vigente = true;
    /** Publica catálogos únicamente para la pantalla montada. */
    function completar(datos: readonly BilleteraConSaldo[]) { if (vigente) establecerBilleteras(datos); }
    /** Presenta un fallo de lectura recuperable. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudieron cargar las billeteras.'); }
    void cargarBilleterasConSaldo().then(completar, fallar);
    /** Ignora una respuesta de una pantalla abandonada. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, [revision]);
  /** Localiza la billetera seleccionada para definir la moneda, sin conversiones implícitas. */
  function esOrigen({ billetera }: BilleteraConSaldo) { return billetera.id === origen; }
  const seleccionada = billeteras?.find(esOrigen)?.billetera;
  const receptora = billeteras?.find(/** Resuelve metadatos del destino para la vista previa. */ function buscar(elemento) { return elemento.billetera.id === destino; })?.billetera;
  /** Ofrece únicamente destinos distintos y en la moneda de origen. */
  function esDestino({ billetera }: BilleteraConSaldo) { return billetera.id !== origen && billetera.moneda === seleccionada?.moneda; }
  /** Cambia el origen y obliga a verificar nuevamente el destino. */
  function cambiarOrigen(valor: string) { establecerOrigen(valor); establecerDestino(''); }
  /** Reintenta la lectura y limpia el error anterior. */
  function reintentar() { establecerError(''); establecerRevision(revision + 1); }
  /** Registra los dos efectos financieros y comunica el éxito solo tras confirmar la transacción. */
  async function guardar(evento: FormEvent) {
    evento.preventDefault(); if (!seleccionada || pendiente) return;
    establecerPendiente(true); establecerError(''); establecerConfirmacion('');
    try {
      await servicioTransferencias.crear({ billeteraOrigenId: origen, billeteraDestinoId: destino, importe, moneda: seleccionada.moneda, fecha, descripcion });
      establecerConfirmacion('Transferencia registrada en ambas billeteras.'); establecerImporte(''); establecerDescripcion(''); establecerRevision(revision + 1);
    } catch (causa) { establecerError(causa instanceof Error ? causa.message : 'No se pudo registrar la transferencia.'); }
    finally { establecerPendiente(false); }
  }
  let total = ''; let errorImporte = '';
  try { if (importe.trim() && seleccionada) { const centavos = interpretarImporte(importe); if (centavos <= 0) throw new Error('Indicá un importe mayor a cero.'); total = formatearImporte(crearImporte(centavos, seleccionada.moneda)); } }
  catch (causa) { errorImporte = causa instanceof Error ? causa.message : 'Importe inválido.'; }
  return <Stack spacing={2} sx={{ maxWidth: tokensVisuales.anchoFormulario, width: '100%' }}>
    <CabeceraPagina titulo="Transferencia entre billeteras" regreso={{ href: "#/billeteras", etiqueta: "Volver a billeteras" }} />
    {error && <Alert severity="error" action={<Button onClick={reintentar}>Actualizar billeteras</Button>}>{error}</Alert>}{confirmacion && <Alert severity="success">{confirmacion}</Alert>}
    {!billeteras ? !error && <CircularProgress aria-label="Cargando billeteras" /> : <Stack component="form" onSubmit={guardar} spacing={2}>
      <Stack component="fieldset" disabled={pendiente} spacing={2} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        <SelectorBilletera etiqueta="Desde" valor={origen} alCambiar={cambiarOrigen} opciones={billeteras} />
        <SelectorBilletera etiqueta="Hacia" valor={destino} alCambiar={establecerDestino} opciones={billeteras.filter(esDestino)} />
        <CampoImporte etiqueta={`Monto (${seleccionada?.moneda ?? 'seleccioná el origen'})`} valor={importe} alCambiar={establecerImporte} error={errorImporte} ayuda="Importe positivo, sin separadores de miles." obligatorio />
        <CampoTextoCatalogo etiqueta="Fecha" valor={fecha} alCambiar={establecerFecha} tipo="date" obligatorio />
        <CampoTextoCatalogo etiqueta="Descripción (opcional)" valor={descripcion} alCambiar={establecerDescripcion} />
        {total && seleccionada && receptora && <Paper variant="outlined" aria-live="polite" sx={{ minHeight: 128, p: 2, bgcolor: 'action.hover' }}><Stack spacing={1} sx={{ alignItems: 'center' }}><IconoCatalogo identificador={seleccionada.icono} /><Typography>{seleccionada.nombre}</Typography><Typography sx={{ fontSize: 24, fontWeight: 700 }} color="info.main">Salida: -{total}</Typography><ArrowDownward aria-hidden="true" /><IconoCatalogo identificador={receptora.icono} /><Typography>{receptora.nombre}</Typography><Typography sx={{ fontSize: 24, fontWeight: 700 }} color="info.main">Entrada: +{total}</Typography></Stack></Paper>}
        <Alert severity="info">Una transferencia mueve dinero entre tus billeteras y no modifica tus ingresos, gastos ni ganancia. Ambas deben tener la misma moneda.</Alert>
      </Stack><Button fullWidth type="submit" variant="contained" loading={pendiente} disabled={!origen || !destino || Boolean(errorImporte) || !importe.trim()}>Transferir</Button>
    </Stack>}
  </Stack>;
}
