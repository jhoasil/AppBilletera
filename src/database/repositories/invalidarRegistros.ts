import { RangoConsulta } from '../contracts/RangoConsulta';
import type { NombreTabla } from '../migrations/EsquemaBaseDatos';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';

/** Invalida únicamente registros de una operación dentro de su transacción, conservando auditoría. */
export async function invalidarRegistros(contexto: ContextoDatos, tabla: NombreTabla, indice: string, rango: RangoConsulta, instante: string): Promise<void> {
  const registros: RegistroDatos[] = [];
  /** Conserva solo versiones vigentes de la operación, nunca la historia completa. */
  function seleccionar(registro: RegistroDatos) { if (registro.eliminado_en === null) registros.push(registro); }
  await contexto.recorrer(tabla, seleccionar, indice, rango);
  for (const registro of registros) await contexto.guardar(tabla, { ...registro, actualizado_en: instante, eliminado_en: instante });
}
