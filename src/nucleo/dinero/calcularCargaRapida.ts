import { interpretarImporte } from './interpretarImporte';
import { crearImporte, sumarImportes } from './Importe';

/** Interpreta un campo rápido vacío como cero y rechaza importes negativos. */
export function interpretarCampoRapido(texto: string): number {
  const centavos = texto.trim() ? interpretarImporte(texto) : 0;
  if (centavos < 0) throw new Error('Los importes de cobro y pago deben ser positivos.');
  return centavos;
}

/** Suma campos rápidos exactamente; no oculta errores de escritura ni desbordamientos. */
export function calcularCargaRapida(importes: readonly string[], moneda: string): number {
  /** Convierte cada campo a una unidad monetaria entera antes de sumar. */
  function convertir(texto: string) { return crearImporte(interpretarCampoRapido(texto), moneda); }
  return sumarImportes(...importes.map(convertir)).centavos;
}
