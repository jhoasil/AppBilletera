import type { ServicioResumen } from './ServicioResumen';
import type { ServicioIngresos } from './ServicioIngresos';
import type { ServicioGastos } from './ServicioGastos';
import { fechaCalendario } from './periodoReporte';
import { crearImporte, restarImportes } from '../money/Importe';

/** Punto mensual agregado por moneda, independiente del rango de las tarjetas del panel. */
export interface PuntoEvolucion { mes: string; moneda: string; ingresosCentavos: number; gastosCentavos: number; gananciaCentavos: number }

/** Obtiene la base inmediatamente anterior: calendario para mes/año, duración equivalente para otros rangos. */
export function periodoAnterior(desde: string, hasta: string, tipo: string) {
  const inicio = new Date(`${desde}T12:00:00Z`); const fin = new Date(`${hasta}T12:00:00Z`);
  if (tipo === 'Mes' || tipo === 'Año') {
    const ano = inicio.getUTCFullYear() - (tipo === 'Año' ? 1 : 0); const mes = tipo === 'Año' ? 0 : inicio.getUTCMonth() - 1;
    return { desde: fechaCalendario(new Date(ano, mes, 1)), hasta: fechaCalendario(new Date(ano, tipo === 'Año' ? 12 : mes + 1, 0)) };
  }
  const dias = Math.round((fin.getTime() - inicio.getTime()) / 86400000) + 1;
  return { desde: new Date(inicio.getTime() - dias * 86400000).toISOString().slice(0, 10), hasta: new Date(inicio.getTime() - 86400000).toISOString().slice(0, 10) };
}

/** Compara importes exactos; una base no positiva no admite porcentaje interpretable. */
export function variacionReporte(actual: number, anterior: number): number | null {
  if (anterior <= 0) return null;
  const diferencia = BigInt(actual) - BigInt(anterior);
  return Number(diferencia * 1000n / BigInt(anterior)) / 10;
}

/** Prepara datos agregados para las vistas del panel sin exponer repositorios físicos a React. */
export class ServicioPanelReportes {
  /** Reutiliza los servicios de lectura y mantiene las escrituras fuera de esta consulta. */
  constructor(private readonly resumen: ServicioResumen, private readonly ingresos: ServicioIngresos, private readonly gastos: ServicioGastos) {}

  /** Consulta resultado, base comparable y seis meses de evolución sin materializar operaciones históricas. */
  async consultar(desde: string, hasta: string, tipo: string) {
    // Validar antes de construir fechas derivadas o iniciar lecturas auxiliares.
    const lecturaActual = this.resumen.consultar(desde, hasta);
    const anterior = periodoAnterior(desde, hasta, tipo);
    const fin = new Date(`${hasta}T12:00:00`); const meses: string[] = [];
    for (let posicion = 5; posicion >= 0; posicion--) meses.push(fechaCalendario(new Date(fin.getFullYear(), fin.getMonth() - posicion, 1)).slice(0, 7));
    const consulta = { desde: `${meses[0]}-01`, hasta: fechaCalendario(new Date(fin.getFullYear(), fin.getMonth() + 1, 0)), limite: 1, desplazamiento: 0, resumir: true };
    const [actual, base, entradas, salidas] = await Promise.all([lecturaActual, this.resumen.consultar(anterior.desde, anterior.hasta), this.ingresos.listar(consulta), this.gastos.listar(consulta)]);
    const monedas = new Set([...actual.totales.map(/** Conserva identidades monetarias del resultado. */ function moneda(total) { return total.moneda; }), ...(entradas.resumen ?? []).map(/** Incluye monedas de la evolución real. */ function moneda(total) { return total.moneda; }), ...(salidas.resumen ?? []).map(/** Incluye monedas con gastos mensuales. */ function moneda(total) { return total.moneda; })]);
    const evolucion: PuntoEvolucion[] = [];
    for (const moneda of monedas) for (const mes of meses) {
      const ingresosCentavos = entradas.resumen?.find(/** Resuelve un subtotal de la misma moneda y mes. */ function seleccionar(total) { return total.mes === mes && total.moneda === moneda; })?.importeCentavos ?? 0;
      const gastosCentavos = salidas.resumen?.find(/** Resuelve un subtotal de la misma moneda y mes. */ function seleccionar(total) { return total.mes === mes && total.moneda === moneda; })?.importeCentavos ?? 0;
      evolucion.push({ mes, moneda, ingresosCentavos, gastosCentavos, gananciaCentavos: restarImportes(crearImporte(ingresosCentavos, moneda), crearImporte(gastosCentavos, moneda)).centavos });
    }
    return { actual, base, anterior, evolucion };
  }
}
