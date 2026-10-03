import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { periodoReporte } from '../../core/services/periodoReporte';
import { presentacionMovimiento } from '../../shared/components/presentacionMovimiento';
import { servicioDetalleBilletera } from '../../app/data/servicioDetalleBilletera';
import { useParametroRuta } from '../../app/navigation/useParametroRuta';
import { CabeceraPagina } from '../../shared/components/CabeceraPagina';
import { CampoTextoCatalogo } from '../../shared/components/CampoTextoCatalogo';
import { IconoCatalogo } from '../../shared/components/IconoCatalogo';
import { ListaMovimiento, type ElementoListaMovimiento } from '../../shared/components/ListaMovimiento';
import { TarjetaResumen } from '../../shared/components/TarjetaResumen';
import { formatearImporte } from '../../shared/money/formatearImporte';
import { crearImporte } from '../../core/money/Importe';
import type { MovimientoBilletera } from '../../core/entities/MovimientoBilletera';
import type { DetalleBilletera } from '../../core/repositories/RepositorioDetalleBilletera';

/** Consulta el saldo actual y últimos movimientos de una billetera, con filtros inclusivos y paginación. */
export function PaginaDetalleBilletera() {
  const id = useParametroRuta('id');
  const [datos, establecerDatos] = useState<DetalleBilletera | null>(null);
  const [periodoRapido, establecerPeriodoRapido] = useState('Todos');
  const [pagina, establecerPagina] = useState(0); const [revision, establecerRevision] = useState(0);
  const [desde, establecerDesde] = useState(''); const [hasta, establecerHasta] = useState('');
  const [filtros, establecerFiltros] = useState({ desde: '', hasta: '' });
  const [cargando, establecerCargando] = useState(true); const [error, establecerError] = useState('');
  /** Reinicia filtros al navegar a otra billetera dentro de la misma pantalla. */
  function reiniciar() { establecerPeriodoRapido('Todos'); establecerPagina(0); establecerDesde(''); establecerHasta(''); establecerFiltros({ desde: '', hasta: '' }); establecerDatos(null); }
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
    establecerPeriodoRapido(''); establecerPagina(0); establecerFiltros({ desde, hasta });
  }
  /** Restablece la consulta de últimos movimientos sin restricciones de período. */
  function limpiar() { establecerPeriodoRapido('Todos'); establecerDesde(''); establecerHasta(''); establecerPagina(0); establecerFiltros({ desde: '', hasta: '' }); }
  /** Selecciona rangos de calendario mediante la misma política de períodos del dominio. */
  function seleccionarPeriodo(_evento: unknown, valor: string | null) {
    if (!valor) return; if (valor === 'Todos') { limpiar(); return; }
    const periodo = periodoReporte(valor as 'Hoy' | 'Semana' | 'Mes', '', '');
    establecerPeriodoRapido(valor); establecerDesde(periodo.desde); establecerHasta(periodo.hasta); establecerPagina(0); establecerFiltros(periodo);
  }
  /** Retrocede una página de movimientos. */
  function anterior() { establecerPagina(Math.max(0, pagina - 1)); }
  /** Avanza una página de movimientos. */
  function siguiente() { establecerPagina(pagina + 1); }
  /** Clasifica visualmente entradas, salidas, transferencias y ajustes sin confundir resultado y patrimonio. */
  function presentar(movimiento: MovimientoBilletera): ElementoListaMovimiento {
    const transferencia = movimiento.tipo === 'TRANSFERENCIA_ENTRADA' || movimiento.tipo === 'TRANSFERENCIA_SALIDA';
    const ajuste = movimiento.tipo === 'AJUSTE_POSITIVO' || movimiento.tipo === 'AJUSTE_NEGATIVO' || movimiento.tipo === 'SALDO_INICIAL';
    const tono = transferencia ? 'interno' : ajuste ? 'ajuste' : movimiento.importeCentavos >= 0 ? 'entrada' : 'salida';
    const visual = presentacionMovimiento(movimiento.tipo); const icono = visual.icono;
    const fecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(movimiento.fecha));
    return { id: movimiento.id, titulo: visual.nombre, detalle: `${fecha}${movimiento.descripcion ? ` · ${movimiento.descripcion}` : ''}`, importe: `${movimiento.importeCentavos > 0 ? '+' : ''}${formatearImporte(crearImporte(movimiento.importeCentavos, datos!.billetera.moneda))}`, icono, tono };
  }
  return <Stack spacing={2}>
    <CabeceraPagina titulo={datos?.billetera.nombre ?? 'Detalle de billetera'} regreso={{ href: "#/billeteras", etiqueta: "Volver a billeteras" }} />
    {error && <Alert severity="error" action={<Button onClick={actualizar}>Reintentar</Button>}>{error}</Alert>}
    {cargando ? <CircularProgress aria-label="Cargando saldo y movimientos" /> : !error && datos && <>
      <TarjetaResumen titulo={`${datos.billetera.nombre} · Saldo actual`} principal alturaMinima={152} valor={formatearImporte(crearImporte(datos.saldoCentavos, datos.billetera.moneda))} icono={<IconoCatalogo identificador={datos.billetera.icono} />} tono={datos.saldoCentavos < 0 ? 'negativo' : 'positivo'} detalle={`Última conciliación: ${datos.billetera.conciliadoEn ? new Date(datos.billetera.conciliadoEn).toLocaleString('es-AR') : 'Sin conciliaciones'} · ${datos.billetera.activo ? 'Activa' : 'Inactiva'}`} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', '@media (min-width:360px)': { gridTemplateColumns: '1fr 1fr' }, gap: 1.5 }}><Button component="a" href={`#/transferencias?origen=${id}`} variant="contained" disabled={!datos.billetera.activo}>Transferir</Button><Button component="a" href={`#/conciliacion?id=${id}`} variant="outlined" disabled={!datos.billetera.activo}>Conciliar</Button></Box>
      <Button onClick={actualizar}>Actualizar saldo y movimientos</Button>
      <Typography variant="h6">Últimos movimientos</Typography>
      <Typography variant="body2" color="text.secondary">El período filtra los movimientos; el saldo mostrado sigue siendo el actual.</Typography>
      <ToggleButtonGroup exclusive value={periodoRapido} onChange={seleccionarPeriodo} aria-label="Período de movimientos" sx={{ minHeight: 44, '& .MuiToggleButton-root': { flex: 1, px: 1, minWidth: 0 } }}>{['Hoy', 'Semana', 'Mes', 'Todos'].map(/** Expone cada rango con estado seleccionado accesible. */ function opcion(valor) { return <ToggleButton key={valor} value={valor}>{valor}</ToggleButton>; })}</ToggleButtonGroup>
      <details><summary>Período personalizado</summary><Stack spacing={1} sx={{ pt: 2 }}><CampoTextoCatalogo etiqueta="Desde" valor={desde} alCambiar={establecerDesde} tipo="date" /><CampoTextoCatalogo etiqueta="Hasta" valor={hasta} alCambiar={establecerHasta} tipo="date" /><Stack direction="row" spacing={1}><Button onClick={aplicar}>Aplicar</Button><Button onClick={limpiar}>Limpiar</Button></Stack></Stack></details>
      <Paper variant="outlined"><ListaMovimiento elementos={datos.movimientos.elementos.map(presentar)} etiqueta={`Movimientos de ${datos.billetera.nombre}`} /></Paper>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><Button onClick={anterior} disabled={pagina === 0}>Anterior</Button><Typography>Página {pagina + 1} · {datos.movimientos.total}</Typography><Button onClick={siguiente} disabled={(pagina + 1) * 20 >= datos.movimientos.total}>Siguiente</Button></Stack>
    </>}
  </Stack>;
}
