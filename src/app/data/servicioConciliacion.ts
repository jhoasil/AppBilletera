import { ServicioConciliacion } from '../../core/services/ServicioConciliacion';
import { RepositorioConciliacionLocal } from '../../database/repositories/RepositorioConciliacionLocal';

export const servicioConciliacion = new ServicioConciliacion(new RepositorioConciliacionLocal());
