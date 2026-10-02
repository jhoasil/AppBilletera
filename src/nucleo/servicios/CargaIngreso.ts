/** Distribución de un importe positivo; no incluye líneas vacías ni auditoría de persistencia. */
export interface LineaCobro {
  medioPagoId: string;
  billeteraId: string | null;
  importeCentavos: number;
}

/** Datos de carga de ingreso independientes del formulario y de la plataforma. */
export interface CargaIngreso {
  actividadId: string;
  fecha: string;
  descripcion: string;
  observaciones: string;
  moneda: string;
  lineas: readonly LineaCobro[];
}
