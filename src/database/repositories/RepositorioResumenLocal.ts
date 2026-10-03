import { RangoConsulta } from '../contracts/RangoConsulta';
import type { RepositorioResumen, ResumenPeriodo, ResumenMoneda, DesgloseResumen } from '../../core/repositories/RepositorioResumen';
import type { MovimientoBilletera } from '../../core/entities/MovimientoBilletera';
import { baseLocal, prepararBaseLocal } from '../componerBaseLocal';
import { convertirEntidad } from '../contracts/convertirRegistros';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';
import { convertirSaldo } from './consultasSaldo';
import { rangoFechas } from './consultasDatos';

/** Agrega en persistencia los resultados por moneda y conserva solo cinco movimientos recientes. */
export class RepositorioResumenLocal implements RepositorioResumen {
  /** Consulta ingresos y gastos con sus índices de fecha dentro de una instantánea única. */
  async consultar(desde: string, hasta: string): Promise<ResumenPeriodo> {
    await prepararBaseLocal();
    /** Suma centavos mediante BigInt y limita la memoria de los movimientos al tamaño solicitado. */
    async function leer(contexto: ContextoDatos) {
      const importes = new Map<string, { ingresos: bigint; gastos: bigint }>();
      const grupos = new Map<string, { id: string; nombre: string; tipo: DesgloseResumen['tipo']; moneda: string; ingresos: bigint; gastos: bigint }>();
      /** Acumula un grupo con importes exactos sin almacenar las operaciones individuales. */
      async function agrupar(tipo: DesgloseResumen['tipo'], id: string, moneda: string, importe: bigint, operacion: 'ingresos' | 'gastos') {
        const clave = `${tipo}/${id}/${moneda}`;
        let grupo = grupos.get(clave);
        if (!grupo) {
          const catalogo = id ? await contexto.obtener(tipo === 'actividad' ? 'actividades' : tipo === 'medio' ? 'medios_pago' : 'categorias_gasto', id) : null;
          grupo = { id, nombre: String(catalogo?.nombre ?? 'Sin actividad'), tipo, moneda, ingresos: 0n, gastos: 0n }; grupos.set(clave, grupo);
        }
        grupo[operacion] += importe;
      }
      for (const tabla of ['ingresos', 'gastos'] as const) {
        /** Acumula exclusivamente operaciones vigentes, separando monedas. */
        async function agregar(registro: RegistroDatos) {
          if (registro.eliminado_en !== null) return;
          const moneda = String(registro.moneda); const total = importes.get(moneda) ?? { ingresos: 0n, gastos: 0n };
          total[tabla] += BigInt(Number(registro.total_centavos)); importes.set(moneda, total);
          await desglosar(registro);
        }
        /** Lee cada operación del índice y agrega sus grupos sin acumular el historial en memoria. */
        async function desglosar(registro: RegistroDatos) {
          if (registro.eliminado_en !== null) return;
          const id = String(registro.id);
          const moneda = String(registro.moneda); const total = BigInt(Number(registro.total_centavos));
          await agrupar('actividad', String(registro.actividad_id ?? ''), moneda, total, tabla);
          if (tabla === 'gastos') await agrupar('categoria', String(registro.categoria_id), moneda, total, tabla);
          const medios = new Map<string, bigint>();
          /** Agrupa los detalles del padre consultado mediante su índice de referencia. */
          function agregarMedio(detalle: RegistroDatos) { if (detalle.eliminado_en === null) { const medio = String(detalle.medio_pago_id); medios.set(medio, (medios.get(medio) ?? 0n) + BigInt(Number(detalle.importe_centavos))); } }
          await contexto.recorrer(tabla === 'ingresos' ? 'ingresos_medios_pago' : 'gastos_medios_pago', agregarMedio, tabla === 'ingresos' ? 'por_ingreso' : 'por_gasto', RangoConsulta.unico(id));
          for (const [medio, importe] of medios) await agrupar('medio', medio, moneda, importe, tabla);
        }
        await contexto.recorrerAsincrono(tabla, agregar, 'por_fecha', rangoFechas(desde, hasta));
      }
      const totales: ResumenMoneda[] = [];
      for (const [moneda, total] of importes) totales.push({ moneda, ingresosCentavos: convertirSaldo(total.ingresos), gastosCentavos: convertirSaldo(total.gastos), gananciaCentavos: convertirSaldo(total.ingresos - total.gastos) });
      if (!totales.length) totales.push({ moneda: 'ARS', ingresosCentavos: 0, gastosCentavos: 0, gananciaCentavos: 0 });
      const movimientos: MovimientoBilletera[] = [];
      /** Ordena movimientos por fecha descendente y UUID para resolver empates de forma estable. */
      function ordenar(a: MovimientoBilletera, b: MovimientoBilletera) { return b.fecha.localeCompare(a.fecha) || a.id.localeCompare(b.id); }
      /** Conserva solo los cinco candidatos más recientes, sin cargar el historial completo. */
      function reciente(registro: RegistroDatos) {
        if (registro.eliminado_en !== null) return;
        movimientos.push(convertirEntidad<MovimientoBilletera>(registro)); movimientos.sort(ordenar); if (movimientos.length > 5) movimientos.pop();
      }
      await contexto.recorrer('movimientos_billetera', reciente);
      const desgloses: DesgloseResumen[] = [];
      /** Incluye actividades sin operaciones en el período para que su rentabilidad también sea visible. */
      function incluirActividad(registro: RegistroDatos) {
        if (registro.eliminado_en !== null) return;
        const id = String(registro.id);
        for (const grupo of grupos.values()) if (grupo.tipo === 'actividad' && grupo.id === id) return;
        grupos.set(`actividad/${id}/ARS`, { id, nombre: String(registro.nombre), tipo: 'actividad', moneda: 'ARS', ingresos: 0n, gastos: 0n });
      }
      await contexto.recorrer('actividades', incluirActividad);
      for (const grupo of grupos.values()) desgloses.push({ id: grupo.id, nombre: grupo.nombre, tipo: grupo.tipo, moneda: grupo.moneda, ingresosCentavos: convertirSaldo(grupo.ingresos), gastosCentavos: convertirSaldo(grupo.gastos), gananciaCentavos: convertirSaldo(grupo.ingresos - grupo.gastos) });
      return { totales, movimientos, desgloses };
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['ingresos', 'gastos', 'movimientos_billetera', 'ingresos_medios_pago', 'gastos_medios_pago', 'actividades', 'categorias_gasto', 'medios_pago'], modo: 'lectura' }, leer);
  }
}
