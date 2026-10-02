import type { ContextoWeb, RegistroWeb } from './ContextoWeb';

/** Valida paginación acotada antes de abrir una transacción de consulta. */
export function validarPagina(consulta: { limite: number; desplazamiento: number }): void {
  if (!Number.isSafeInteger(consulta.limite) || consulta.limite < 1 || consulta.limite > 100 || !Number.isSafeInteger(consulta.desplazamiento) || consulta.desplazamiento < 0) throw new Error('La paginación no es válida.');
}

/** Delimita un período inclusivo para aprovechar el índice de fecha. */
export function rangoFechas(desde?: string, hasta?: string): IDBKeyRange | undefined {
  if (desde && hasta && desde > hasta) throw new Error('El inicio del período no puede superar su fin.');
  if (desde && hasta) return IDBKeyRange.bound(desde, hasta);
  if (desde) return IDBKeyRange.lowerBound(desde);
  if (hasta) return IDBKeyRange.upperBound(hasta);
  return undefined;
}

/** Comprueba disponibilidad dentro de la escritura para impedir referencias obsoletas desde otra pestaña. */
export async function exigirCatalogoActivo(contexto: ContextoWeb, tabla: 'actividades' | 'medios_pago' | 'billeteras' | 'categorias_gasto', id: string, permitirHistorico = false): Promise<RegistroWeb> {
  const registro = await contexto.obtener(tabla, id);
  if (!registro || (!permitirHistorico && (registro.eliminado_en !== null || !registro.activo))) throw new Error('Una selección ya no está activa; actualizá los catálogos antes de guardar.');
  return registro;
}
