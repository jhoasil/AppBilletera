import { ServicioRespaldo } from '../../core/services/ServicioRespaldo';
import { RepositorioRespaldoWeb } from '../../database/web/RepositorioRespaldoWeb';
import { informacionAplicacion } from '../informacionAplicacion';

export const servicioRespaldo = new ServicioRespaldo(new RepositorioRespaldoWeb(), informacionAplicacion.version);
