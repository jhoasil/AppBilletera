import { ServicioTransferencias } from '../../core/services/ServicioTransferencias';
import { RepositorioTransferenciasLocal } from '../../database/repositories/RepositorioTransferenciasLocal';

export const servicioTransferencias = new ServicioTransferencias(new RepositorioTransferenciasLocal());
