import { ServicioPatrimonio } from '../../core/services/ServicioPatrimonio';
import { RepositorioPatrimonioLocal } from '../../database/repositories/RepositorioPatrimonioLocal';

export const servicioPatrimonio = new ServicioPatrimonio(new RepositorioPatrimonioLocal());
