import { ServicioConsultaBilleteras } from '../../nucleo/servicios/ServicioConsultaBilleteras';
import { RepositorioConsultaBilleterasWeb } from '../../base-datos/web/RepositorioConsultaBilleterasWeb';

export const servicioConsultaBilleteras = new ServicioConsultaBilleteras(new RepositorioConsultaBilleterasWeb());
