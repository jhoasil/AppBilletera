import type { NombreTabla } from '../migrations/EsquemaBaseDatos';
import type { RangoConsulta } from './RangoConsulta';

/** Registro físico portable de columnas españolas. */
export type RegistroDatos = Record<string, unknown>;
/** Acceso transaccional compartido por repositorios Web y nativos. */
export interface ContextoDatos {
  /** Consulta una marca técnica dentro de la transacción. */
  obtenerMarca(id: string): Promise<boolean>;
  /** Guarda una marca junto con los datos preparados. */
  guardarMarca(id: string): Promise<void>;
  /** Consulta por identidad única sin exponer APIs del motor. */
  obtener(tabla: NombreTabla, id: string): Promise<RegistroDatos | null>;
  /** Recorre registros acotados por un índice sin materializar la historia. */
  recorrer(tabla: NombreTabla, visitar: (registro: RegistroDatos) => void, indice?: string, rango?: RangoConsulta): Promise<void>;
  /** Recorre con lecturas dependientes exclusivamente del mismo contexto. */
  recorrerAsincrono(tabla: NombreTabla, visitar: (registro: RegistroDatos) => Promise<void>, indice?: string, rango?: RangoConsulta): Promise<void>;
  /** Ordena por fecha descendente y UUID ascendente para paginación estable. */
  recorrerPorFecha(tabla: NombreTabla, indice: string, rango: RangoConsulta | undefined, visitar: (registro: RegistroDatos) => void): Promise<void>;
  /** Valida columnas y referencias; preservarLegado se reserva a respaldos íntegramente validados. */
  guardar(tabla: NombreTabla, registro: RegistroDatos, insertar?: boolean, preservarLegado?: boolean): Promise<void>;
}
