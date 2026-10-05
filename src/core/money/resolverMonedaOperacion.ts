import type { Billetera } from '../entities/Billetera';
import { calcularCargaRapida, interpretarCampoRapido } from './calcularCargaRapida';

/** Borrador textual de cobro; la billetera real determina su unidad monetaria. */
export interface LineaConBilletera { billeteraId: string; importe: string }
/** Vista previa exacta; una moneda pendiente nunca se sustituye por una divisa inventada. */
export interface ResumenMonedaOperacion { moneda: string | null; totalCentavos: number; error: string }

/**
 * Resuelve la moneda y el total de cobros sin sumar unidades incompatibles.
 * Las sugerencias vacías no condicionan cobros positivos; una edición conserva su moneda histórica.
 */
export function resolverMonedaOperacion(lineas: readonly LineaConBilletera[], billeteras: readonly Billetera[], monedaHistorica?: string, billeteraSeleccionada?: string, tipo: 'ingreso' | 'gasto' = 'ingreso'): ResumenMonedaOperacion {
  let moneda = monedaHistorica || null;
  try {
    const positivas = lineas.filter(/** Excluye filas vacías y valida textos sin redondearlos. */ function positiva(linea) { return interpretarCampoRapido(linea.importe) > 0; });
    for (const linea of positivas) {
      const billetera = billeteras.find(/** Resuelve el destino real por identidad. */ function coincide(registro) { return registro.id === linea.billeteraId; });
      if (!billetera) return { moneda, totalCentavos: 0, error: `Seleccioná una billetera para cada ${tipo === 'ingreso' ? 'cobro' : 'pago'} con importe.` };
      if (moneda && billetera.moneda !== moneda) return { moneda, totalCentavos: 0, error: `Todos los ${tipo === 'ingreso' ? 'cobros del ingreso' : 'pagos del gasto'} deben usar billeteras de la misma moneda.` };
      moneda = billetera.moneda;
    }
    if (!moneda && billeteraSeleccionada && lineas.some(/** Evita usar una selección de una fila ya retirada. */ function seleccionada(linea) { return linea.billeteraId === billeteraSeleccionada; })) {
      moneda = billeteras.find(/** Prioriza la última elección explícita cuando todavía no hay importes. */ function coincide(registro) { return registro.id === billeteraSeleccionada && registro.activo; })?.moneda ?? null;
    }
    if (!moneda) {
      for (const linea of lineas) {
        const billetera = billeteras.find(/** Usa solo sugerencias vigentes cuando todavía no hay dinero ingresado. */ function coincide(registro) { return registro.id === linea.billeteraId && registro.activo; });
        if (billetera) { moneda = billetera.moneda; break; }
      }
    }
    return { moneda, totalCentavos: moneda ? calcularCargaRapida(lineas.map(/** Entrega textos al cálculo exacto compartido. */ function importe(linea) { return linea.importe; }), moneda) : 0, error: '' };
  } catch (causa) {
    return { moneda, totalCentavos: 0, error: causa instanceof Error ? causa.message : `Revisá los importes del ${tipo}.` };
  }
}

/** Determina las monedas permitidas al editar una fila sin condicionar por sugerencias vacías. */
export function monedaOtrasLineas(lineas: readonly LineaConBilletera[], indice: number, billeteras: readonly Billetera[], monedaHistorica?: string): string | null {
  if (monedaHistorica) return monedaHistorica;
  for (let posicion = 0; posicion < lineas.length; posicion++) {
    if (posicion === indice) continue;
    const linea = lineas[posicion]!;
    try { if (interpretarCampoRapido(linea.importe) === 0) continue; } catch { continue; }
    const billetera = billeteras.find(/** Conserva la moneda del destino real de otro cobro positivo. */ function coincide(registro) { return registro.id === linea.billeteraId; });
    if (billetera) return billetera.moneda;
  }
  return null;
}
