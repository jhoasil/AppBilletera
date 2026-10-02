import { ServicioConciliacion } from '../../core/services/ServicioConciliacion';
import { RepositorioConciliacionWeb } from '../../database/web/RepositorioConciliacionWeb';

export const servicioConciliacion = new ServicioConciliacion(new RepositorioConciliacionWeb());
