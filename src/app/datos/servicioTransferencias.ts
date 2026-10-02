import { ServicioTransferencias } from '../../core/services/ServicioTransferencias';
import { RepositorioTransferenciasWeb } from '../../database/web/RepositorioTransferenciasWeb';

export const servicioTransferencias = new ServicioTransferencias(new RepositorioTransferenciasWeb());
