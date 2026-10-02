import { ServicioTransferencias } from '../../core/servicios/ServicioTransferencias';
import { RepositorioTransferenciasWeb } from '../../database/web/RepositorioTransferenciasWeb';

export const servicioTransferencias = new ServicioTransferencias(new RepositorioTransferenciasWeb());
