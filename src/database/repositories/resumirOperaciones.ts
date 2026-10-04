import type { ConsultaOperaciones } from '../../core/repositories/ConsultasRepositorio';
import type { RegistroDatos } from '../contracts/ContextoDatos';
import { crearImporte, sumarImportes } from '../../core/money/Importe';

import { normalizarBusqueda } from '../../core/services/normalizarBusqueda';

/** Filtra antes de paginar por descripción o nombres de catálogos resueltos por identidad. */
export function coincideBusqueda(registro: RegistroDatos, consulta: ConsultaOperaciones) {
  const texto = normalizarBusqueda(consulta.busqueda ?? '');
  return !texto || normalizarBusqueda(String(registro.descripcion ?? '')).includes(texto)
    || consulta.actividadesCoincidentes?.includes(String(registro.actividad_id))
    || consulta.categoriasCoincidentes?.includes(String(registro.categoria_id));
}

/** Acumula por mes y moneda con aritmética segura, conservando solo subtotales. */
export function acumularOperacion(resumen: Map<string, { mes: string; moneda: string; importeCentavos: number }>, registro: RegistroDatos) {
  const mes = String(registro.fecha).slice(0, 7); const moneda = String(registro.moneda);
  // La clave vacía conserva el total general exacto por moneda sin depender de la página.
  for (const periodo of [mes, '']) {
    const clave = `${periodo}/${moneda}`; const anterior = resumen.get(clave)?.importeCentavos ?? 0;
    const importeCentavos = sumarImportes(crearImporte(anterior, moneda), crearImporte(Number(registro.importe_centavos), moneda)).centavos;
    resumen.set(clave, { mes: periodo, moneda, importeCentavos });
  }
}
