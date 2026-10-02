import { ServicioConsultaBilleteras } from '../../core/servicios/ServicioConsultaBilleteras';
import { RepositorioConsultaBilleterasWeb } from '../../database/web/RepositorioConsultaBilleterasWeb';

export const servicioConsultaBilleteras = new ServicioConsultaBilleteras(new RepositorioConsultaBilleterasWeb());
