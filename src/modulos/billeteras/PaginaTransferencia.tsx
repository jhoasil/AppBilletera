import { useEffect, useState, type FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { listarBilleterasActivas } from '../../app/datos/serviciosCatalogos';
import { servicioTransferencias } from '../../app/datos/servicioTransferencias';
import { CabeceraPagina } from '../../compartido/componentes/CabeceraPagina';
import { CampoTextoCatalogo } from '../../compartido/componentes/CampoTextoCatalogo';
import { CampoImporte } from '../../compartido/componentes/CampoImporte';
import { SelectorCatalogo } from '../../compartido/componentes/SelectorCatalogo';
import { fechaActual } from '../../compartido/fechas/fechaActual';
import { crearImporte } from '../../nucleo/dinero/Importe';
import { interpretarImporte } from '../../nucleo/dinero/interpretarImporte';
import { formatearImporte } from '../../compartido/dinero/formatearImporte';
import type { Billetera } from '../../nucleo/entidades/Billetera';

/** Recupera una billetera de origen sugerida desde un enlace, sin guardar dinero en preferencias. */
function leerOrigen() { return new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('origen') ?? ''; }

/** Presenta una transferencia rápida entre dos billeteras distintas de la misma moneda. */
export function PaginaTransferencia() {
  const [billeteras, establecerBilleteras] = useState<readonly Billetera[] | null>(null);
  const [origen, establecerOrigen] = useState(leerOrigen); const [destino, establecerDestino] = useState('');
  const [importe, establecerImporte] = useState(''); const [fecha, establecerFecha] = useState(fechaActual); const [descripcion, establecerDescripcion] = useState('');
  const [pendiente, establecerPendiente] = useState(false); const [error, establecerError] = useState(''); const [confirmacion, establecerConfirmacion] = useState('');
  const [revision, establecerRevision] = useState(0);
  /** Carga destinos activos y permite reintentar sin escribir movimientos. */
  function cargar() {
    let vigente = true;
    /** Publica catálogos únicamente para la pantalla montada. */
    function completar(datos: readonly Billetera[]) { if (vigente) establecerBilleteras(datos); }
    /** Presenta un fallo de lectura recuperable. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudieron cargar las billeteras.'); }
    void listarBilleterasActivas().then(completar, fallar);
    /** Ignora una respuesta de una pantalla abandonada. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, [revision]);
  /** Localiza la billetera seleccionada para definir la moneda, sin conversiones implícitas. */
  function esOrigen(billetera: Billetera) { return billetera.id === origen; }
  const seleccionada = billeteras?.find(esOrigen);
  /** Ofrece únicamente destinos distintos y en la moneda de origen. */
  function esDestino(billetera: Billetera) { return billetera.id !== origen && billetera.moneda === seleccionada?.moneda; }
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
      establecerConfirmacion('Transferencia registrada en ambas billeteras.'); establecerImporte(''); establecerDescripcion('');
    } catch (causa) { establecerError(causa instanceof Error ? causa.message : 'No se pudo registrar la transferencia.'); }
    finally { establecerPendiente(false); }
  }
  let total = ''; let errorImporte = '';
  try { if (importe.trim() && seleccionada) total = formatearImporte(crearImporte(interpretarImporte(importe), seleccionada.moneda)); }
  catch (causa) { errorImporte = causa instanceof Error ? causa.message : 'Importe inválido.'; }
  return <Stack spacing={2} sx={{ maxWidth: 640 }}>
    <CabeceraPagina titulo="Transferencia entre billeteras" acciones={<Button component="a" href="#/ajustes">Ajustes</Button>} />
    {error && <Alert severity="error" action={<Button onClick={reintentar}>Actualizar billeteras</Button>}>{error}</Alert>}{confirmacion && <Alert severity="success">{confirmacion}</Alert>}
    {!billeteras ? !error && <CircularProgress aria-label="Cargando billeteras" /> : <Stack component="form" onSubmit={guardar} spacing={2}>
      <Stack component="fieldset" disabled={pendiente} spacing={2} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        <SelectorCatalogo etiqueta="Desde" valor={origen} alCambiar={cambiarOrigen} opciones={billeteras} obligatorio />
        <SelectorCatalogo etiqueta="Hacia" valor={destino} alCambiar={establecerDestino} opciones={billeteras.filter(esDestino)} obligatorio />
        <CampoImporte etiqueta={`Monto (${seleccionada?.moneda ?? 'seleccioná el origen'})`} valor={importe} alCambiar={establecerImporte} error={errorImporte} ayuda="Importe positivo, sin separadores de miles." obligatorio />
        {total && <Typography variant="h5">{total}</Typography>}
        <CampoTextoCatalogo etiqueta="Fecha" valor={fecha} alCambiar={establecerFecha} tipo="date" obligatorio />
        <CampoTextoCatalogo etiqueta="Descripción (opcional)" valor={descripcion} alCambiar={establecerDescripcion} />
        <Alert severity="info">Una transferencia mueve dinero entre tus billeteras y no modifica tus ingresos, gastos ni ganancia. Ambas deben tener la misma moneda.</Alert>
      </Stack><Button type="submit" variant="contained" loading={pendiente} disabled={!origen || !destino || Boolean(errorImporte) || !importe.trim()}>Transferir</Button>
    </Stack>}
  </Stack>;
}
