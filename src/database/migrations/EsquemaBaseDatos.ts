/** Tablas de negocio incluidas en el esquema V1. */
export type NombreTabla =
  | 'actividades' | 'medios_pago' | 'categorias_gasto' | 'billeteras'
  | 'ingresos' | 'ingresos_medios_pago' | 'gastos' | 'gastos_medios_pago'
  | 'transferencias_billeteras' | 'movimientos_billetera' | 'ajustes_billetera';

/** Columna declarativa; los adaptadores traducen sus restricciones al motor correspondiente. */
export interface DefinicionColumna {
  readonly nombre: string;
  readonly tipo: 'uuid' | 'texto' | 'entero' | 'booleano' | 'fecha' | 'instante' | 'moneda';
  readonly permiteNulo?: boolean;
  readonly clavePrimaria?: boolean;
  /** Referencia a id; impedir borrado físico de registros referenciados, sin cascadas. */
  readonly referencia?: NombreTabla;
  readonly valoresPermitidos?: readonly string[];
  readonly minimo?: number;
  readonly maximo?: number;
  readonly distintoDeCero?: boolean;
}

/** Restricciones entre columnas que también deberán respetarse en IndexedDB. */
export type RestriccionTabla =
  | { readonly tipo: 'distintos'; readonly columnas: readonly [string, string] }
  | { readonly tipo: 'diferencia'; readonly resultado: string; readonly minuendo: string; readonly sustraendo: string };

/** Índice no único para consultas por igualdad o rango, con su motivo documentado. */
export interface DefinicionIndice {
  readonly nombre: string;
  readonly columnas: readonly string[];
  readonly motivo: string;
}

/** Tabla con identidad única id e índices declarativos compartidos por ambos motores. */
export interface DefinicionTabla {
  readonly nombre: NombreTabla;
  readonly descripcion: string;
  readonly columnas: readonly DefinicionColumna[];
  readonly restricciones?: readonly RestriccionTabla[];
  readonly indices?: readonly DefinicionIndice[];
}

/** Contexto que crea el esquema dentro de la transacción de migración del adaptador. */
export interface ContextoMigracionEsquema {
  /** Crea el conjunto de tablas en orden y aplica restricciones, sin confirmar por separado. */
  crearTablas(tablas: readonly DefinicionTabla[]): void | Promise<void>;
  /** Actualiza referencias históricas inequívocas sin inventar billeteras ni eliminar datos. */
  alinearModeloFinanciero(): Promise<void>;
}
