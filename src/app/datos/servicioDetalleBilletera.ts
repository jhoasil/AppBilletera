import { ServicioDetalleBilletera } from '../../core/services/ServicioDetalleBilletera';
import { RepositorioDetalleBilleteraWeb } from '../../database/web/RepositorioDetalleBilleteraWeb';

export const servicioDetalleBilletera = new ServicioDetalleBilletera(new RepositorioDetalleBilleteraWeb());
