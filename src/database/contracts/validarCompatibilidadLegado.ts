import type { ContextoDatos, RegistroDatos } from './ContextoDatos';
import type { NombreTabla } from '../migrations/EsquemaBaseDatos';

/** Admite legado existente o restaurado expresamente; impide nuevas operaciones sin billetera o con referencia de cabecera. */
export async function validarCompatibilidadLegado(contexto: Pick<ContextoDatos, 'obtener'>, tabla: NombreTabla, registro: RegistroDatos, preservarLegado: boolean): Promise<void> {
  const detalle = tabla === 'ingresos_medios_pago' || tabla === 'gastos_medios_pago';
  const referenciaAnterior = tabla === 'movimientos_billetera' && ['ingreso', 'gasto', 'transferencia', 'ajuste'].includes(String(registro.referencia_tipo));
  if ((!detalle || registro.billetera_id !== null) && !referenciaAnterior) return;
  if (preservarLegado) return; // Solo importación íntegramente validada, autorizada para conservar el legado.
  const anterior = await contexto.obtener(tabla, String(registro.id));
  const columnas = detalle ? ['ingreso_id', 'gasto_id', 'medio_pago_id', 'billetera_id', 'importe_centavos'] : ['referencia_tipo', 'referencia_id', 'tipo', 'billetera_id', 'importe_centavos'];
  if (!anterior || columnas.some(/** Impide modificar información financiera desconocida durante la conservación histórica. */ function diferente(columna) { return anterior[columna] !== registro[columna]; })) throw new Error('Las nuevas operaciones necesitan billetera real y referencia financiera vigente. El legado requiere revisión.');
}
