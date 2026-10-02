import type { MigracionBaseLocal } from '../contratos/AdaptadorBaseLocal';
import type { ContextoMigracionEsquema, DefinicionColumna, DefinicionTabla, NombreTabla } from './EsquemaBaseDatos';

/** Campos comunes: UUID como id y auditoría UTC, con borrado exclusivamente lógico. */
const columnasAuditadas: readonly DefinicionColumna[] = [
  { nombre: 'id', tipo: 'uuid', clavePrimaria: true },
  { nombre: 'creado_en', tipo: 'instante' },
  { nombre: 'actualizado_en', tipo: 'instante' },
  { nombre: 'eliminado_en', tipo: 'instante', permiteNulo: true },
];

/** Define una FK UUID hacia id, sin borrar en cascada sus registros históricos. */
function referencia(nombre: string, tabla: NombreTabla, permiteNulo = false): DefinicionColumna {
  return { nombre, tipo: 'uuid', referencia: tabla, permiteNulo };
}

/** Define centavos como enteros seguros; los signos específicos dependen de cada operación. */
function centavos(nombre: string, minimo = -Number.MAX_SAFE_INTEGER): DefinicionColumna {
  return { nombre, tipo: 'entero', minimo, maximo: Number.MAX_SAFE_INTEGER };
}

/** Tabla actividades: fuentes de ingresos y trabajos, con fechas y estado; referenciada por ingresos y gastos. */
const actividades: DefinicionTabla = {
  nombre: 'actividades', descripcion: 'Fuentes de ingresos y trabajos fijos o temporales.',
  columnas: [...columnasAuditadas,
    { nombre: 'nombre', tipo: 'texto' }, { nombre: 'tipo', tipo: 'texto' },
    { nombre: 'descripcion', tipo: 'texto', permiteNulo: true },
    { nombre: 'icono', tipo: 'texto', permiteNulo: true }, { nombre: 'color', tipo: 'texto', permiteNulo: true },
    { nombre: 'fecha_inicio', tipo: 'fecha', permiteNulo: true }, { nombre: 'fecha_fin', tipo: 'fecha', permiteNulo: true },
    { nombre: 'estado', tipo: 'texto', valoresPermitidos: ['activo', 'finalizado', 'archivado'] },
    { nombre: 'activo', tipo: 'booleano' },
  ],
};

/** Tabla categorias_gasto: clasificaciones editables que permanecen disponibles en gastos históricos. */
const categoriasGasto: DefinicionTabla = {
  nombre: 'categorias_gasto', descripcion: 'Catálogo de clasificación de gastos.',
  columnas: [...columnasAuditadas,
    { nombre: 'nombre', tipo: 'texto' }, { nombre: 'icono', tipo: 'texto', permiteNulo: true },
    { nombre: 'color', tipo: 'texto', permiteNulo: true }, { nombre: 'activo', tipo: 'booleano' },
  ],
};

/** Tabla billeteras: ubicación y moneda del dinero; no almacena un saldo editable ni cachés todavía. */
const billeteras: DefinicionTabla = {
  nombre: 'billeteras', descripcion: 'Ubicaciones del dinero con moneda y última conciliación.',
  columnas: [...columnasAuditadas,
    { nombre: 'nombre', tipo: 'texto' }, { nombre: 'tipo', tipo: 'texto' },
    { nombre: 'icono', tipo: 'texto', permiteNulo: true }, { nombre: 'color', tipo: 'texto', permiteNulo: true },
    { nombre: 'moneda', tipo: 'moneda' }, { nombre: 'activo', tipo: 'booleano' },
    { nombre: 'conciliado_en', tipo: 'instante', permiteNulo: true },
  ],
};

/** Tabla medios_pago: formas de pago o cobro y sus preferencias, con una billetera sugerida opcional. */
const mediosPago: DefinicionTabla = {
  nombre: 'medios_pago', descripcion: 'Catálogo de medios de pago y preferencias de carga rápida.',
  columnas: [...columnasAuditadas,
    { nombre: 'nombre', tipo: 'texto' }, { nombre: 'icono', tipo: 'texto', permiteNulo: true },
    { nombre: 'color', tipo: 'texto', permiteNulo: true }, { nombre: 'mostrar_en_carga_rapida', tipo: 'booleano' },
    { nombre: 'orden', tipo: 'entero', minimo: 0, maximo: Number.MAX_SAFE_INTEGER },
    referencia('billetera_predeterminada_id', 'billeteras', true), { nombre: 'activo', tipo: 'booleano' },
  ],
};

/** Tabla ingresos: cabecera por actividad; su total positivo se distribuye en ingresos_medios_pago. */
const ingresos: DefinicionTabla = {
  nombre: 'ingresos', descripcion: 'Ingresos asociados a una actividad, con total y moneda.',
  columnas: [...columnasAuditadas, referencia('actividad_id', 'actividades'),
    { nombre: 'fecha', tipo: 'fecha' }, { nombre: 'descripcion', tipo: 'texto', permiteNulo: true },
    { nombre: 'observaciones', tipo: 'texto', permiteNulo: true }, { nombre: 'moneda', tipo: 'moneda' },
    centavos('importe_centavos', 1),
  ],
};

/** Tabla ingresos_medios_pago: detalles positivos por medio y destino real; heredan la moneda del ingreso. */
const ingresosMediosPago: DefinicionTabla = {
  nombre: 'ingresos_medios_pago', descripcion: 'Distribución de cobros por medio y billetera.',
  columnas: [...columnasAuditadas, referencia('ingreso_id', 'ingresos'), referencia('medio_pago_id', 'medios_pago'),
    referencia('billetera_id', 'billeteras', true), centavos('importe_centavos', 1)],
};

/** Tabla gastos: cabecera con categoría y actividad opcional; su total positivo se distribuye en detalles. */
const gastos: DefinicionTabla = {
  nombre: 'gastos', descripcion: 'Gastos por categoría, con actividad opcional, total y moneda.',
  columnas: [...columnasAuditadas, referencia('categoria_id', 'categorias_gasto'), referencia('actividad_id', 'actividades', true),
    { nombre: 'fecha', tipo: 'fecha' }, { nombre: 'descripcion', tipo: 'texto' },
    { nombre: 'observaciones', tipo: 'texto', permiteNulo: true }, { nombre: 'moneda', tipo: 'moneda' },
    centavos('importe_centavos', 1),
  ],
};

/** Tabla gastos_medios_pago: detalles positivos de pagos; generan movimientos negativos si tienen billetera. */
const gastosMediosPago: DefinicionTabla = {
  nombre: 'gastos_medios_pago', descripcion: 'Distribución de pagos por medio y billetera.',
  columnas: [...columnasAuditadas, referencia('gasto_id', 'gastos'), referencia('medio_pago_id', 'medios_pago'),
    referencia('billetera_id', 'billeteras', true), centavos('importe_centavos', 1)],
};

/** Tabla transferencias_billeteras: operación interna entre billeteras distintas, sin impacto en el resultado. */
const transferenciasBilleteras: DefinicionTabla = {
  nombre: 'transferencias_billeteras', descripcion: 'Transferencias internas de la misma moneda.',
  columnas: [...columnasAuditadas, referencia('billetera_origen_id', 'billeteras'), referencia('billetera_destino_id', 'billeteras'),
    centavos('importe_centavos', 1), { nombre: 'moneda', tipo: 'moneda' },
    { nombre: 'fecha', tipo: 'fecha' }, { nombre: 'descripcion', tipo: 'texto', permiteNulo: true }],
  restricciones: [{ tipo: 'distintos', columnas: ['billetera_origen_id', 'billetera_destino_id'] }],
};

/** Tabla ajustes_billetera: conciliación con saldos y diferencia; origina un movimiento de ajuste independiente. */
const ajustesBilletera: DefinicionTabla = {
  nombre: 'ajustes_billetera', descripcion: 'Diferencias documentadas entre saldo calculado y real.',
  columnas: [...columnasAuditadas, referencia('billetera_id', 'billeteras'), { nombre: 'fecha', tipo: 'instante' },
    centavos('saldo_calculado_centavos'), centavos('saldo_real_centavos'),
    { ...centavos('diferencia_centavos'), distintoDeCero: true },
    { nombre: 'motivo', tipo: 'texto' }, { nombre: 'observaciones', tipo: 'texto', permiteNulo: true }],
  restricciones: [{ tipo: 'diferencia', resultado: 'diferencia_centavos', minuendo: 'saldo_real_centavos', sustraendo: 'saldo_calculado_centavos' }],
};

/**
 * Tabla movimientos_billetera: fuente de verdad del saldo, con centavos firmados y referencia polimórfica.
 * referencia_id es UUID de ingreso, gasto, transferencia o ajuste; no es una FK hacia una sola tabla.
 * Los saldos iniciales usan ambas referencias nulas; la consistencia de tipo y signo se valida en servicios.
 */
const movimientosBilletera: DefinicionTabla = {
  nombre: 'movimientos_billetera', descripcion: 'Entradas y salidas trazables que permiten reconstruir saldos.',
  columnas: [...columnasAuditadas, referencia('billetera_id', 'billeteras'),
    { nombre: 'tipo', tipo: 'texto', valoresPermitidos: ['SALDO_INICIAL', 'INGRESO', 'GASTO', 'TRANSFERENCIA_ENTRADA', 'TRANSFERENCIA_SALIDA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO'] },
    { nombre: 'referencia_tipo', tipo: 'texto', permiteNulo: true, valoresPermitidos: ['ingreso', 'gasto', 'transferencia', 'ajuste'] },
    { nombre: 'referencia_id', tipo: 'uuid', permiteNulo: true }, centavos('importe_centavos'),
    { nombre: 'fecha', tipo: 'instante' }, { nombre: 'descripcion', tipo: 'texto', permiteNulo: true }],
};

/** Orden de creación que resuelve las FK antes de crear tablas dependientes. */
export const tablasV1: readonly DefinicionTabla[] = [
  actividades, categoriasGasto, billeteras, mediosPago, ingresos, ingresosMediosPago,
  gastos, gastosMediosPago, transferenciasBilleteras, ajustesBilletera, movimientosBilletera,
];

/** Entrega el esquema completo al motor para crearlo dentro de su migración atómica. */
function aplicarEsquemaInicial(contexto: ContextoMigracionEsquema): void | Promise<void> {
  return contexto.crearTablas(tablasV1);
}

/** Migración V1 compartida; la confirmación y versión persistida pertenecen al adaptador. */
export const migracionInicial: MigracionBaseLocal<ContextoMigracionEsquema> = {
  version: 1,
  descripcion: 'Crea las once tablas iniciales de AppBilletera.',
  aplicar: aplicarEsquemaInicial,
};

/** Plan inicial para BaseLocal; los índices adicionales se incorporarán en la TAREA 011. */
export const migracionesBaseLocal: readonly MigracionBaseLocal<ContextoMigracionEsquema>[] = [migracionInicial];
