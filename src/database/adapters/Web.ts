import { BaseLocal } from '../BaseLocal';
import type { AdaptadorBaseLocal } from '../contracts/AdaptadorBaseLocal';

/** Puerto Web que implementará IndexedDB; los recursos equivaldrán a sus almacenes. */
export interface AdaptadorWeb<ContextoTransaccion, ContextoMigracion>
  extends AdaptadorBaseLocal<ContextoTransaccion, ContextoMigracion> {
  readonly plataforma: 'web';
}

/** Prepara la coordinación Web con un adaptador suministrado, sin abrir ni simular IndexedDB. */
export function crearBaseWeb<ContextoTransaccion, ContextoMigracion>(
  adaptador: AdaptadorWeb<ContextoTransaccion, ContextoMigracion>,
): BaseLocal<ContextoTransaccion, ContextoMigracion> {
  return new BaseLocal(adaptador);
}
