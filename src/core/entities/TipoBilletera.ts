/** Clasificación vigente de la ubicación del dinero, independiente del medio de pago. */
export type TipoBilletera = 'efectivo' | 'digital';

/** Opciones canónicas compartidas por los formularios y las etiquetas. */
export const tiposBilletera = [
  { id: 'efectivo', nombre: 'Efectivo' },
  { id: 'digital', nombre: 'Dinero digital' },
] as const;

/**
 * Interpreta tipos antiguos reconocibles sin modificar registros ni auditoría.
 * Un tipo libre desconocido requiere elección explícita; nunca se infiere del nombre.
 */
export function clasificarTipoBilletera(tipo: string): TipoBilletera | null {
  const normalizado = tipo.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  if (['efectivo', 'caja', 'dinero en efectivo', 'dinero fisico'].includes(normalizado)) return 'efectivo';
  if (['digital', 'virtual', 'banco', 'bancaria', 'bancario', 'cuenta bancaria', 'app', 'transferencia', 'dinero digital', 'dinero virtual', 'billetera digital', 'billetera virtual', 'cuenta digital', 'cuenta de cobro', 'cuenta digital de cobro'].includes(normalizado)) return 'digital';
  return null;
}

/** Presenta una etiqueta coherente y hace visibles los tipos legados sin clasificar. */
export function nombreTipoBilletera(tipo: string): string {
  const clasificacion = clasificarTipoBilletera(tipo);
  return clasificacion === 'efectivo' ? 'Efectivo' : clasificacion === 'digital' ? 'Dinero digital' : 'Clasificar billetera';
}
