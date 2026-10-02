import { ServicioIngresos } from '../../core/servicios/ServicioIngresos';
import { RepositorioIngresosWeb } from '../../database/web/RepositorioIngresosWeb';

export const servicioIngresos = new ServicioIngresos(new RepositorioIngresosWeb());
