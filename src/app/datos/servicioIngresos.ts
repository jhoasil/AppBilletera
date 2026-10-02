import { ServicioIngresos } from '../../nucleo/servicios/ServicioIngresos';
import { RepositorioIngresosWeb } from '../../base-datos/web/RepositorioIngresosWeb';

export const servicioIngresos = new ServicioIngresos(new RepositorioIngresosWeb());
