import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LinearProgress from '@mui/material/LinearProgress';
import { IconoCatalogo } from '../../shared/components/IconoCatalogo';
import { EstadoVacio } from '../../shared/components/EstadoVacio';
import { porcentajeReporte } from '../../core/services/porcentajeReporte';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { ResumenPatrimonial } from './ResumenPatrimonial';
import { CabeceraPagina } from '../../shared/components/CabeceraPagina';
import { TarjetaResumen } from '../../shared/components/TarjetaResumen';
import { CampoTextoCatalogo } from '../../shared/components/CampoTextoCatalogo';
import { servicioResumen } from '../../app/data/servicioResumen';
import { periodoReporte, type TipoPeriodoReporte } from '../../core/services/periodoReporte';
import type { ResumenPeriodo } from '../../core/repositories/RepositorioResumen';
import { crearImporte } from '../../core/money/Importe';
import { formatearImporte } from '../../shared/money/formatearImporte';

/** Consulta resúmenes agregados por período y conserva separados los resultados de distintas monedas. */
export function PaginaReportes() {
  const [tipo, establecerTipo] = useState<TipoPeriodoReporte>('Mes'); const [desde, establecerDesde] = useState(''); const [hasta, establecerHasta] = useState('');
  const [periodo, establecerPeriodo] = useState(periodoReporte('Mes', '', ''));
  const [datos, establecerDatos] = useState<ResumenPeriodo | null>(null); const [error, establecerError] = useState('');
  /** Obtiene únicamente las agregaciones y descarta respuestas de filtros anteriores. */
  function cargar() { let vigente = true; establecerError(''); establecerDatos(null);
    /** Publica una consulta vigente. */
    function completar(resultado: ResumenPeriodo) { if (vigente) establecerDatos(resultado); }
    /** Explica errores de rango o persistencia. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudo consultar el reporte.'); }
    /** Incluye la validación síncrona dentro de la promesa de lectura. */
    function consultar() { return servicioResumen.consultar(periodo.desde, periodo.hasta); }
    void Promise.resolve().then(consultar).then(completar, fallar);
    /** Evita publicar resultados de una pantalla abandonada. */
    function cancelar() { vigente = false; } return cancelar;
  }
  useEffect(cargar, [periodo]);
  /** Aplica el período elegido sin realizar cálculos financieros en presentación. */
  function aplicar() { try { establecerPeriodo(periodoReporte(tipo, desde, hasta)); establecerError(''); } catch (causa) { establecerError(causa instanceof Error ? causa.message : 'Revisá el período.'); } }
  /** Prepara un importe exacto para su presentación. */
  function importe(centavos: number, moneda: string) { return formatearImporte(crearImporte(centavos, moneda)); }
  return <Stack spacing={2}>
    <CabeceraPagina titulo="Reportes" />
    <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}><ToggleButtonGroup exclusive value={tipo === 'Personalizado' ? null : tipo} aria-label="Período del reporte" onChange={/** Aplica una selección válida sin cambiar cálculos financieros. */ function elegir(_evento, valor: TipoPeriodoReporte | null) { if (valor && valor !== 'Personalizado') { establecerTipo(valor); establecerPeriodo(periodoReporte(valor, '', '')); } }} sx={{ flexWrap: 'wrap' }}>{(['Hoy', 'Semana', 'Mes', 'Año'] as const).map(/** Identifica cada período con texto y selección visible. */ function opcion(valor) { return <ToggleButton key={valor} value={valor}>{valor}</ToggleButton>; })}</ToggleButtonGroup><Button sx={{ minHeight: 44 }} variant={tipo === 'Personalizado' ? 'contained' : 'text'} onClick={/** Abre el rango libre sin consultar hasta confirmarlo. */ function personalizar() { establecerTipo('Personalizado'); }}>Personalizado</Button></Stack>
    {tipo === 'Personalizado' && <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><CampoTextoCatalogo etiqueta="Desde" valor={desde} alCambiar={establecerDesde} tipo="date" /><CampoTextoCatalogo etiqueta="Hasta" valor={hasta} alCambiar={establecerHasta} tipo="date" /><Button onClick={aplicar}>Consultar</Button></Stack>}
    <Typography color="text.secondary">{periodo.desde} — {periodo.hasta}</Typography>
    {error && <Alert severity="error">{error}</Alert>}
    {!datos ? !error && <CircularProgress aria-label="Consultando reportes" /> : <>
      {datos.totales.map(/** Presenta importes agregados por persistencia con su moneda y etiquetas de resultado. */ function presentar(total) { return <Box key={total.moneda} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}><TarjetaResumen titulo="Ingresos" valor={importe(total.ingresosCentavos, total.moneda)} tono="positivo" /><TarjetaResumen titulo="Gastos" valor={importe(total.gastosCentavos, total.moneda)} tono="negativo" /><TarjetaResumen titulo="Ganancia neta" valor={importe(total.gananciaCentavos, total.moneda)} tono="destacado" /></Box>; })}
      {datos.totales.length === 0 && <EstadoVacio titulo="Sin operaciones en este período" descripcion="Elegí otro rango para consultar tus ingresos y gastos." />}
      {(['actividad', 'categoria', 'medio'] as const).map(/** Mantiene cada desglose en su propia superficie y conserva agrupación por moneda. */ function seccion(grupo) {
        const filas = datos.desgloses.filter(/** Selecciona agregados ya preparados por persistencia. */ function seleccionar(fila) { return fila.tipo === grupo; });
        return <Paper key={grupo} variant="outlined" sx={{ p: 2 }}><Stack spacing={2}>
          <Typography variant="h6">{grupo === 'actividad' ? 'Rentabilidad por actividad' : grupo === 'categoria' ? 'Gastos por categoría' : 'Por medio de pago'}</Typography>
          {grupo === 'actividad' && <Typography variant="body2" color="text.secondary">La ganancia descuenta únicamente gastos asociados. Los gastos sin actividad se presentan separados.</Typography>}
          {!filas.length && <Typography color="text.secondary">Sin movimientos en este desglose.</Typography>}
          {filas.map(/** Presenta nombre, importes exactos y proporciones sin mezclar monedas ni sumar historial en React. */ function presentar(fila) {
            const total = datos.totales.find(/** Resuelve el denominador agregado de la misma moneda. */ function moneda(candidato) { return candidato.moneda === fila.moneda; });
            const ingreso = porcentajeReporte(fila.ingresosCentavos, total?.ingresosCentavos ?? 0);
            const gasto = porcentajeReporte(fila.gastosCentavos, total?.gastosCentavos ?? 0);
            return <Stack key={`${fila.id}/${fila.moneda}`} spacing={1} sx={{ minHeight: 72, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><IconoCatalogo identificador={grupo === 'actividad' ? 'work_outline' : grupo === 'categoria' ? 'category' : 'payments'} /><Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{fila.nombre} · {fila.moneda}</Typography></Stack>
              {grupo !== 'categoria' && <><Typography variant="body2">Ingresos: {importe(fila.ingresosCentavos, fila.moneda)} · {ingreso}% del ingreso del período</Typography><LinearProgress variant="determinate" value={ingreso} color="success" aria-label={`Participación de ingresos de ${fila.nombre}`} sx={{ height: 8, borderRadius: 999 }} /></>}
              <Typography variant="body2">Gastos: {importe(fila.gastosCentavos, fila.moneda)} · {gasto}% del gasto del período</Typography><LinearProgress variant="determinate" value={gasto} color="error" aria-label={`Participación de gastos de ${fila.nombre}`} sx={{ height: 8, borderRadius: 999 }} />
              {grupo === 'actividad' && <Typography sx={{ fontSize: 20, fontWeight: 700, overflowWrap: 'anywhere' }}>Ganancia neta: {importe(fila.gananciaCentavos, fila.moneda)}</Typography>}
            </Stack>;
          })}
        </Stack></Paper>;
      })}
      <ResumenPatrimonial desde={periodo.desde} hasta={periodo.hasta} />
    </>}
  </Stack>;
}
