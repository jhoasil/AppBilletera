import { ServicioIngresos } from '../../core/services/ServicioIngresos';
import { RepositorioIngresosWeb } from '../../database/web/RepositorioIngresosWeb';

export const servicioIngresos = new ServicioIngresos(new RepositorioIngresosWeb());
