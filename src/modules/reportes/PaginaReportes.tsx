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
  function aplicar() { establecerPeriodo(periodoReporte(tipo, desde, hasta)); }
  /** Prepara un importe exacto para su presentación. */
  function importe(centavos: number, moneda: string) { return formatearImporte(crearImporte(centavos, moneda)); }
  return <Stack spacing={2}>
    <CabeceraPagina titulo="Reportes" />
    <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>{(['Hoy', 'Semana', 'Mes', 'Año', 'Personalizado'] as const).map(function opcion(valor) { /** Selecciona el período y aplica inmediatamente los rangos predeterminados. */ function elegir() { establecerTipo(valor); if (valor !== 'Personalizado') establecerPeriodo(periodoReporte(valor, '', '')); } return <Button key={valor} variant={tipo === valor ? 'contained' : 'outlined'} onClick={elegir}>{valor}</Button>; })}</Stack>
    {tipo === 'Personalizado' && <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><CampoTextoCatalogo etiqueta="Desde" valor={desde} alCambiar={establecerDesde} tipo="date" /><CampoTextoCatalogo etiqueta="Hasta" valor={hasta} alCambiar={establecerHasta} tipo="date" /><Button onClick={aplicar}>Consultar</Button></Stack>}
    <Typography color="text.secondary">{periodo.desde} — {periodo.hasta}</Typography>
    {error && <Alert severity="error">{error}</Alert>}
    {!datos ? !error && <CircularProgress aria-label="Consultando reportes" /> : <>
      {datos.totales.map(function presentar(total) { return <Stack key={total.moneda} direction={{ xs: 'column', md: 'row' }} spacing={2}><TarjetaResumen titulo="Ingresos" valor={importe(total.ingresosCentavos, total.moneda)} tono="positivo" /><TarjetaResumen titulo="Gastos" valor={importe(total.gastosCentavos, total.moneda)} tono="negativo" /><TarjetaResumen titulo="Ganancia neta" valor={importe(total.gananciaCentavos, total.moneda)} tono="destacado" /></Stack>; })}
      <Typography variant="h6">Rentabilidad por actividad</Typography>
      <Typography color="text.secondary">La ganancia de cada actividad descuenta únicamente sus gastos asociados. Los gastos sin actividad se muestran separados.</Typography>
      {datos.desgloses.filter(function seleccionar(fila) { return fila.tipo === 'actividad'; }).map(function presentar(fila) { return <Paper key={`${fila.id}/${fila.moneda}`} variant="outlined" sx={{ p: 2 }}><Typography variant="subtitle1">{fila.nombre}</Typography><Typography>Ingresos: {importe(fila.ingresosCentavos, fila.moneda)}</Typography><Typography>Gastos asociados: {importe(fila.gastosCentavos, fila.moneda)}</Typography><Typography color={fila.gananciaCentavos < 0 ? 'error.main' : 'success.main'}>Ganancia neta: {importe(fila.gananciaCentavos, fila.moneda)}</Typography></Paper>; })}
      {(['medio', 'categoria'] as const).map(function seccion(grupo) { return <Stack key={grupo} spacing={1}><Typography variant="h6">{grupo === 'medio' ? 'Por medio de pago' : 'Gastos por categoría'}</Typography>{datos.desgloses.filter(function seleccionar(fila) { return fila.tipo === grupo; }).map(function presentar(fila) { return <Typography key={`${fila.id}/${fila.moneda}`}>{fila.nombre} · Ingresos {importe(fila.ingresosCentavos, fila.moneda)} · Gastos {importe(fila.gastosCentavos, fila.moneda)}</Typography>; })}</Stack>; })}
      <ResumenPatrimonial desde={periodo.desde} hasta={periodo.hasta} />
    </>}
  </Stack>;
}
