import { ServicioDetalleBilletera } from '../../core/services/ServicioDetalleBilletera';
import { RepositorioDetalleBilleteraLocal } from '../../database/repositories/RepositorioDetalleBilleteraLocal';

export const servicioDetalleBilletera = new ServicioDetalleBilletera(new RepositorioDetalleBilleteraLocal());
