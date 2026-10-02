import { ServicioResumen } from '../../core/services/ServicioResumen';
import { RepositorioResumenWeb } from '../../database/web/RepositorioResumenWeb';

export const servicioResumen = new ServicioResumen(new RepositorioResumenWeb());
