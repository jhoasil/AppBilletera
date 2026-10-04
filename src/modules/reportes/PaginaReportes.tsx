import { useEffect, useState } from 'react';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import BarChart from '@mui/icons-material/BarChart';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';
import { IconoCatalogo } from '../../shared/components/IconoCatalogo';
import { EstadoVacio } from '../../shared/components/EstadoVacio';
import { CampoTextoCatalogo } from '../../shared/components/CampoTextoCatalogo';
import { presentacionMovimiento } from '../../shared/components/presentacionMovimiento';
import { porcentajeReporte } from '../../core/services/porcentajeReporte';
import { variacionReporte } from '../../core/services/ServicioPanelReportes';
import { servicioPanelReportes } from '../../app/data/servicioPanelReportes';
import { useCatalogosOperaciones } from '../../app/data/useCatalogosOperaciones';
import { periodoReporte, fechaCalendario, type TipoPeriodoReporte } from '../../core/services/periodoReporte';
import { crearImporte } from '../../core/money/Importe';
import { formatearImporte } from '../../shared/money/formatearImporte';
import { ResumenPatrimonial } from './ResumenPatrimonial';
import { GraficoEvolucion } from './GraficoEvolucion';
import { DistribucionMedios } from './DistribucionMedios';

const pestañas = ['Resumen', 'Ingresos', 'Gastos', 'Actividades', 'Billeteras'] as const;
type PestañaReportes = typeof pestañas[number];
type DatosPanel = Awaited<ReturnType<typeof servicioPanelReportes.consultar>>;

/** Presenta resultado, evolución y patrimonio separados en cinco vistas del mismo período. */
export function PaginaReportes() {
  const { catalogos, error: errorCatalogos } = useCatalogosOperaciones();
  const [pestaña, establecerPestaña] = useState<PestañaReportes>('Resumen');
  const [selector, establecerSelector] = useState(false);
  const [tipo, establecerTipo] = useState<TipoPeriodoReporte>('Mes');
  const [mes, establecerMes] = useState(fechaCalendario(new Date()).slice(0, 7));
  const [desde, establecerDesde] = useState(''); const [hasta, establecerHasta] = useState('');
  const [periodo, establecerPeriodo] = useState({ ...periodoReporte('Mes', '', ''), tipo: 'Mes' as TipoPeriodoReporte });
  const [datos, establecerDatos] = useState<DatosPanel | null>(null); const [error, establecerError] = useState('');
  const [errorPeriodo, establecerErrorPeriodo] = useState(''); const [revision, establecerRevision] = useState(0);
  /** Consulta datos reales agregados y descarta respuestas de rangos anteriores. */
  function cargar() {
    let vigente = true; establecerDatos(null); establecerError('');
    /** Publica el panel cuando continúa vigente la selección. */
    function recibir(resultado: DatosPanel) { if (vigente) establecerDatos(resultado); }
    /** Presenta fallos de lectura o rango sin mostrar cifras anteriores como actuales. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudo consultar el reporte.'); }
    void servicioPanelReportes.consultar(periodo.desde, periodo.hasta, periodo.tipo).then(recibir, fallar);
    /** Evita publicar consultas tras cambiar de período o abandonar la página. */
    function cancelar() { vigente = false; } return cancelar;
  }
  useEffect(cargar, [periodo, revision]);
  /** Formatea importes exactos para la vista, sin sumar ni convertir monedas. */
  function dinero(centavos: number, moneda: string) { return formatearImporte(crearImporte(centavos, moneda)); }
  /** Muestra un mes calendario legible en la cabecera y la base comparativa. */
  function nombreMes(fecha: string) { const nombre = new Date(`${fecha.slice(0, 7)}-01T12:00:00`).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }); return (nombre.charAt(0).toUpperCase() + nombre.slice(1)).replace(' de ', ' '); }
  /** Confirma el rango elegido; un error mantiene intacto el reporte vigente. */
  function aplicar() {
    try {
      let rango = periodoReporte(tipo, desde, hasta);
      if (tipo === 'Mes') {
        if (!/^\d{4}-\d{2}$/.test(mes) || Number(mes.slice(5)) < 1 || Number(mes.slice(5)) > 12) throw new Error('Seleccioná un mes válido.');
        const fecha = new Date(`${mes}-01T12:00:00`);
        rango = { desde: `${mes}-01`, hasta: fechaCalendario(new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)) };
      }
      for (const fecha of [rango.desde, rango.hasta]) if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || new Date(`${fecha}T12:00:00Z`).toISOString().slice(0, 10) !== fecha) throw new Error('Seleccioná fechas válidas.');
      if (rango.desde > rango.hasta) throw new Error('El inicio del período no puede superar su fin.');
      establecerPeriodo({ ...rango, tipo }); establecerSelector(false); establecerErrorPeriodo('');
    } catch (causa) { establecerErrorPeriodo(causa instanceof Error ? causa.message : 'Revisá el período.'); }
  }
  /** Abre controles con el rango vigente, evitando reaplicar un borrador cancelado. */
  function abrirSelector() { establecerTipo(periodo.tipo); establecerDesde(periodo.desde); establecerHasta(periodo.hasta); establecerMes(periodo.hasta.slice(0, 7)); establecerErrorPeriodo(''); establecerSelector(true); }
  /** Cierra el borrador del período sin modificar los datos mostrados. */
  function cancelarSelector() { establecerSelector(false); }
  /** Reintenta las lecturas del rango vigente sin escrituras. */
  function reintentar() { establecerRevision(revision + 1); }
  /** Abre el bloque de patrimonio para consultar saldos y movimientos internos. */
  function abrirBilleteras() { establecerPestaña('Billeteras'); }
  /** Presenta comparación válida o explica la ausencia de una base interpretable. */
  function comparacion(actual: number, anterior: number, gasto = false) {
    const porcentaje = variacionReporte(actual, anterior);
    const referencia = datos ? periodo.tipo === 'Mes' ? nombreMes(datos.anterior.desde) : `${datos.anterior.desde} — ${datos.anterior.hasta}` : '';
    const favorable = gasto ? actual <= anterior : actual >= anterior;
    return <Stack direction="row" useFlexGap sx={{ gap: 0.5, flexWrap: 'wrap', alignItems: 'center', mt: 0.5 }}><Typography variant="caption" title={porcentaje === null ? `La base de ${referencia} es cero o negativa; no permite calcular una variación comparable.` : undefined} sx={{ color: porcentaje === null ? 'text.secondary' : favorable ? 'success.main' : 'error.main', bgcolor: porcentaje === null ? undefined : 'action.hover', borderRadius: '6px', px: porcentaje === null ? 0 : 0.5, fontWeight: 600 }}>{porcentaje === null ? 'Sin comparación' : `${porcentaje >= 0 ? '↑' : '↓'} ${Math.abs(porcentaje).toLocaleString('es-AR')}%`}</Typography>{porcentaje !== null && <Typography variant="caption" color="text.secondary">vs. {referencia}</Typography>}</Stack>;
  }
  /** Presenta las tarjetas de resultado por moneda con base real consultada. */
  function indicadores() {
    return datos?.actual.totales.map(/** Mantiene cada moneda en su propio conjunto de tarjetas. */ function moneda(total) {
      const base = datos.base.totales.find(/** Obtiene la base de la misma moneda. */ function seleccionar(registro) { return registro.moneda === total.moneda; });
      return <Box key={total.moneda} sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.5, '@media (max-width: 359px)': { gridTemplateColumns: '1fr' } }}>
        {[{ titulo: 'Ingresos', valor: total.ingresosCentavos, base: base?.ingresosCentavos ?? 0, color: 'success' as const, icono: <ArrowDownward /> }, { titulo: 'Gastos', valor: total.gastosCentavos, base: base?.gastosCentavos ?? 0, color: 'error' as const, icono: <ArrowUpward /> }].map(/** Presenta ingreso y gasto con etiquetas e iconos semánticos vigentes. */ function tarjeta(registro) { return <Paper key={registro.titulo} variant="outlined" sx={{ p: 1.5, bgcolor: /** Deriva superficies de la paleta vigente. */ function fondo(tema) { return alpha(tema.palette[registro.color].main, 0.1); } }}><Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}><Box sx={{ display: 'grid', placeItems: 'center', width: 36, height: 36, flexShrink: 0, '@media (max-width: 429px)': { width: 28, height: 28, '& svg': { fontSize: 20 } }, borderRadius: '50%', color: `${registro.color}.main`, bgcolor: /** Usa una tonalidad del mismo estado para el icono. */ function fondo(tema) { return alpha(tema.palette[registro.color].main, 0.14); } }}>{registro.icono}</Box><Box sx={{ minWidth: 0, flex: 1 }}><Typography variant="body2">{registro.titulo}{datos.actual.totales.length > 1 ? ` · ${total.moneda}` : ''}</Typography><Typography sx={{ fontWeight: 700, fontSize: { xs: 19, sm: 24 }, letterSpacing: '-0.4px', color: `${registro.color}.main`, overflowWrap: 'anywhere' }}>{dinero(registro.valor, total.moneda)}</Typography>{comparacion(registro.valor, registro.base, registro.color === 'error')}</Box></Stack></Paper>; })}
        <Paper variant="outlined" sx={{ gridColumn: '1 / -1', p: 2, bgcolor: /** Separa el resultado neto mediante superficie azul suave. */ function fondo(tema) { return alpha(tema.palette.primary.main, 0.08); } }}><Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}><Box sx={{ display: 'grid', placeItems: 'center', width: 48, height: 48, flexShrink: 0, borderRadius: '50%', bgcolor: 'action.selected', color: 'primary.main' }}><BarChart sx={{ fontSize: 30 }} /></Box><Box sx={{ minWidth: 0 }}><Typography>Ganancia neta{datos.actual.totales.length > 1 ? ` · ${total.moneda}` : ''}</Typography><Typography sx={{ fontSize: 32, fontWeight: 700, color: total.gananciaCentavos < 0 ? 'error.main' : 'success.main', overflowWrap: 'anywhere' }}>{dinero(total.gananciaCentavos, total.moneda)}</Typography>{comparacion(total.gananciaCentavos, base?.gananciaCentavos ?? 0)}</Box></Stack></Paper>
      </Box>;
    });
  }
  /** Presenta participación por actividad/categoría o rentabilidad, sin recalcular agregados. */
  function desglose(modo: 'ingresos' | 'gastos' | 'actividad') {
    if (!datos) return null;
    const grupo = modo === 'gastos' ? 'categoria' : 'actividad'; const campo = modo === 'gastos' ? 'gastosCentavos' : 'ingresosCentavos';
    const filas = datos.actual.desgloses.filter(/** Selecciona registros reales del desglose vigente. */ function seleccionar(fila) { return fila.tipo === grupo && (modo === 'actividad' || fila[campo] > 0); }).sort(/** Ordena por participación descendente y nombre estable. */ function ordenar(a, b) { return b[campo] - a[campo] || a.nombre.localeCompare(b.nombre, 'es-AR'); });
    return <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={1.5}><Typography variant="h6">{modo === 'gastos' ? 'Gastos por categoría' : modo === 'ingresos' ? 'Ingresos por actividad' : 'Rentabilidad por actividad'}</Typography>{modo === 'actividad' && <Typography variant="body2" color="text.secondary">La ganancia descuenta solo los gastos asociados; los gastos sin actividad se muestran separados.</Typography>}{!filas.length && <Typography color="text.secondary">Sin operaciones en este desglose.</Typography>}{filas.map(/** Presenta nombre, importe, proporción y barra con el denominador de la misma moneda. */ function fila(registro) {
      const catalogo = (grupo === 'categoria' ? catalogos.categorias : catalogos.actividades).find(/** Resuelve metadatos por identidad sin cambiar nombres agregados. */ function identidad(entidad) { return entidad.id === registro.id; });
      const total = datos.actual.totales.find(/** Obtiene el total correspondiente a esta divisa. */ function moneda(total) { return total.moneda === registro.moneda; });
      const porcentaje = porcentajeReporte(registro[campo], total?.[campo] ?? 0);
      return <Stack key={`${registro.id}/${registro.moneda}`} direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}><IconoCatalogo identificador={catalogo?.icono ?? null} color={catalogo?.color ?? null} contenedor /><Box sx={{ flex: 1, minWidth: 0 }}><Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}><Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{registro.nombre}</Typography><Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{modo === 'actividad' ? 'Ingresos: ' : ''}{dinero(registro[campo], registro.moneda)}</Typography><Typography variant="caption" color="text.secondary">{porcentaje}%</Typography></Stack><LinearProgress variant="determinate" value={porcentaje} color={modo === 'gastos' ? 'error' : 'success'} aria-label={`${porcentaje}% del ${modo === 'gastos' ? 'gasto' : 'ingreso'} del período en ${registro.moneda}: ${registro.nombre}`} sx={{ mt: 0.75, height: 8, borderRadius: '8px' }} />{modo === 'actividad' && <Typography variant="body2" sx={{ mt: 1, overflowWrap: 'anywhere' }}>Gastos: {dinero(registro.gastosCentavos, registro.moneda)} · Neto: {dinero(registro.gananciaCentavos, registro.moneda)}</Typography>}</Box></Stack>;
    })}</Stack></Paper>;
  }
  /** Presenta los últimos movimientos globales, con fecha y moneda de su billetera. */
  function recientes() { return <Paper variant="outlined" sx={{ p: 2 }}><Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}><Typography variant="h6">Últimos movimientos</Typography><Button component="a" href="#/billeteras">Ver billeteras</Button></Stack><Typography variant="caption" color="text.secondary">Movimientos recientes de todas las billeteras, independientemente del período.</Typography>{datos?.actual.movimientos.map(/** Conserva tipo, signo e identidad del movimiento para abrir su billetera. */ function movimiento(registro) { const visual = presentacionMovimiento(registro.tipo); const billetera = catalogos.billeteras.find(/** Resuelve la divisa sin usar una preferencia predeterminada. */ function identidad(entidad) { return entidad.id === registro.billeteraId; }); return <Button key={registro.id} component="a" href={`#/billetera?id=${registro.billeteraId}`} sx={{ width: '100%', justifyContent: 'flex-start', gap: 1, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left', textTransform: 'none', flexWrap: 'wrap' }}><Box sx={{ color: visual.color }}>{visual.icono}</Box><Box sx={{ flex: 1, minWidth: 0, color: 'text.primary', overflowWrap: 'anywhere' }}><Typography>{registro.descripcion || visual.nombre}</Typography><Typography variant="caption" color="text.secondary">{visual.nombre} · {new Date(registro.fecha).toLocaleDateString('es-AR')}</Typography></Box><Typography sx={{ color: visual.color, fontWeight: 700, overflowWrap: 'anywhere' }}>{billetera ? `${registro.importeCentavos > 0 ? '+' : ''}${dinero(registro.importeCentavos, billetera.moneda)}` : 'Moneda sin resolver'}</Typography></Button>; })}{!datos?.actual.movimientos.length && <Typography sx={{ mt: 1 }} color="text.secondary">Sin movimientos recientes.</Typography>}</Paper>; }
  return <Stack spacing={1.5} sx={{ '& h6': { fontSize: 16, fontWeight: 700 }, '& .MuiPaper-root': { borderRadius: '16px' } }}>
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}><Typography component="h1" variant="h2" sx={{ fontSize: 24 }}>Reportes</Typography><Button variant="outlined" startIcon={<CalendarMonth />} endIcon={<ExpandMore />} onClick={abrirSelector} aria-label="Seleccionar período de reportes" sx={{ color: 'text.primary', borderColor: 'divider' }}>{periodo.tipo === 'Mes' ? nombreMes(periodo.desde) : periodo.tipo === 'Personalizado' ? 'Personalizado' : periodo.tipo}</Button></Stack>
    <Tabs value={pestaña} variant="scrollable" scrollButtons="auto" aria-label="Secciones de reportes" onChange={/** Cambia la vista conservando el período financiero vigente. */ function elegir(_evento, valor: PestañaReportes) { establecerPestaña(valor); }} sx={{ minHeight: 44, '& .MuiTabs-indicator': { display: 'none' }, '& .MuiTab-root': { minWidth: 0, minHeight: 44, px: { xs: 0.75, sm: 1.25 }, borderRadius: '24px', fontSize: 12, textTransform: 'none', bgcolor: 'action.hover', mr: 0.5 }, '& .MuiTab-root.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText' } }}>{pestañas.map(/** Asocia cada pestaña con su panel accesible. */ function tab(valor) { return <Tab key={valor} value={valor} label={valor} id={`reporte-tab-${valor}`} aria-controls={`reporte-panel-${valor}`} />; })}</Tabs>
    <Typography variant="caption" color="text.secondary" sx={periodo.tipo === 'Mes' ? { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' } : {}}>Período: {periodo.desde} — {periodo.hasta}</Typography>
    {errorCatalogos && <Alert severity="warning">{errorCatalogos}</Alert>}{error && <Alert severity="error" action={<Button onClick={reintentar}>Reintentar</Button>}>{error}</Alert>}
    {!datos && !error && <CircularProgress aria-label="Consultando reportes" />}
    {datos && <Stack spacing={2} role="tabpanel" id={`reporte-panel-${pestaña}`} aria-labelledby={`reporte-tab-${pestaña}`}>
      {pestaña === 'Resumen' && <>{indicadores()}<ResumenPatrimonial desde={periodo.desde} hasta={periodo.hasta} compacto alAbrir={abrirBilleteras} /><GraficoEvolucion puntos={datos.evolucion} />{recientes()}</>}
      {pestaña === 'Ingresos' && <>{desglose('ingresos')}<GraficoEvolucion puntos={datos.evolucion} modo="ingresos" /><DistribucionMedios datos={datos.actual} tipo="ingresos" /></>}
      {pestaña === 'Gastos' && <>{desglose('gastos')}<GraficoEvolucion puntos={datos.evolucion} modo="gastos" /><DistribucionMedios datos={datos.actual} tipo="gastos" /></>}
      {pestaña === 'Actividades' && desglose('actividad')}
      {pestaña === 'Billeteras' && <ResumenPatrimonial desde={periodo.desde} hasta={periodo.hasta} />}
      {!datos.actual.desgloses.some(/** Detecta ausencia real de operaciones sin ocultar patrimonio ni evolución. */ function movimiento(fila) { return fila.ingresosCentavos !== 0 || fila.gastosCentavos !== 0; }) && <EstadoVacio titulo="Sin operaciones en este período" descripcion="Elegí otro período para consultar ingresos y gastos; el patrimonio y la evolución permanecen independientes." />}
    </Stack>}
    <Dialog open={selector} onClose={cancelarSelector} aria-labelledby="titulo-periodo-reportes"><DialogTitle id="titulo-periodo-reportes">Período de reportes</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><ToggleButtonGroup exclusive value={tipo} aria-label="Tipo de período" onChange={/** Edita el borrador de rango sin consultar todavía. */ function elegir(_evento, valor: TipoPeriodoReporte | null) { if (valor) establecerTipo(valor); }} sx={{ flexWrap: 'wrap' }}>{(['Hoy', 'Semana', 'Mes', 'Año', 'Personalizado'] as const).map(/** Ofrece todos los rangos existentes. */ function opcion(valor) { return <ToggleButton key={valor} value={valor}>{valor}</ToggleButton>; })}</ToggleButtonGroup>{tipo === 'Mes' && <CampoTextoCatalogo etiqueta="Mes" valor={mes} alCambiar={establecerMes} tipo="month" />}{tipo === 'Personalizado' && <><CampoTextoCatalogo etiqueta="Desde" valor={desde} alCambiar={establecerDesde} tipo="date" /><CampoTextoCatalogo etiqueta="Hasta" valor={hasta} alCambiar={establecerHasta} tipo="date" /></>}{errorPeriodo && <Alert severity="error">{errorPeriodo}</Alert>}</Stack></DialogContent><DialogActions><Button onClick={cancelarSelector}>Cancelar</Button><Button variant="contained" onClick={aplicar}>Consultar</Button></DialogActions></Dialog>
  </Stack>;
}
