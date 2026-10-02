import type { DefinicionIndice, NombreTabla } from './EsquemaBaseDatos';

/** Índices mínimos para consultas financieras y recuperación de detalles en transacciones. */
export const indicesV1: Partial<Record<NombreTabla, readonly DefinicionIndice[]>> = {
  movimientos_billetera: [
    { nombre: 'por_billetera_fecha', columnas: ['billetera_id', 'fecha'], motivo: 'Consultar movimientos y saldo por billetera y período.' },
    { nombre: 'por_referencia', columnas: ['referencia_tipo', 'referencia_id'], motivo: 'Localizar movimientos de una operación para editarla o invalidarla.' },
  ],
  ingresos: [
    { nombre: 'por_fecha', columnas: ['fecha'], motivo: 'Listar y agregar ingresos por período.' },
    { nombre: 'por_actividad_fecha', columnas: ['actividad_id', 'fecha'], motivo: 'Consultar ingresos y rentabilidad por actividad y período.' },
  ],
  gastos: [
    { nombre: 'por_fecha', columnas: ['fecha'], motivo: 'Listar y agregar gastos por período.' },
    { nombre: 'por_actividad_fecha', columnas: ['actividad_id', 'fecha'], motivo: 'Consultar gastos por actividad y período.' },
    { nombre: 'por_categoria_fecha', columnas: ['categoria_id', 'fecha'], motivo: 'Consultar desgloses de gastos por categoría y período.' },
  ],
  ingresos_medios_pago: [
    { nombre: 'por_ingreso', columnas: ['ingreso_id'], motivo: 'Recuperar o reemplazar detalles de un ingreso.' },
  ],
  gastos_medios_pago: [
    { nombre: 'por_gasto', columnas: ['gasto_id'], motivo: 'Recuperar o reemplazar detalles de un gasto.' },
  ],
};
