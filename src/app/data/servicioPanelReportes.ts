import { ServicioPanelReportes } from '../../core/services/ServicioPanelReportes';
import { servicioResumen } from './servicioResumen';
import { servicioIngresos } from './servicioIngresos';
import { servicioGastos } from './servicioGastos';

/** Compone lecturas agregadas compartidas por Web y los adaptadores nativos. */
export const servicioPanelReportes = new ServicioPanelReportes(servicioResumen, servicioIngresos, servicioGastos);
