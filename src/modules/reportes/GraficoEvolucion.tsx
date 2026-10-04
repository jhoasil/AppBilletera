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
    return <Box key={moneda}><Typography variant="body2" color="text.secondary">{moneda} · {datos[0]?.mes} — {datos.at(-1)?.mes}</Typography>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5, my: 1 }}>
        {modo !== 'gastos' && <Typography variant="caption" sx={{ color: 'success.main' }}>● Ingresos</Typography>}{modo !== 'ingresos' && <Typography variant="caption" sx={{ color: 'error.main' }}>● Gastos</Typography>}{modo === 'resumen' && <Typography variant="caption" sx={{ color: 'primary.main' }}>— Ganancia neta</Typography>}
      </Stack>
      <Box component="svg" viewBox="0 0 460 225" role="img" aria-label={`${titulo}, ${moneda}. Valores exactos en el detalle mensual.`} sx={{ width: '100%', height: 'auto', display: 'block' }}>
        <text x="45" y="20" fill={tema.palette.text.secondary} fontSize="16">Máx. {new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 }).format(maximo / 100)} {moneda}</text>
        {minimo < 0 && <text x="45" y="198" fill={tema.palette.text.secondary} fontSize="16">Mín. {new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 }).format(minimo / 100)}</text>}
        {[30, 80, 130, 180].map(/** Dibuja una retícula discreta independiente de las magnitudes. */ function linea(y) { return <line key={y} x1="45" x2="440" y1={y} y2={y} stroke={tema.palette.divider} />; })}
        <line x1="45" x2="440" y1={altura(0)} y2={altura(0)} stroke={tema.palette.text.secondary} />
        <text x="8" y={altura(0) + 4} fill={tema.palette.text.secondary} fontSize="16">0</text>
        {datos.map(/** Presenta barras de entrada/salida desde cero y etiquetas de mes. */ function barra(punto, indice) {
          const x = 55 + indice * 65;
          return <g key={punto.mes}><title>{mes(punto.mes)}: ingresos {dinero(punto.ingresosCentavos, moneda)}, gastos {dinero(punto.gastosCentavos, moneda)}, ganancia {dinero(punto.gananciaCentavos, moneda)}</title>
            {modo !== 'gastos' && <rect x={x} y={altura(punto.ingresosCentavos)} width={modo === 'resumen' ? 16 : 30} height={altura(0) - altura(punto.ingresosCentavos)} rx="3" fill={tema.palette.success.main} />}
            {modo !== 'ingresos' && <rect x={x + (modo === 'resumen' ? 20 : 0)} y={altura(punto.gastosCentavos)} width={modo === 'resumen' ? 16 : 30} height={altura(0) - altura(punto.gastosCentavos)} rx="3" fill={tema.palette.error.main} />}
            <text x={x + 16} y="212" textAnchor="middle" fill={tema.palette.text.secondary} fontSize="18">{mes(punto.mes)}</text>
          </g>;
        })}
        {modo === 'resumen' && <><polyline fill="none" stroke={tema.palette.primary.main} strokeWidth="3" points={datos.map(/** Une ganancias positivas o negativas sin truncarlas a cero. */ function punto(punto, indice) { return `${71 + indice * 65},${altura(punto.gananciaCentavos)}`; }).join(' ')} />{datos.map(/** Marca cada ganancia con su valor accesible. */ function punto(punto, indice) { return <circle key={punto.mes} cx={71 + indice * 65} cy={altura(punto.gananciaCentavos)} r="4" fill={tema.palette.background.paper} stroke={tema.palette.primary.main} strokeWidth="2" />; })}</>}
      </Box>
      <details><summary>Valores mensuales exactos · {moneda}</summary><Stack spacing={1} sx={{ pt: 1 }}>{datos.map(/** Ofrece una alternativa textual completa al gráfico. */ function fila(punto) { return <Typography key={punto.mes} variant="body2">{punto.mes}: {modo !== 'gastos' && `Ingresos ${dinero(punto.ingresosCentavos, moneda)}`}{modo === 'resumen' && ' · '}{modo !== 'ingresos' && `Gastos ${dinero(punto.gastosCentavos, moneda)}`}{modo === 'resumen' && ` · Neto ${dinero(punto.gananciaCentavos, moneda)}`}</Typography>; })}</Stack></details>
    </Box>;
  }
  return <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={1}><Typography variant="h6">{titulo}</Typography><Typography variant="caption" color="text.secondary">Seis meses de calendario hasta el mes de fin seleccionado.</Typography>{monedas.map(grafico)}</Stack></Paper>;
}
