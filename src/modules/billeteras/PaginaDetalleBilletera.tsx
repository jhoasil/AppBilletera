import { useEffect, useState } from 'react';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import Tune from '@mui/icons-material/Tune';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { servicioDetalleBilletera } from '../../app/datos/servicioDetalleBilletera';
import { useParametroRuta } from '../../app/navegacion/useParametroRuta';
import { CabeceraPagina } from '../../shared/componentes/CabeceraPagina';
import { CampoTextoCatalogo } from '../../shared/componentes/CampoTextoCatalogo';
import { IconoCatalogo } from '../../shared/componentes/IconoCatalogo';
import { ListaMovimiento, type ElementoListaMovimiento } from '../../shared/componentes/ListaMovimiento';
import { TarjetaResumen } from '../../shared/componentes/TarjetaResumen';
import { formatearImporte } from '../../shared/dinero/formatearImporte';
import { crearImporte } from '../../core/money/Importe';
import type { MovimientoBilletera, TipoMovimientoBilletera } from '../../core/entities/MovimientoBilletera';
import type { DetalleBilletera } from '../../core/repositories/RepositorioDetalleBilletera';

const titulosMovimiento: Record<TipoMovimientoBilletera, string> = {
  SALDO_INICIAL: 'Saldo inicial', INGRESO: 'Ingreso', GASTO: 'Gasto', TRANSFERENCIA_ENTRADA: 'Transferencia recibida', TRANSFERENCIA_SALIDA: 'Transferencia enviada', AJUSTE_POSITIVO: 'Ajuste positivo', AJUSTE_NEGATIVO: 'Ajuste negativo',
};

/** Consulta el saldo actual y últimos movimientos de una billetera, con filtros inclusivos y paginación. */
export function PaginaDetalleBilletera() {
  const id = useParametroRuta('id');
  const [datos, establecerDatos] = useState<DetalleBilletera | null>(null);
  const [pagina, establecerPagina] = useState(0); const [revision, establecerRevision] = useState(0);
  const [desde, establecerDesde] = useState(''); const [hasta, establecerHasta] = useState('');
  const [filtros, establecerFiltros] = useState({ desde: '', hasta: '' });
  const [cargando, establecerCargando] = useState(true); const [error, establecerError] = useState('');
  /** Reinicia filtros al navegar a otra billetera dentro de la misma pantalla. */
  function reiniciar() { establecerPagina(0); establecerDesde(''); establecerHasta(''); establecerFiltros({ desde: '', hasta: '' }); establecerDatos(null); }
  useEffect(reiniciar, [id]);
  /** Recupera una instantánea e ignora respuestas de identidades o filtros anteriores. */
  function cargar() {
    let vigente = true; establecerCargando(true); establecerError('');
    /** Publica una respuesta únicamente si corresponde a la consulta vigente. */
    function completar(resultado: DetalleBilletera) { if (vigente) { establecerDatos(resultado); establecerCargando(false); } }
    /** Comunica un error real en vez de asumir un saldo de cero. */
    function fallar(causa: unknown) { if (vigente) { establecerError(causa instanceof Error ? causa.message : 'No se pudo consultar la billetera.'); establecerCargando(false); } }
    Promise.resolve().then(consultar).then(completar, fallar);
    /** Encapsula posibles errores síncronos de validación dentro de la promesa de lectura. */
    function consultar() { return servicioDetalleBilletera.consultar(id, pagina, filtros.desde, filtros.hasta); }
    /** Impide actualizar una pantalla abandonada. */
    function cancelar() { vigente = false; }
    return cancelar;
  }
  useEffect(cargar, [id, pagina, filtros, revision]);
  /** Actualiza saldo y movimientos en una misma instantánea. */
  function actualizar() { establecerRevision(revision + 1); }
  /** Valida el período y consulta desde la primera página. */
  function aplicar() {
    if (desde && hasta && desde > hasta) { establecerError('El inicio del período no puede superar su fin.'); return; }
    establecerPagina(0); establecerFiltros({ desde, hasta });
  }
  /** Restablece la consulta de últimos movimientos sin restricciones de período. */
  function limpiar() { establecerDesde(''); establecerHasta(''); establecerPagina(0); establecerFiltros({ desde: '', hasta: '' }); }
  /** Retrocede una página de movimientos. */
  function anterior() { establecerPagina(Math.max(0, pagina - 1)); }
  /** Avanza una página de movimientos. */
  function siguiente() { establecerPagina(pagina + 1); }
  /** Clasifica visualmente entradas, salidas, transferencias y ajustes sin confundir resultado y patrimonio. */
  function presentar(movimiento: MovimientoBilletera): ElementoListaMovimiento {
    const transferencia = movimiento.tipo === 'TRANSFERENCIA_ENTRADA' || movimiento.tipo === 'TRANSFERENCIA_SALIDA';
    const ajuste = movimiento.tipo === 'AJUSTE_POSITIVO' || movimiento.tipo === 'AJUSTE_NEGATIVO' || movimiento.tipo === 'SALDO_INICIAL';
    const tono = transferencia ? 'interno' : ajuste ? 'ajuste' : movimiento.importeCentavos >= 0 ? 'entrada' : 'salida';
    const icono = transferencia ? <SwapHoriz /> : ajuste ? <Tune /> : movimiento.importeCentavos >= 0 ? <ArrowUpward /> : <ArrowDownward />;
    const fecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(movimiento.fecha));
    return { id: movimiento.id, titulo: titulosMovimiento[movimiento.tipo], detalle: `${fecha}${movimiento.descripcion ? ` · ${movimiento.descripcion}` : ''}`, importe: `${movimiento.importeCentavos > 0 ? '+' : ''}${formatearImporte(crearImporte(movimiento.importeCentavos, datos!.billetera.moneda))}`, icono, tono };
  }
  return <Stack spacing={2}>
    <CabeceraPagina titulo={datos?.billetera.nombre ?? 'Detalle de billetera'} acciones={<Button component="a" href="#/billeteras">Volver a billeteras</Button>} />
    {error && <Alert severity="error" action={<Button onClick={actualizar}>Reintentar</Button>}>{error}</Alert>}
    {cargando ? <CircularProgress aria-label="Cargando saldo y movimientos" /> : !error && datos && <>
      <TarjetaResumen titulo="Saldo actual" valor={formatearImporte(crearImporte(datos.saldoCentavos, datos.billetera.moneda))} icono={<IconoCatalogo identificador={datos.billetera.icono} />} tono={datos.saldoCentavos < 0 ? 'negativo' : 'positivo'} detalle={datos.billetera.activo ? 'Billetera activa' : 'Billetera inactiva; se conserva su historial'} />
      <Stack direction="row" spacing={1}><Button component="a" href={`#/transferencias?origen=${id}`} variant="contained" disabled={!datos.billetera.activo}>Transferir</Button><Button disabled aria-describedby="estado-conciliacion">Conciliar</Button><Button onClick={actualizar}>Actualizar</Button></Stack>
      <Typography id="estado-conciliacion" variant="body2" color="text.secondary">La conciliación estará disponible próximamente.</Typography>
      <Typography variant="h6">Últimos movimientos</Typography>
      <Typography variant="body2" color="text.secondary">El período filtra los movimientos; el saldo mostrado sigue siendo el actual.</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><CampoTextoCatalogo etiqueta="Desde" valor={desde} alCambiar={establecerDesde} tipo="date" /><CampoTextoCatalogo etiqueta="Hasta" valor={hasta} alCambiar={establecerHasta} tipo="date" /><Button onClick={aplicar}>Aplicar</Button><Button onClick={limpiar}>Limpiar</Button></Stack>
      <Paper variant="outlined"><ListaMovimiento elementos={datos.movimientos.elementos.map(presentar)} etiqueta={`Movimientos de ${datos.billetera.nombre}`} /></Paper>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><Button onClick={anterior} disabled={pagina === 0}>Anterior</Button><Typography>Página {pagina + 1} · {datos.movimientos.total}</Typography><Button onClick={siguiente} disabled={(pagina + 1) * 20 >= datos.movimientos.total}>Siguiente</Button></Stack>
    </>}
  </Stack>;
}
