import { ServicioGastos } from '../../core/services/ServicioGastos';
import { RepositorioGastosWeb } from '../../database/web/RepositorioGastosWeb';

export const servicioGastos = new ServicioGastos(new RepositorioGastosWeb());
