import { crearImporte, type Importe } from '../../nucleo/dinero/Importe';

/**
 * Formatea un importe para la interfaz, por defecto en español de Argentina.
 * Usa partes enteras y centavos separados para no perder precisión por división decimal.
 * El modelo actual usa dos unidades decimales; no convierte monedas ni modifica el importe.
 */
export function formatearImporte(importe: Importe, idioma = 'es-AR'): string {
  crearImporte(importe.centavos, importe.moneda);
  const formateador = new Intl.NumberFormat(idioma, {
    style: 'currency',
    currency: importe.moneda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const centavos = BigInt(importe.centavos);
  const unidades = centavos / 100n;
  const resto = centavos < 0n ? -(centavos % 100n) : centavos % 100n;
  const fraccion = new Intl.NumberFormat(idioma, {
    useGrouping: false,
    minimumIntegerDigits: 2,
  }).format(Number(resto));
  // Un valor entre -99 y -1 centavos necesita -0 para conservar el signo en Intl.
  const unidadesConSigno = centavos < 0n && unidades === 0n ? -0 : unidades;

  /** Conserva símbolos y separadores locales y sustituye la fracción por los centavos exactos. */
  function completarParte(parte: Intl.NumberFormatPart): string {
    return parte.type === 'fraction' ? fraccion : parte.value;
  }

  return formateador.formatToParts(unidadesConSigno).map(completarParte).join('');
}
