import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import ChevronRight from '@mui/icons-material/ChevronRight';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { servicioConsultaBilleteras } from '../../app/data/servicioConsultaBilleteras';
import { CabeceraPagina } from '../../shared/components/CabeceraPagina';
import { EstadoVacio } from '../../shared/components/EstadoVacio';
import { TarjetaResumen } from '../../shared/components/TarjetaResumen';
import { IconoCatalogo } from '../../shared/components/IconoCatalogo';
import { formatearImporte } from '../../shared/money/formatearImporte';
import { crearImporte } from '../../core/money/Importe';
import type { BilleteraConSaldo, ConsultaBilleterasConSaldo } from '../../core/repositories/RepositorioConsultaBilleteras';

/** Presenta patrimonio por moneda y billeteras paginadas con saldos calculados desde persistencia. */
export function PaginaBilleteras() {
  const [pagina, establecerPagina] = useState(0); const [revision, establecerRevision] = useState(0);
  const [datos, establecerDatos] = useState<ConsultaBilleterasConSaldo | null>(null); const [cargando, establecerCargando] = useState(true); const [error, establecerError] = useState('');
  /** Solicita una instantánea nueva y descarta respuestas de páginas anteriores. */
  function cargar() {
    let vigente = true; establecerCargando(true); establecerError('');
    /** Entrega solamente la página vigente. */
    function completar(resultado: ConsultaBilleterasConSaldo) { if (vigente) { establecerDatos(resultado); establecerCargando(false); } }
    /** Comunica errores financieros sin presentar saldos inventados. */
    function fallar(causa: unknown) { if (vigente) { establecerError(causa instanceof Error ? causa.message : 'No se pudieron consultar los saldos.'); establecerCargando(false); } }
    void servicioConsultaBilleteras.listar(pagina).then(completar, fallar);
    /** Cancela la actualización visual al salir o cambiar de página. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, [pagina, revision]);
  /** Actualiza la instantánea de patrimonio sin mutar movimientos. */
  function actualizar() { establecerRevision(revision + 1); }
  /** Retrocede en el catálogo. */
  function anterior() { establecerPagina(Math.max(0, pagina - 1)); }
  /** Avanza en el catálogo. */
  function siguiente() { establecerPagina(pagina + 1); }
  /** Muestra cada moneda por separado evitando sumas de unidades incompatibles. */
  function mostrarTotal(total: { moneda: string; centavos: number }) { return <TarjetaResumen key={total.moneda} titulo={`Mi dinero · ${total.moneda}`} principal suave alturaMinima={128} valor={formatearImporte(crearImporte(total.centavos, total.moneda))} tono="destacado" detalle="Incluye billeteras activas e inactivas; las transferencias internas conservan este total." />; }
  // La transferencia global y el detalle evitan repetir un botón debajo de cada saldo.
  /** Presenta la ubicación del dinero, su disponibilidad y una acción de transferencia. */
  function mostrar({ billetera, saldoCentavos }: BilleteraConSaldo) {
    return <Card key={billetera.id}><CardActionArea component="a" href={`#/billetera?id=${billetera.id}`} aria-label={`Ver detalle de ${billetera.nombre}`}><CardContent sx={{ p: 1.5 }}><Stack direction="row" spacing={2} sx={{ minHeight: 80, alignItems: 'center' }}>
      <IconoCatalogo identificador={billetera.icono} color={billetera.color} contenedor tamano={48} />
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}><Typography variant="h6" sx={{ overflowWrap: 'anywhere' }}>{billetera.nombre}</Typography><Typography sx={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }} color={saldoCentavos < 0 ? 'error.main' : 'success.main'}>{formatearImporte(crearImporte(saldoCentavos, billetera.moneda))}</Typography>
        <Typography variant="body2" color="text.secondary">{billetera.moneda} · {billetera.tipo} · {billetera.activo ? 'Activa' : 'Inactiva'}</Typography><Typography variant="caption" color="text.secondary">Última conciliación: {billetera.conciliadoEn ? new Date(billetera.conciliadoEn).toLocaleString('es-AR') : 'Sin conciliaciones'}</Typography>
      </Stack><ChevronRight color="action" />
    </Stack></CardContent></CardActionArea></Card>;

  }
  return <Stack spacing={2}>
    <CabeceraPagina titulo="Billeteras" acciones={<Stack direction="row" spacing={1}><Button startIcon={<SwapHoriz />} variant="contained" component="a" href="#/transferencias">Transferir</Button><Button component="a" href="#/ajustes">Administrar</Button></Stack>} />
    <Button onClick={actualizar} disabled={cargando}>Actualizar saldos</Button>
    {error && <Alert severity="error">{error}</Alert>}
    {cargando ? <CircularProgress aria-label="Consultando saldos" /> : !error && datos && <>
      <Stack spacing={1}>{datos.totales.map(mostrarTotal)}</Stack>
      {datos.elementos.length ? datos.elementos.map(mostrar) : <EstadoVacio titulo="Sin billeteras" descripcion="Creá una billetera desde Ajustes." />}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><Button onClick={anterior} disabled={pagina === 0}>Anterior</Button><Typography>Página {pagina + 1} · {datos.total}</Typography><Button onClick={siguiente} disabled={(pagina + 1) * 20 >= datos.total}>Siguiente</Button></Stack>
    </>}
  </Stack>;
}
