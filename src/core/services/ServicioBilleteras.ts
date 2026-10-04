import type { Billetera } from '../entities/Billetera';
import { clasificarTipoBilletera } from '../entities/TipoBilletera';
import { ServicioCatalogo } from './ServicioCatalogo';

/** Aplica la clasificación vigente sin reescribir movimientos o respaldos antiguos. */
export class ServicioBilleteras extends ServicioCatalogo<Billetera> {
  /** Normaliza tipos conocidos y exige elección explícita para tipos libres desconocidos. */
  override async preparar(borrador: Billetera): Promise<Billetera> {
    const tipo = clasificarTipoBilletera(borrador.tipo);
    if (!tipo) throw new Error('Elegí Efectivo o Dinero digital como tipo de billetera.');
    return super.preparar({ ...borrador, tipo });
  }
}
