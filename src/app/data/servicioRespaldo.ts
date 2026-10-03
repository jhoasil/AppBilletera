import { ServicioRespaldo } from '../../core/services/ServicioRespaldo';
import { RepositorioRespaldoLocal } from '../../database/repositories/RepositorioRespaldoLocal';
import { informacionAplicacion } from '../informacionAplicacion';

export const servicioRespaldo = new ServicioRespaldo(new RepositorioRespaldoLocal(), informacionAplicacion.version);
