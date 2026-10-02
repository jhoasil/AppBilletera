import { crearBaseWeb } from '../adaptadores/Web';
import { migracionesBaseLocal } from '../migraciones/v1';
import { AdaptadorIndexedDB } from './AdaptadorIndexedDB';

/** Instancia compartida por servicios; nunca se importa desde componentes de presentación. */
export const baseWeb = crearBaseWeb(new AdaptadorIndexedDB());
let preparacion: Promise<void> | undefined;

/** Inicializa una sola vez y permite volver a intentar después de un fallo de apertura. */
export function prepararBaseWeb(): Promise<void> {
  /** Libera el intento fallido para que la interfaz pueda ofrecer reintentar. */
  function permitirReintento(error: unknown): never { preparacion = undefined; throw error; }
  preparacion ??= baseWeb.inicializar(migracionesBaseLocal).catch(permitirReintento);
  return preparacion;
}
