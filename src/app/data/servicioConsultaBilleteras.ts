import { ServicioConsultaBilleteras } from '../../core/services/ServicioConsultaBilleteras';
import { RepositorioConsultaBilleterasWeb } from '../../database/web/RepositorioConsultaBilleterasWeb';

export const servicioConsultaBilleteras = new ServicioConsultaBilleteras(new RepositorioConsultaBilleterasWeb());
