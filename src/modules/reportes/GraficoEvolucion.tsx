import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { PuntoEvolucion } from '../../core/services/ServicioPanelReportes';
import { crearImporte } from '../../core/money/Importe';
import { formatearImporte } from '../../shared/money/formatearImporte';

/** Dibuja coordenadas de agregados mensuales, con valores exactos disponibles en texto. */
export function GraficoEvolucion({ puntos, modo = 'resumen' }: { puntos: readonly PuntoEvolucion[]; modo?: 'resumen' | 'ingresos' | 'gastos' }) {
  const tema = useTheme();
  const titulo = modo === 'resumen' ? 'Evolución mensual' : `Evolución de ${modo}`;
  const monedas = [...new Set(puntos.map(/** Obtiene divisas sin mezclarlas en el gráfico. */ function moneda(punto) { return punto.moneda; }))];
  /** Formatea importes reales sin redondear las cifras accesibles. */
  function dinero(centavos: number, moneda: string) { return formatearImporte(crearImporte(centavos, moneda)); }
  /** Dibuja una escala independiente para cada moneda, incluida la ganancia negativa. */
  function grafico(moneda: string) {
    const datos = puntos.filter(/** Mantiene una sola divisa en cada escala. */ function seleccionar(punto) { return punto.moneda === moneda; });
    const valores = datos.flatMap(/** Determina la extensión visual, sin alterar importes financieros. */ function valores(punto) { return modo === 'ingresos' ? [punto.ingresosCentavos] : modo === 'gastos' ? [punto.gastosCentavos] : [punto.ingresosCentavos, punto.gastosCentavos, punto.gananciaCentavos]; });
    const minimo = Math.min(0, ...valores); const maximo = Math.max(1, ...valores);
    /** Transforma un valor real a coordenada visual con línea cero explícita. */
    function altura(valor: number) { return 180 - (valor - minimo) / (maximo - minimo) * 150; }
    /** Prepara etiquetas locales de los meses sin cambiar fechas de negocio. */
    function mes(valor: string) { return new Date(`${valor}-01T12:00:00`).toLocaleDateString('es-AR', { month: 'short' }); }
    return <Box key={moneda}><Typography variant="body2" color="text.secondary" sx={{ fontSize: 11 }}>{moneda} · {datos[0]?.mes} — {datos.at(-1)?.mes}</Typography>
      <Stack direction="row" useFlexGap sx={{ display: modo === 'resumen' ? 'flex' : 'none', flexWrap: 'wrap', gap: 1.5, my: 1 }}>
        {modo !== 'gastos' && <Typography variant="caption" sx={{ color: 'success.main' }}>● Ingresos</Typography>}{modo !== 'ingresos' && <Typography variant="caption" sx={{ color: 'error.main' }}>● Gastos</Typography>}{modo === 'resumen' && <Typography variant="caption" sx={{ color: 'primary.main' }}>— Ganancia neta</Typography>}
      </Stack>
      <Box component="svg" viewBox="0 0 460 225" role="img" aria-label={`${titulo}, ${moneda}. Seis meses hasta el fin seleccionado. Valores exactos en el detalle mensual.`} sx={{ width: '100%', height: 'auto', display: 'block' }}>
        {[0, 1, 2, 3].map(/** Rotula cada línea con su valor real para interpretar la escala monetaria. */ function marca(indice) { const valor = minimo + (maximo - minimo) * indice / 3; const y = altura(valor); return <g key={indice}><line x1="60" x2="455" y1={y} y2={y} stroke={tema.palette.divider} /><text x="54" y={y + 4} textAnchor="end" fill={tema.palette.text.secondary} fontSize="13">{new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 }).format(valor / 100)}</text></g>; })}
        <line x1="60" x2="455" y1={altura(0)} y2={altura(0)} stroke={tema.palette.divider} />
        {datos.map(/** Presenta barras de entrada/salida desde cero y etiquetas de mes. */ function barra(punto, indice) {
          const x = 70 + indice * 65;
          return <g key={punto.mes}><title>{mes(punto.mes)}: ingresos {dinero(punto.ingresosCentavos, moneda)}, gastos {dinero(punto.gastosCentavos, moneda)}, ganancia {dinero(punto.gananciaCentavos, moneda)}</title>
            {modo !== 'gastos' && <rect x={x} y={altura(punto.ingresosCentavos)} width={modo === 'resumen' ? 16 : 30} height={altura(0) - altura(punto.ingresosCentavos)} rx="3" fill={tema.palette.success.main} />}
            {modo !== 'ingresos' && <rect x={x + (modo === 'resumen' ? 20 : 0)} y={altura(punto.gastosCentavos)} width={modo === 'resumen' ? 16 : 30} height={altura(0) - altura(punto.gastosCentavos)} rx="3" fill={tema.palette.error.main} />}
            <text x={x + 16} y="212" textAnchor="middle" fill={tema.palette.text.secondary} fontSize="18">{mes(punto.mes)}</text>
          </g>;
        })}
        {modo === 'resumen' && <><polyline fill="none" stroke={tema.palette.primary.main} strokeWidth="3" points={datos.map(/** Une ganancias positivas o negativas sin truncarlas a cero. */ function punto(punto, indice) { return `${86 + indice * 65},${altura(punto.gananciaCentavos)}`; }).join(' ')} />{datos.map(/** Marca cada ganancia con su valor accesible. */ function punto(punto, indice) { return <circle key={punto.mes} cx={86 + indice * 65} cy={altura(punto.gananciaCentavos)} r="4" fill={tema.palette.background.paper} stroke={tema.palette.primary.main} strokeWidth="2" />; })}</>}
      </Box>
      <details><summary style={{ fontSize: 12, cursor: 'pointer' }}>Ver valores exactos · {moneda}</summary><Stack spacing={1} sx={{ pt: 1 }}>{datos.map(/** Ofrece una alternativa textual completa al gráfico. */ function fila(punto) { return <Typography key={punto.mes} variant="body2">{punto.mes}: {modo !== 'gastos' && `Ingresos ${dinero(punto.ingresosCentavos, moneda)}`}{modo === 'resumen' && ' · '}{modo !== 'ingresos' && `Gastos ${dinero(punto.gastosCentavos, moneda)}`}{modo === 'resumen' && ` · Neto ${dinero(punto.gananciaCentavos, moneda)}`}</Typography>; })}</Stack></details>
    </Box>;
  }
  return <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={1}><Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}><Typography variant="h6">{titulo}</Typography>{modo !== 'resumen' && <Typography variant="caption" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', px: 1, py: 0.5 }}>Mensual</Typography>}</Stack>{monedas.map(grafico)}</Stack></Paper>;
}
