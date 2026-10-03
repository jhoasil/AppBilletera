import { ServicioResumen } from '../../core/services/ServicioResumen';
import { RepositorioResumenLocal } from '../../database/repositories/RepositorioResumenLocal';

export const servicioResumen = new ServicioResumen(new RepositorioResumenLocal());
