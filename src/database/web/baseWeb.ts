import { Capacitor } from '@capacitor/core';
import { BaseLocal } from '../BaseLocal';
import { AdaptadorSQLite } from '../adapters/AdaptadorSQLite';
import type { ContextoDatos } from '../contracts/ContextoDatos';
import type { ContextoMigracionEsquema } from '../migrations/EsquemaBaseDatos';
import { migracionesBaseLocal } from '../migrations/v1';
import { AdaptadorIndexedDB } from './AdaptadorIndexedDB';

/** Instancia compartida por servicios; nunca se importa desde componentes de presentación. */
export const baseWeb = new BaseLocal<ContextoDatos, ContextoMigracionEsquema>(Capacitor.isNativePlatform() ? new AdaptadorSQLite() : new AdaptadorIndexedDB());
let preparacion: Promise<void> | undefined;

/** Inicializa una sola vez y permite volver a intentar después de un fallo de apertura. */
export function prepararBaseWeb(): Promise<void> {
  /** Libera el intento fallido para que la interfaz pueda ofrecer reintentar. */
  function permitirReintento(error: unknown): never { preparacion = undefined; throw error; }
  preparacion ??= baseWeb.inicializar(migracionesBaseLocal).catch(permitirReintento);
  return preparacion;
}
