import { ServicioDetalleBilletera } from '../../core/servicios/ServicioDetalleBilletera';
import { RepositorioDetalleBilleteraWeb } from '../../database/web/RepositorioDetalleBilleteraWeb';

export const servicioDetalleBilletera = new ServicioDetalleBilletera(new RepositorioDetalleBilleteraWeb());
