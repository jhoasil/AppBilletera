import type { NombreTabla } from '../migrations/EsquemaBaseDatos';
import type { ContextoWeb, RegistroWeb } from './ContextoWeb';

/** Invalida únicamente registros de una operación dentro de su transacción, conservando auditoría. */
export async function invalidarRegistros(contexto: ContextoWeb, tabla: NombreTabla, indice: string, rango: IDBKeyRange, instante: string): Promise<void> {
  const registros: RegistroWeb[] = [];
  /** Conserva solo versiones vigentes de la operación, nunca la historia completa. */
  function seleccionar(registro: RegistroWeb) { if (registro.eliminado_en === null) registros.push(registro); }
  await contexto.recorrer(tabla, seleccionar, indice, rango);
  for (const registro of registros) await contexto.guardar(tabla, { ...registro, actualizado_en: instante, eliminado_en: instante });
}
