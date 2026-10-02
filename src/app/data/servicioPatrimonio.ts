import { ServicioPatrimonio } from '../../core/services/ServicioPatrimonio';
import { RepositorioPatrimonioWeb } from '../../database/web/RepositorioPatrimonioWeb';

export const servicioPatrimonio = new ServicioPatrimonio(new RepositorioPatrimonioWeb());
