import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';
import { RangoConsulta } from '../contracts/RangoConsulta';
import { invalidarRegistros } from './invalidarRegistros';

/** Invalida los efectos de cada detalle y también referencias de legado, dentro de la misma transacción. */
export async function invalidarEfectosOperacion(contexto: ContextoDatos, tipo: 'ingreso' | 'gasto', id: string, instante: string): Promise<void> {
  const tabla = tipo === 'ingreso' ? 'ingresos_medios_pago' : 'gastos_medios_pago';
  // Incluye revisiones ya invalidadas: la cabecera nunca debe conservar efectos anteriores vigentes.
  /** Retira los movimientos cuyo origen es este detalle específico. */
  async function invalidar(detalle: RegistroDatos): Promise<void> {
    await invalidarRegistros(contexto, 'movimientos_billetera', 'por_referencia', RangoConsulta.unico([tipo === 'ingreso' ? 'INGRESO_MEDIO_PAGO' : 'GASTO_MEDIO_PAGO', String(detalle.id)]), instante);
  }
  await contexto.recorrerAsincrono(tabla, invalidar, tipo === 'ingreso' ? 'por_ingreso' : 'por_gasto', RangoConsulta.unico(id));
  await invalidarRegistros(contexto, 'movimientos_billetera', 'por_referencia', RangoConsulta.unico([tipo, id]), instante);
}
