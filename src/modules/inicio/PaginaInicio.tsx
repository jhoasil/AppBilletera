import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { IconoCatalogo } from '../../shared/components/IconoCatalogo';
import { presentacionMovimiento } from '../../shared/components/presentacionMovimiento';
import { listarCatalogo } from '../../app/data/datosCargaRapida';
import { servicioBilleteras } from '../../app/data/serviciosCatalogos';
import type { Billetera } from '../../core/entities/Billetera';
import IconButton from '@mui/material/IconButton';
import Refresh from '@mui/icons-material/Refresh';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Add from '@mui/icons-material/Add';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import ListAlt from '@mui/icons-material/ListAlt';
import { estadosFinancieros, tokensVisuales } from '../../app/theme/tokens';
import { TarjetaResumen } from '../../shared/components/TarjetaResumen';
import { servicioResumen } from '../../app/data/servicioResumen';
import { servicioConsultaBilleteras } from '../../app/data/servicioConsultaBilleteras';
import type { ResumenPeriodo } from '../../core/repositories/RepositorioResumen';
import type { ConsultaBilleterasConSaldo } from '../../core/repositories/RepositorioConsultaBilleteras';
import { crearImporte } from '../../core/money/Importe';
import { formatearImporte } from '../../shared/money/formatearImporte';

/** Presenta resultados de hoy, accesos de carga y saldos sin calcular agregaciones financieras en React. */
export function PaginaInicio() {
  const [resumen, establecerResumen] = useState<ResumenPeriodo | null>(null);
  const [billeteras, establecerBilleteras] = useState<ConsultaBilleterasConSaldo | null>(null);
  const [catalogoBilleteras, establecerCatalogoBilleteras] = useState<readonly Billetera[]>([]);
  const [error, establecerError] = useState(''); const [revision, establecerRevision] = useState(0);
  /** Consulta los resultados del día local y las primeras billeteras activas. */
  function cargar() {
    let vigente = true; establecerError('');
    const ahora = new Date(); const hoy = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
    /** Publica lecturas acotadas cuando la pantalla sigue vigente. */
    function completar([resultado, saldos, catalogo]: [ResumenPeriodo, ConsultaBilleterasConSaldo, readonly Billetera[]]) { if (vigente) { establecerResumen(resultado); establecerBilleteras(saldos); establecerCatalogoBilleteras(catalogo); } }
    /** Muestra fallas de persistencia sin inventar importes. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudo consultar el inicio.'); }
    void Promise.all([servicioResumen.consultar(hoy, hoy), servicioConsultaBilleteras.listarPrincipales(), listarCatalogo(servicioBilleteras)]).then(completar, fallar);
    /** Descarta lecturas de una pantalla abandonada. */
    function cancelar() { vigente = false; } return cancelar;
  }
  useEffect(cargar, [revision]);
  /** Reintenta la lectura sin modificar datos financieros. */
  function actualizar() { establecerRevision(revision + 1); }
  /** Formatea centavos enteros usando la moneda del registro. */
  function importe(centavos: number, moneda: string) { return formatearImporte(crearImporte(centavos, moneda)); }
  const principales = billeteras?.elementos.slice(0, 3) ?? [];
  return <>
    <Typography component="h1" sx={{ position: 'absolute', width: '1px', height: '1px', p: 0, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }}>Inicio</Typography>
    {/* El título oculto queda fuera del Stack para no añadir separación antes de la fecha. */}
    <Stack spacing={1.5}>
    {/* La fecha contextual reemplaza el título repetido; Actualizar sigue disponible sin ocupar otra fila. */}
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}><Typography color="text.secondary">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</Typography><IconButton onClick={actualizar} aria-label="Actualizar Inicio"><Refresh /></IconButton></Stack>
    {error && <Alert severity="error">{error}</Alert>}
    {!resumen || !billeteras ? !error && <CircularProgress aria-label="Cargando resumen" /> : <>
      {resumen.totales.map(/** Presenta un resumen, billetera o movimiento ya preparado, sin agregar importes financieros. */ function presentar(total) { return <Stack key={total.moneda} spacing={2}>
        <TarjetaResumen titulo="Ganancia de hoy" valor={importe(total.gananciaCentavos, total.moneda)} tono="destacado" principal suave disposicion="resumen" icono={<TrendingUp />} pie={<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', py: 1, borderRadius: `${tokensVisuales.radioInput}px`, bgcolor: 'background.paper', textAlign: 'center', '@media (max-width:359px)': { gridTemplateColumns: '1fr', rowGap: 1, '& > div': { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 0.5 } } }}>
          <Box sx={{ px: 1, borderRight: '1px solid', borderColor: 'divider', '@media (max-width:359px)': { borderRight: 0, borderBottom: '1px solid', borderColor: 'divider', pb: 1 } }}><Typography sx={{ fontSize: 20, fontWeight: 700, color: 'success.main', fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>+{importe(total.ingresosCentavos, total.moneda)}</Typography><Typography variant="body2" color="text.secondary">Ingresos</Typography></Box>
          <Box sx={{ px: 1 }}><Typography sx={{ fontSize: 20, fontWeight: 700, color: 'error.main', fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>-{importe(total.gastosCentavos, total.moneda)}</Typography><Typography variant="body2" color="text.secondary">Gastos</Typography></Box>
        </Box>} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, '@media (min-width:360px)': { gridTemplateColumns: '1fr 1fr' }, gap: 1.5 }}>
          <TarjetaResumen titulo="Ingresos" valor={importe(total.ingresosCentavos, total.moneda)} tono="positivo" suave disposicion="acceso" icono={<ArrowDownward />} accion={<Button fullWidth variant="contained" startIcon={<Add />} component="a" href="#/ingresos?nuevo=1" color="success" sx={/** Oscurece el verde en claro para que el texto blanco conserve contraste. */ function botonIngreso(tema) { return { px: 1, fontSize: 13, '& .MuiButton-startIcon': { mr: 0.5 }, bgcolor: tema.palette.mode === 'light' ? 'success.dark' : 'success.main', color: tema.palette.mode === 'light' ? 'common.white' : 'success.contrastText', '&:hover': { bgcolor: tema.palette.mode === 'light' ? 'success.dark' : 'success.light' } }; }}>Agregar ingreso</Button>} />
          <TarjetaResumen titulo="Gastos" valor={importe(total.gastosCentavos, total.moneda)} tono="negativo" suave disposicion="acceso" icono={<ArrowUpward />} accion={<Button fullWidth variant="contained" startIcon={<Add />} component="a" href="#/gastos?nuevo=1" color="error" sx={/** Conserva el contraste del texto también al señalar el botón en oscuro. */ function botonGasto(tema) { return { px: 1, fontSize: 13, '& .MuiButton-startIcon': { mr: 0.5 }, '&:hover': { bgcolor: tema.palette.mode === 'dark' ? 'error.light' : 'error.dark' } }; }}>Agregar gasto</Button>} />
        </Box>
      </Stack>; })}
      <Paper variant="outlined" sx={{ p: 1.5 }}><Stack spacing={1}>
        <Typography component="h2" variant="h3" sx={{ fontWeight: 700 }}>Mi dinero</Typography>
        {/* Las mini tarjetas solo distribuyen saldos ya agregados; no suman ni mezclan monedas. */}
        {principales.length > 0 && <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(principales.length, 2)}, minmax(0, 1fr))`, '@media (min-width:360px)': { gridTemplateColumns: `repeat(${principales.length}, minmax(0, 1fr))` }, gap: 1 }}>
          {principales.map(/** Ajusta las columnas a las billeteras reales, sin reservar huecos de registros inexistentes. */ function presentar({ billetera, saldoCentavos }) { return <Button key={billetera.id} component="a" href={`#/billetera?id=${billetera.id}`} color="inherit" sx={{ p: 1, display: 'flex', flexDirection: principales.length === 1 ? 'row' : 'column', gap: 1, border: '1px solid', borderColor: 'divider', minWidth: 0 }}><IconoCatalogo identificador={billetera.icono} color={billetera.color} contenedor /><Box sx={{ minWidth: 0, textAlign: principales.length === 1 ? 'left' : 'center' }}><Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{billetera.nombre}</Typography><Typography sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>{importe(saldoCentavos, billetera.moneda)}</Typography></Box></Button>; })}
        </Box>}
        {!billeteras.total && <Typography color="text.secondary">Creá tu primera billetera desde Ajustes.</Typography>}
        <Box sx={/** Mantiene legibles las acciones suaves sobre la superficie azul de ambos temas. */ function acciones(tema) { return { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1, '& .MuiButton-root': { bgcolor: 'action.selected', color: tema.palette.mode === 'dark' ? 'primary.light' : 'primary.main', px: 1, '&:hover': { bgcolor: 'action.hover' } } }; }}>
          <Button component="a" href="#/transferencias" startIcon={<SwapHoriz />}>Transferir</Button>
          <Button component="a" href="#/billeteras" startIcon={<ListAlt />}>Ver todas</Button>
        </Box>
      </Stack></Paper>
      <Paper variant="outlined" sx={{ p: 1.5 }}><Typography component="h2" variant="h3" sx={{ mb: 1, fontWeight: 700 }}>Últimos movimientos</Typography>
      {resumen.movimientos.map(/** Muestra signo, tipo, fecha e importe con la moneda histórica de la billetera. */ function presentar(movimiento) {
        const billetera = catalogoBilleteras.find(/** Resuelve solamente metadatos para formatear el movimiento. */ function identificar(registro) { return registro.id === movimiento.billeteraId; });
        const visual = presentacionMovimiento(movimiento.tipo);
        return <Box key={movimiento.id} sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}><Button component="a" href={`#/billetera?id=${movimiento.billeteraId}`} color="inherit" sx={{ width: '100%', minHeight: 64, py: 1, px: 0, gap: 1, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          <Box sx={/** Distingue los tipos con icono y fondo semántico sin inferir un ingreso a partir del signo. */ function circulo(tema) {
            const estados = estadosFinancieros[tema.palette.mode === 'dark' ? 'oscuro' : 'claro'];
            const fondo = movimiento.tipo === 'INGRESO' ? estados.ingreso.fondo : movimiento.tipo === 'GASTO' ? estados.gasto.fondo : movimiento.tipo.startsWith('AJUSTE') ? estados.ajuste.fondo : tema.palette.action.selected;
            return { display: 'grid', placeItems: 'center', width: 40, height: 40, flexShrink: 0, borderRadius: '50%', bgcolor: fondo, color: visual.color };
          }}>{visual.icono}</Box><Box sx={{ flex: '1 1 112px', minWidth: 0, textAlign: 'left' }}><Typography sx={{ overflowWrap: 'anywhere' }}>{visual.nombre} · {movimiento.descripcion || billetera?.nombre || 'Ver billetera'}</Typography><Typography variant="body2" color="text.secondary">{new Date(movimiento.fecha).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}</Typography></Box>
          {/* En el ancho mínimo el importe completo puede bajar de fila; nunca se parte el último centavo. */}
          <Typography sx={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: 'tabular-nums', ml: 'auto', whiteSpace: 'nowrap', color: visual.color }}>{billetera ? `${movimiento.importeCentavos > 0 ? '+' : ''}${importe(movimiento.importeCentavos, billetera.moneda)}` : 'Ver importe'}</Typography>
        </Button></Box>;
      })}
      {!resumen.movimientos.length && <Typography color="text.secondary">Todavía no hay movimientos de billetera.</Typography>}</Paper>
    </>}
  </Stack></>;
}
