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
  return <Stack spacing={2}>
    <CabeceraPagina titulo="Inicio" acciones={<Button onClick={actualizar}>Actualizar</Button>} />
    {error && <Alert severity="error">{error}</Alert>}
    {!resumen || !billeteras ? !error && <CircularProgress aria-label="Cargando resumen" /> : <>
      {resumen.totales.map(/** Presenta un resumen, billetera o movimiento ya preparado, sin agregar importes financieros. */ function presentar(total) { return <Stack key={total.moneda} spacing={2}>
        <TarjetaResumen titulo="Ganancia de hoy" valor={importe(total.gananciaCentavos, total.moneda)} tono="destacado" principal pie={<Stack direction="row" spacing={2}><Typography variant="body2">Ingresos {importe(total.ingresosCentavos, total.moneda)}</Typography><Typography variant="body2">Gastos {importe(total.gastosCentavos, total.moneda)}</Typography></Stack>} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, '@media (min-width:360px)': { gridTemplateColumns: '1fr 1fr' }, gap: 1.5 }}>
          <TarjetaResumen titulo="Ingresos" valor={importe(total.ingresosCentavos, total.moneda)} tono="positivo" accion={<Button component="a" href="#/ingresos?nuevo=1" color="inherit">+ Agregar ingreso</Button>} />
          <TarjetaResumen titulo="Gastos" valor={importe(total.gastosCentavos, total.moneda)} tono="negativo" accion={<Button component="a" href="#/gastos?nuevo=1" color="inherit">+ Agregar gasto</Button>} />
        </Box>
      </Stack>; })}
      <Typography variant="h6">Mi dinero</Typography>
      {billeteras.elementos.slice(0, 3).map(/** Presenta un resumen, billetera o movimiento ya preparado, sin agregar importes financieros. */ function presentar({ billetera, saldoCentavos }) { return <Button key={billetera.id} component="a" href={`#/billetera?id=${billetera.id}`} sx={{ justifyContent: 'space-between', gap: 1, minHeight: 64, p: 2, bgcolor: 'background.paper' }}><IconoCatalogo identificador={billetera.icono} /><Box component="span" sx={{ flex: 1, minWidth: 0, textAlign: 'left', overflowWrap: 'anywhere' }}>{billetera.nombre}</Box><Box component="span" sx={{ overflowWrap: 'anywhere', maxWidth: '45%', fontVariantNumeric: 'tabular-nums' }}>{importe(saldoCentavos, billetera.moneda)}</Box></Button>; })}
      {!billeteras.total && <Typography color="text.secondary">Creá tu primera billetera desde Ajustes.</Typography>}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><Button component="a" href="#/transferencias" variant="contained">Transferir</Button><Button component="a" href="#/billeteras">Ver todas</Button></Stack>
      <Typography variant="h6">Últimos movimientos</Typography>
      {resumen.movimientos.map(/** Muestra signo, tipo, fecha e importe con la moneda histórica de la billetera. */ function presentar(movimiento) {
        const billetera = catalogoBilleteras.find(/** Resuelve solamente metadatos para formatear el movimiento. */ function identificar(registro) { return registro.id === movimiento.billeteraId; });
        const visual = presentacionMovimiento(movimiento.tipo);
        return <Paper key={movimiento.id} variant="outlined"><Button component="a" href={`#/billetera?id=${movimiento.billeteraId}`} color="inherit" sx={{ width: '100%', minHeight: 72, p: 1.5, gap: 1.5, justifyContent: 'flex-start' }}>
          <Box sx={{ display: 'flex', color: visual.color }}>{visual.icono}</Box><Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}><Typography sx={{ overflowWrap: 'anywhere' }}>{visual.nombre} · {movimiento.descripcion || billetera?.nombre || 'Ver billetera'}</Typography><Typography variant="body2" color="text.secondary">{new Date(movimiento.fecha).toLocaleString('es-AR')}</Typography></Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', maxWidth: '40%', overflowWrap: 'anywhere', color: visual.color }}>{billetera ? `${movimiento.importeCentavos > 0 ? '+' : ''}${importe(movimiento.importeCentavos, billetera.moneda)}` : 'Ver importe'}</Typography>
        </Button></Paper>;
      })}
      {!resumen.movimientos.length && <Typography color="text.secondary">Todavía no hay movimientos de billetera.</Typography>}
    </>}
  </Stack>;
}
