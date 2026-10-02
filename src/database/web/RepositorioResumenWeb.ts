import type { RepositorioResumen, ResumenPeriodo, ResumenMoneda } from '../../core/repositories/RepositorioResumen';
import type { MovimientoBilletera } from '../../core/entities/MovimientoBilletera';
import { baseWeb, prepararBaseWeb } from './baseWeb';
import { convertirEntidad, type ContextoWeb, type RegistroWeb } from './ContextoWeb';
import { convertirSaldo } from './consultasSaldoWeb';
import { rangoFechas } from './consultasWeb';

/** Agrega en persistencia los resultados por moneda y conserva solo cinco movimientos recientes. */
export class RepositorioResumenWeb implements RepositorioResumen {
  /** Consulta ingresos y gastos con sus índices de fecha dentro de una instantánea única. */
  async consultar(desde: string, hasta: string): Promise<ResumenPeriodo> {
    await prepararBaseWeb();
    /** Suma centavos mediante BigInt y limita la memoria de los movimientos al tamaño solicitado. */
    async function leer(contexto: ContextoWeb) {
      const importes = new Map<string, { ingresos: bigint; gastos: bigint }>();
      for (const tabla of ['ingresos', 'gastos'] as const) {
        /** Acumula exclusivamente operaciones vigentes, separando monedas. */
        function agregar(registro: RegistroWeb) {
          if (registro.eliminado_en !== null) return;
          const moneda = String(registro.moneda); const total = importes.get(moneda) ?? { ingresos: 0n, gastos: 0n };
          total[tabla] += BigInt(Number(registro.total_centavos)); importes.set(moneda, total);
        }
        await contexto.recorrer(tabla, agregar, 'por_fecha', rangoFechas(desde, hasta));
      }
      const totales: ResumenMoneda[] = [];
      for (const [moneda, total] of importes) totales.push({ moneda, ingresosCentavos: convertirSaldo(total.ingresos), gastosCentavos: convertirSaldo(total.gastos), gananciaCentavos: convertirSaldo(total.ingresos - total.gastos) });
      if (!totales.length) totales.push({ moneda: 'ARS', ingresosCentavos: 0, gastosCentavos: 0, gananciaCentavos: 0 });
      const movimientos: MovimientoBilletera[] = [];
      /** Ordena movimientos por fecha descendente y UUID para resolver empates de forma estable. */
      function ordenar(a: MovimientoBilletera, b: MovimientoBilletera) { return b.fecha.localeCompare(a.fecha) || a.id.localeCompare(b.id); }
      /** Conserva solo los cinco candidatos más recientes, sin cargar el historial completo. */
      function reciente(registro: RegistroWeb) {
        if (registro.eliminado_en !== null) return;
        movimientos.push(convertirEntidad<MovimientoBilletera>(registro)); movimientos.sort(ordenar); if (movimientos.length > 5) movimientos.pop();
      }
      await contexto.recorrer('movimientos_billetera', reciente);
      return { totales, movimientos };
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['ingresos', 'gastos', 'movimientos_billetera'], modo: 'lectura' }, leer);
  }
}
