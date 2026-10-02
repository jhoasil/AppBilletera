import { ServicioGastos } from '../../nucleo/servicios/ServicioGastos';
import { RepositorioGastosWeb } from '../../base-datos/web/RepositorioGastosWeb';

export const servicioGastos = new ServicioGastos(new RepositorioGastosWeb());
