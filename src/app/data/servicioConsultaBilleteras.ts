import { ServicioConsultaBilleteras } from '../../core/services/ServicioConsultaBilleteras';
import { RepositorioConsultaBilleterasLocal } from '../../database/repositories/RepositorioConsultaBilleterasLocal';

export const servicioConsultaBilleteras = new ServicioConsultaBilleteras(new RepositorioConsultaBilleterasLocal());
