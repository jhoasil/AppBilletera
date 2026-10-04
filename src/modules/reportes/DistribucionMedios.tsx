import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { ResumenPeriodo } from '../../core/repositories/RepositorioResumen';
import { porcentajeReporte } from '../../core/services/porcentajeReporte';
import { crearImporte } from '../../core/money/Importe';
import { formatearImporte } from '../../shared/money/formatearImporte';

/** Presenta distribuciones reales por medio con leyenda exacta y denominador por moneda. */
export function DistribucionMedios({ datos, tipo }: { datos: ResumenPeriodo; tipo: 'ingresos' | 'gastos' }) {
  const tema = useTheme(); const colores = [tema.palette.success.main, tema.palette.primary.main, tema.palette.secondary.main, tema.palette.warning.main, tema.palette.info.main, tema.palette.text.secondary];
  const campo = tipo === 'ingresos' ? 'ingresosCentavos' : 'gastosCentavos';
  /** Formatea el importe completo de cada distribución. */
  function dinero(centavos: number, moneda: string) { return formatearImporte(crearImporte(centavos, moneda)); }
  return <Paper variant="outlined" sx={{ p: 2 }}><Typography variant="h6" sx={{ mb: 2 }}>{tipo === 'ingresos' ? 'Ingresos por medio de cobro' : 'Gastos por medio de pago'}</Typography>{datos.totales.map(/** Mantiene anillo y leyenda de una divisa separados de las demás. */ function moneda(total) {
    const filas = datos.desgloses.filter(/** Excluye medios sin participación positiva en esta magnitud. */ function seleccionar(fila) { return fila.tipo === 'medio' && fila.moneda === total.moneda && fila[campo] > 0; });
    let offset = 0;
    return <Box key={total.moneda} sx={{ mb: 2 }}><Typography variant="body2" color="text.secondary">{total.moneda} · porcentaje del {tipo === 'ingresos' ? 'ingreso' : 'gasto'} del período</Typography><Box sx={{ display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr)', alignItems: 'center', gap: 2, '@media (max-width: 429px)': { gridTemplateColumns: '1fr' } }}>
      <Box sx={{ position: 'relative', width: 150, height: 150, justifySelf: 'center', my: 1 }}><Box component="svg" viewBox="0 0 120 120" role="img" aria-label={`Distribución de ${tipo} por medio, ${total.moneda}; valores en la leyenda.`} sx={{ width: '100%', height: '100%' }}><circle cx="60" cy="60" r="48" fill="none" stroke={tema.palette.divider} strokeWidth="16" />{filas.map(/** Convierte proporciones ya calculadas en segmentos visuales del anillo. */ function segmento(fila, indice) { const porcentaje = porcentajeReporte(fila[campo], total[campo]); const inicio = offset; offset += porcentaje; return <circle key={fila.id} cx="60" cy="60" r="48" pathLength="100" fill="none" stroke={colores[indice % colores.length]} strokeWidth="16" strokeDasharray={`${porcentaje} ${100 - porcentaje}`} strokeDashoffset={-inicio} transform="rotate(-90 60 60)"><title>{fila.nombre}: {dinero(fila[campo], fila.moneda)} · {porcentaje}%</title></circle>; })}</Box><Stack sx={{ position: 'absolute', inset: 24, justifyContent: 'center', textAlign: 'center' }}><Typography sx={{ fontSize: 16, fontWeight: 700, overflowWrap: 'anywhere' }}>{dinero(total[campo], total.moneda)}</Typography><Typography variant="caption">Total</Typography></Stack></Box>
      <Stack spacing={1}>{!filas.length && <Typography color="text.secondary">Sin distribuciones en el período.</Typography>}{filas.map(/** Identifica cada segmento por nombre, importe y porcentaje además del color. */ function leyenda(fila, indice) { return <Stack key={fila.id} direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colores[indice % colores.length], flexShrink: 0 }} /><Typography variant="body2" sx={{ flex: 1 }}>{fila.nombre}</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{dinero(fila[campo], fila.moneda)}</Typography><Typography variant="caption" color="text.secondary">{porcentajeReporte(fila[campo], total[campo])}%</Typography></Stack>; })}</Stack>
    </Box></Box>;
  })}</Paper>;
}
