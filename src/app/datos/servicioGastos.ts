import { ServicioGastos } from '../../core/servicios/ServicioGastos';
import { RepositorioGastosWeb } from '../../database/web/RepositorioGastosWeb';

export const servicioGastos = new ServicioGastos(new RepositorioGastosWeb());
