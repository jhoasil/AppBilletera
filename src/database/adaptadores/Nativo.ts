import { BaseLocal } from '../BaseLocal';
import type { AdaptadorBaseLocal } from '../contratos/AdaptadorBaseLocal';

/** Puerto nativo que implementará SQLite, compartido por Android e iOS. */
export interface AdaptadorNativo<ContextoTransaccion, ContextoMigracion>
  extends AdaptadorBaseLocal<ContextoTransaccion, ContextoMigracion> {
  readonly plataforma: 'nativo';
}

/** Prepara la coordinación nativa con un adaptador suministrado, sin instalar ni abrir SQLite. */
export function crearBaseNativa<ContextoTransaccion, ContextoMigracion>(
  adaptador: AdaptadorNativo<ContextoTransaccion, ContextoMigracion>,
): BaseLocal<ContextoTransaccion, ContextoMigracion> {
  return new BaseLocal(adaptador);
}
