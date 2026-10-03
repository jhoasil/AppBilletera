/** Calcula una proporción visual de agregados de la misma moneda, sin modificar importes financieros. */
export function porcentajeReporte(parteCentavos: number, totalCentavos: number): number {
  if (parteCentavos <= 0 || totalCentavos <= 0) return 0;
  return Math.min(100, Number(BigInt(parteCentavos) * 10000n / BigInt(totalCentavos)) / 100);
}
