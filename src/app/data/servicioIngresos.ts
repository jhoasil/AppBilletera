import { ServicioIngresos } from '../../core/services/ServicioIngresos';
import { RepositorioIngresosLocal } from '../../database/repositories/RepositorioIngresosLocal';

export const servicioIngresos = new ServicioIngresos(new RepositorioIngresosLocal());
