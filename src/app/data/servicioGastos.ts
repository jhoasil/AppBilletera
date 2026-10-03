import { ServicioGastos } from '../../core/services/ServicioGastos';
import { RepositorioGastosLocal } from '../../database/repositories/RepositorioGastosLocal';

export const servicioGastos = new ServicioGastos(new RepositorioGastosLocal());
