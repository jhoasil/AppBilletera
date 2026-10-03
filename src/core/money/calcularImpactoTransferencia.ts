import { restarImportes, sumarImportes, type Importe } from './Importe';

/** Proyecta ambos saldos con dinero exacto; no persiste ni sustituye los saldos consultados. */
export function calcularImpactoTransferencia(origen: Importe, destino: Importe, importe: Importe) {
  if (importe.centavos <= 0) throw new Error('Indicá un importe mayor a cero.');
  return { origen: restarImportes(origen, importe), destino: sumarImportes(destino, importe) };
}
