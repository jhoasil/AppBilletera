import type { DatosRespaldo } from '../../core/repositories/RepositorioRespaldo';
import type { RegistroDatos } from './ContextoDatos';
import type { NombreTabla } from '../migrations/EsquemaBaseDatos';
import type { RangoConsulta } from './RangoConsulta';
import { alinearModeloFinanciero } from '../migrations/v2';

/** Aplica la misma transformación de V2 sobre una copia del respaldo previamente validado, sin modificar el archivo. */
export async function alinearRespaldo(datos: DatosRespaldo): Promise<DatosRespaldo> {
  const copia: DatosRespaldo = {};
  for (const [tabla, filas] of Object.entries(datos)) copia[tabla as NombreTabla] = filas!.map(/** Copia las columnas antes de actualizar referencias históricas inequívocas. */ function copiar(fila) { return { ...fila }; });
  /** Recorre el índice lógico solicitado en la copia del archivo, conservando la selección de V2. */
  async function recorrerAsincrono(tabla: NombreTabla, visitar: (fila: RegistroDatos) => Promise<void>, indice?: string, rango?: RangoConsulta): Promise<void> {
    for (const fila of copia[tabla]!) {
      const clave = rango?.inferior;
      if (indice === 'por_referencia' && Array.isArray(clave) && (fila.referencia_tipo !== clave[0] || fila.referencia_id !== clave[1])) continue;
      if (indice === 'por_ingreso' && fila.ingreso_id !== clave) continue;
      if (indice === 'por_gasto' && fila.gasto_id !== clave) continue;
      await visitar(fila);
    }
  }
  /** Adapta el visitante síncrono a la misma selección utilizada por las migraciones de base. */
  async function recorrer(tabla: NombreTabla, visitar: (fila: RegistroDatos) => void, indice?: string, rango?: RangoConsulta): Promise<void> {
    /** Entrega una fila sin esperas externas. */
    async function entregar(fila: RegistroDatos) { visitar(fila); }
    await recorrerAsincrono(tabla, entregar, indice, rango);
  }
  /** Reemplaza exclusivamente referencias de movimientos ya presentes, sin agregar efectos financieros. */
  async function guardar(tabla: NombreTabla, fila: RegistroDatos): Promise<void> {
    const posicion = copia[tabla]!.findIndex(/** Localiza la identidad existente en la instantánea del archivo. */ function misma(actual) { return actual.id === fila.id; });
    if (posicion < 0) throw new Error('No se puede agregar una operación durante la alineación del respaldo.');
    const filas = [...copia[tabla]!]; filas[posicion] = fila; copia[tabla] = filas;
  }
  await alinearModeloFinanciero({ recorrer, recorrerAsincrono, guardar });
  return copia;
}
