import type { Moneda } from '../entities/EntidadAuditada';

/** Importe inmutable en centavos enteros seguros; moneda inicial ARS. */
export interface Importe {
  readonly centavos: number;
  readonly moneda: Moneda;
}

/**
 * Crea un importe desde centavos, sin convertir decimales ni redondear.
 * Acepta valores negativos para representar movimientos de salida.
 * Rechaza fracciones, valores no finitos y enteros fuera del rango seguro.
 */
export function crearImporte(centavos: number, moneda: Moneda = 'ARS'): Importe {
  if (!Number.isSafeInteger(centavos)) {
    throw new RangeError('El importe debe expresarse en centavos enteros dentro del rango seguro.');
  }
  if (!/^[A-Z]{3}$/.test(moneda)) {
    throw new TypeError('La moneda debe ser un código de tres letras mayúsculas, como ARS.');
  }
  return Object.freeze({ centavos: centavos === 0 ? 0 : centavos, moneda });
}

/** Valida datos recibidos de objetos externos para evitar operar con importes inválidos. */
function validarImporte(importe: Importe): void {
  crearImporte(importe.centavos, importe.moneda);
}

/** Convierte un resultado entero exacto únicamente si cabe en un number seguro para persistencia. */
function crearResultado(centavos: bigint, moneda: Moneda): Importe {
  const limite = BigInt(Number.MAX_SAFE_INTEGER);
  if (centavos < -limite || centavos > limite) {
    throw new RangeError('El resultado supera el rango seguro de centavos.');
  }
  return crearImporte(Number(centavos), moneda);
}

/**
 * Suma importes de una misma moneda mediante enteros exactos, sin conversiones de divisas.
 * Una lista vacía devuelve cero ARS; comprueba el rango seguro del resultado final.
 */
export function sumarImportes(...importes: readonly Importe[]): Importe {
  const moneda = importes[0]?.moneda ?? 'ARS';
  let totalCentavos = 0n;
  for (const importe of importes) {
    validarImporte(importe);
    if (importe.moneda !== moneda) {
      throw new TypeError('No se pueden sumar importes de monedas diferentes.');
    }
    totalCentavos += BigInt(importe.centavos);
  }
  return crearResultado(totalCentavos, moneda);
}

/** Resta dos importes de la misma moneda conservando el signo y rechazando desbordamientos. */
export function restarImportes(importeInicial: Importe, importeRestado: Importe): Importe {
  validarImporte(importeInicial);
  validarImporte(importeRestado);
  if (importeInicial.moneda !== importeRestado.moneda) {
    throw new TypeError('No se pueden restar importes de monedas diferentes.');
  }
  return crearResultado(
    BigInt(importeInicial.centavos) - BigInt(importeRestado.centavos),
    importeInicial.moneda,
  );
}
