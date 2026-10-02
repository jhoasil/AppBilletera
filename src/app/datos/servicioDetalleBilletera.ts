import { ServicioDetalleBilletera } from '../../nucleo/servicios/ServicioDetalleBilletera';
import { RepositorioDetalleBilleteraWeb } from '../../base-datos/web/RepositorioDetalleBilleteraWeb';

export const servicioDetalleBilletera = new ServicioDetalleBilletera(new RepositorioDetalleBilleteraWeb());
