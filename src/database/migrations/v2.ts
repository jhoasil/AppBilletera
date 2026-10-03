import type { MigracionBaseLocal } from '../contracts/AdaptadorBaseLocal';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';
import type { ContextoMigracionEsquema } from './EsquemaBaseDatos';
import { RangoConsulta } from '../contracts/RangoConsulta';
import { migracionInicial } from './v1';

/** Relaciona únicamente pares inequívocos de movimiento y detalle; conserva las ambigüedades como legado. */
export async function alinearModeloFinanciero(contexto: Pick<ContextoDatos, 'recorrer' | 'recorrerAsincrono' | 'guardar'>): Promise<void> {
  /** Convierte cada referencia anterior sin cambiar UUID, centavos, fechas ni auditoría. */
  async function actualizar(movimiento: RegistroDatos): Promise<void> {
    const anterior = movimiento.referencia_tipo;
    if (anterior === 'transferencia' || anterior === 'ajuste') {
      let coincidencias = 0;
      /** Conserva como legado referencias repetidas en lugar de descartar movimientos existentes. */
      function contar(otro: RegistroDatos): void { if (otro.tipo === movimiento.tipo && otro.eliminado_en === movimiento.eliminado_en) coincidencias++; }
      await contexto.recorrer('movimientos_billetera', contar, 'por_referencia', RangoConsulta.unico([anterior, String(movimiento.referencia_id)]));
      if (coincidencias !== 1) return;
      await contexto.guardar('movimientos_billetera', { ...movimiento, referencia_tipo: anterior === 'transferencia' ? 'TRANSFERENCIA' : 'AJUSTE' });
      return;
    }
    if (anterior !== 'ingreso' && anterior !== 'gasto') return;
    const tabla = anterior === 'ingreso' ? 'ingresos_medios_pago' : 'gastos_medios_pago';
    const candidatos: RegistroDatos[] = [];
    /** Exige coincidencia histórica exacta; nunca utiliza la billetera predeterminada actual. */
    function seleccionar(detalle: RegistroDatos): void {
      if (detalle.billetera_id === movimiento.billetera_id &&
          detalle.importe_centavos === Math.abs(Number(movimiento.importe_centavos)) &&
          detalle.creado_en === movimiento.creado_en && detalle.eliminado_en === movimiento.eliminado_en) candidatos.push(detalle);
    }
    await contexto.recorrer(tabla, seleccionar, anterior === 'ingreso' ? 'por_ingreso' : 'por_gasto', RangoConsulta.unico(String(movimiento.referencia_id)));
    if (candidatos.length !== 1) return;
    let coincidencias = 0;
    /** Descarta vínculos ambiguos cuando varios movimientos podrían proceder del mismo detalle. */
    function contar(otro: RegistroDatos): void {
      if (otro.tipo === movimiento.tipo && otro.billetera_id === movimiento.billetera_id && otro.importe_centavos === movimiento.importe_centavos && otro.creado_en === movimiento.creado_en && otro.eliminado_en === movimiento.eliminado_en) coincidencias++;
    }
    await contexto.recorrer('movimientos_billetera', contar, 'por_referencia', RangoConsulta.unico([String(anterior), String(movimiento.referencia_id)]));
    if (coincidencias !== 1) return;
    await contexto.guardar('movimientos_billetera', { ...movimiento, referencia_tipo: anterior === 'ingreso' ? 'INGRESO_MEDIO_PAGO' : 'GASTO_MEDIO_PAGO', referencia_id: candidatos[0]!.id });
  }
  await contexto.recorrerAsincrono('movimientos_billetera', actualizar);
}

/** Delega la transformación al contexto transaccional del motor, sin modificar la migración distribuida V1. */
function aplicar(contexto: ContextoMigracionEsquema): Promise<void> { return contexto.alinearModeloFinanciero(); }

/** V2 modifica datos y versión atómicamente; la estructura física conserva el legado autorizado. */
export const migracionFinanciera: MigracionBaseLocal<ContextoMigracionEsquema> = {
  version: 2, descripcion: 'Alinea referencias financieras y conserva legado pendiente de revisión.', aplicar,
};

/** Plan consecutivo utilizado para instalaciones existentes y nuevas. */
export const migracionesBaseLocal = [migracionInicial, migracionFinanciera] as const;
