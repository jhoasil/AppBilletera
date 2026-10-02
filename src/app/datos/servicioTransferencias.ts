import { ServicioTransferencias } from '../../nucleo/servicios/ServicioTransferencias';
import { RepositorioTransferenciasWeb } from '../../base-datos/web/RepositorioTransferenciasWeb';

export const servicioTransferencias = new ServicioTransferencias(new RepositorioTransferenciasWeb());
