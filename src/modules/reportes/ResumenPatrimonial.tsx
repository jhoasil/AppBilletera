import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { IconoCatalogo } from '../../shared/components/IconoCatalogo';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { servicioPatrimonio } from '../../app/data/servicioPatrimonio';
import type { ResumenPatrimonio } from '../../core/repositories/RepositorioPatrimonio';
import { crearImporte } from '../../core/money/Importe';
import { formatearImporte } from '../../shared/money/formatearImporte';
import { TarjetaResumen } from '../../shared/components/TarjetaResumen';

/** Presenta patrimonio actual y movimientos internos con etiquetas que distinguen sus períodos. */
export function ResumenPatrimonial({ desde, hasta, compacto = false, alAbrir }: { desde: string; hasta: string; compacto?: boolean; alAbrir?: () => void }) {
  const [datos, establecerDatos] = useState<ResumenPatrimonio | null>(null); const [error, establecerError] = useState('');
  /** Recupera una lectura vigente y descarta respuestas de otros períodos. */
  function cargar() { let vigente = true; establecerDatos(null); establecerError('');
    /** Publica el reporte patrimonial solicitado. */
    function completar(resultado: ResumenPatrimonio) { if (vigente) establecerDatos(resultado); }
    /** Explica una falla de consulta. */
    function fallar(causa: unknown) { if (vigente) establecerError(causa instanceof Error ? causa.message : 'No se pudo consultar el patrimonio.'); }
    void servicioPatrimonio.consultar(desde, hasta).then(completar, fallar);
    /** Evita publicar una respuesta desactualizada. */
    function cancelar() { vigente = false; } return cancelar;
  }
  useEffect(cargar, [desde, hasta]);
  /** Formatea un saldo sin convertir divisas. */
  function importe(centavos: number, moneda: string) { return formatearImporte(crearImporte(centavos, moneda)); }
  if (compacto) return <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.5, '@media (max-width: 359px)': { gridTemplateColumns: '1fr' } }}>
    <Paper variant="outlined" sx={{ p: 1.5 }}><Stack spacing={1}><Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}><IconoCatalogo identificador="account_balance_wallet" contenedor /><Typography>Mi dinero</Typography></Stack>{datos?.totales.map(/** Presenta patrimonio actual de una divisa sin confundirlo con resultado. */ function total(registro) { return <Typography key={registro.moneda} sx={{ fontSize: 20, fontWeight: 700, overflowWrap: 'anywhere' }}>{importe(registro.saldoCentavos, registro.moneda)}</Typography>; })}<Typography variant="caption" color="text.secondary">Saldo actual en billeteras</Typography><Button onClick={alAbrir} endIcon={<ChevronRight />}>Ver billeteras</Button></Stack></Paper>
    <Paper variant="outlined" sx={{ p: 1.5 }}><Stack spacing={1}><Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}><IconoCatalogo identificador="swap_horiz" contenedor /><Typography>Movimientos internos</Typography></Stack>{datos?.totales.map(/** Conserva las tres magnitudes internas separadas por moneda. */ function internos(registro) { return <Box key={registro.moneda}><Typography variant="body2">Transferencias: {importe(registro.transferenciasCentavos, registro.moneda)}</Typography><Typography variant="caption" sx={{ display: 'block', color: 'secondary.main' }}>Ajustes +: {importe(registro.ajustesPositivosCentavos, registro.moneda)}<br />Ajustes −: {importe(registro.ajustesNegativosCentavos, registro.moneda)}</Typography></Box>; })}<Typography variant="caption" color="text.secondary">Del período; excluidos de la ganancia</Typography><Button onClick={alAbrir} endIcon={<ChevronRight />}>Ver detalle</Button></Stack></Paper>
    {!datos && !error && <CircularProgress aria-label="Consultando patrimonio" />}{error && <Alert severity="error" sx={{ gridColumn: '1 / -1' }}>{error}</Alert>}
  </Box>;
  return <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={2}><Typography variant="h6">Mi patrimonio actual</Typography><Typography color="text.secondary">El patrimonio refleja todos los movimientos registrados. Las transferencias y ajustes del período se muestran separados del resultado.</Typography>{error && <Alert severity="error">{error}</Alert>}
    {!datos && !error && <CircularProgress aria-label="Consultando patrimonio" />}
    {datos?.totales.map(/** Presenta cada divisa sin mezclar resultado y patrimonio. */ function presentar(total) { return <TarjetaResumen key={total.moneda} titulo={`Patrimonio líquido · ${total.moneda}`} valor={importe(total.saldoCentavos, total.moneda)} />; })}
    {datos?.billeteras.map(/** Abre el detalle de la identidad consultada sin reconstruir movimientos desde preferencias. */ function presentar({ billetera, saldoCentavos }) { return <Button key={billetera.id} component="a" href={`#/billetera?id=${billetera.id}`} sx={{ justifyContent: 'flex-start', gap: 1, minHeight: 64, borderBottom: '1px solid', borderColor: 'divider' }}><IconoCatalogo identificador={billetera.icono} color={billetera.color} contenedor /><Box sx={{ flex: 1, minWidth: 0, textAlign: 'left', color: 'text.primary', overflowWrap: 'anywhere' }}>{billetera.nombre}<Typography component="span" sx={{ display: 'block', fontWeight: 700 }}>{importe(saldoCentavos, billetera.moneda)}</Typography></Box><ChevronRight /></Button>; })}
    <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={1}><Typography variant="subtitle1">Transferencias y ajustes del período</Typography><Typography variant="body2" color="text.secondary">Movimientos internos excluidos de la ganancia neta.</Typography>{datos?.totales.map(/** Conserva las agregaciones patrimoniales en un bloque independiente del resultado. */ function internos(total) { return <Stack key={total.moneda}><Typography>Transferencias · {total.moneda}: {importe(total.transferenciasCentavos, total.moneda)}</Typography><Typography>Ajustes positivos: {importe(total.ajustesPositivosCentavos, total.moneda)}</Typography><Typography>Ajustes negativos: {importe(total.ajustesNegativosCentavos, total.moneda)}</Typography></Stack>; })}</Stack></Paper>
  </Stack></Paper>;
}
