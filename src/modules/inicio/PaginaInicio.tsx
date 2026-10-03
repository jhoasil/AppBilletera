import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { CabeceraPagina } from '../../shared/components/CabeceraPagina';
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
  const [error, establecerError] = useState(''); const [revision, establecerRevision] = useState(0);
  /** Consulta los resultados del día local y las primeras billeteras activas. */
  function cargar() {
    let vigente = true; establecerError('');
    const ahora = new Date(); const hoy = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
    /** Publica lecturas acotadas cuando la pantalla sigue vigente. */
    function completar([resultado, saldos]: [ResumenPeriodo, ConsultaBilleterasConSaldo]) { if (vigente) { establecerResumen(resultado); establecerBilleteras(saldos); } }
    /** Muestra fallas de persistencia sin inventar importes. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudo consultar el inicio.'); }
    void Promise.all([servicioResumen.consultar(hoy, hoy), servicioConsultaBilleteras.listarPrincipales()]).then(completar, fallar);
    /** Descarta lecturas de una pantalla abandonada. */
    function cancelar() { vigente = false; } return cancelar;
  }
  useEffect(cargar, [revision]);
  /** Reintenta la lectura sin modificar datos financieros. */
  function actualizar() { establecerRevision(revision + 1); }
  /** Formatea centavos enteros usando la moneda del registro. */
  function importe(centavos: number, moneda: string) { return formatearImporte(crearImporte(centavos, moneda)); }
  return <Stack spacing={2}>
    <CabeceraPagina titulo="Inicio" acciones={<Button onClick={actualizar}>Actualizar</Button>} />
    {error && <Alert severity="error">{error}</Alert>}
    {!resumen || !billeteras ? !error && <CircularProgress aria-label="Cargando resumen" /> : <>
      {resumen.totales.map(/** Presenta un resumen, billetera o movimiento ya preparado, sin agregar importes financieros. */ function presentar(total) { return <Stack key={total.moneda} spacing={2}>
        <TarjetaResumen titulo="Ganancia de hoy" valor={importe(total.gananciaCentavos, total.moneda)} tono="destacado" />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Stack sx={{ flex: 1 }}><TarjetaResumen titulo="Ingresos de hoy" valor={importe(total.ingresosCentavos, total.moneda)} tono="positivo" /><Button component="a" href="#/ingresos?nuevo=1">+ Agregar ingreso</Button></Stack>
          <Stack sx={{ flex: 1 }}><TarjetaResumen titulo="Gastos de hoy" valor={importe(total.gastosCentavos, total.moneda)} tono="negativo" /><Button component="a" href="#/gastos?nuevo=1">+ Agregar gasto</Button></Stack>
        </Stack>
      </Stack>; })}
      <Typography variant="h6">Mi dinero</Typography>
      {billeteras.elementos.map(/** Presenta un resumen, billetera o movimiento ya preparado, sin agregar importes financieros. */ function presentar({ billetera, saldoCentavos }) { return <Button key={billetera.id} component="a" href={`#/billetera?id=${billetera.id}`} sx={{ justifyContent: 'space-between' }}><span>{billetera.nombre}</span><span>{importe(saldoCentavos, billetera.moneda)}</span></Button>; })}
      {!billeteras.total && <Typography color="text.secondary">Creá tu primera billetera desde Ajustes.</Typography>}
      <Stack direction="row" spacing={1}><Button component="a" href="#/transferencias" variant="contained">Transferir</Button><Button component="a" href="#/billeteras">Ver todas</Button></Stack>
      <Typography variant="h6">Últimos movimientos</Typography>
      {resumen.movimientos.map(/** Presenta un resumen, billetera o movimiento ya preparado, sin agregar importes financieros. */ function presentar(movimiento) { const billetera = billeteras.elementos.find(/** Encuentra la etiqueta de una billetera del resumen para mostrar un movimiento reciente. */ function identificar(elemento) { return elemento.billetera.id === movimiento.billeteraId; }); return <Paper key={movimiento.id} variant="outlined" sx={{ p: 1.5 }}><Button component="a" href={`#/billetera?id=${movimiento.billeteraId}`}>{movimiento.descripcion || movimiento.tipo.replaceAll('_', ' ')} · {billetera?.billetera.nombre ?? 'Ver billetera'}</Button></Paper>; })}
      {!resumen.movimientos.length && <Typography color="text.secondary">Todavía no hay movimientos de billetera.</Typography>}
    </>}
  </Stack>;
}
