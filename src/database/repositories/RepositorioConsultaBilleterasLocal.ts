import { clasificarTipoBilletera } from '../../core/entities/TipoBilletera';
import type { RepositorioConsultaBilleteras, ConsultaBilleterasConSaldo, BilleteraConSaldo, ConsultaBilleteras } from '../../core/repositories/RepositorioConsultaBilleteras';
import type { Billetera } from '../../core/entities/Billetera';
import { baseLocal, prepararBaseLocal } from '../componerBaseLocal';
import { convertirEntidad } from '../contracts/convertirRegistros';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';
import { sumarSaldo, convertirSaldo } from './consultasSaldo';
import { validarPagina } from './consultasDatos';

/** Lee billeteras y saldos en una instantánea consistente del motor local seleccionado. */
export class RepositorioConsultaBilleterasLocal implements RepositorioConsultaBilleteras {
  /** Pagina el catálogo pequeño y agrega los saldos por índice sin materializar los movimientos. */
  async consultar(consulta: ConsultaBilleteras): Promise<ConsultaBilleterasConSaldo> {
    validarPagina(consulta); await prepararBaseLocal();
    /** Mantiene la consulta de patrimonio consistente ante transferencias realizadas en otra pestaña. */
    async function leer(contexto: ContextoDatos) {
      const billeteras: Billetera[] = [];
      /** Conserva solo catálogos, no registros financieros, respetando los filtros recibidos. */
      function seleccionar(registro: RegistroDatos) { if ((!consulta.incluirEliminados && registro.eliminado_en !== null) || (consulta.activo !== undefined && registro.activo !== consulta.activo)) return; const billetera = convertirEntidad<Billetera>(registro); if (consulta.tipo && clasificarTipoBilletera(billetera.tipo) !== consulta.tipo) return; billeteras.push(billetera); }
      await contexto.recorrer('billeteras', seleccionar);
      /** Ordena nombres para mantener una paginación estable y predecible. */
      function comparar(a: Billetera, b: Billetera) { return a.nombre.localeCompare(b.nombre, 'es') || a.id.localeCompare(b.id); }
      billeteras.sort(comparar);
      const elementos: BilleteraConSaldo[] = []; const totales = new Map<string, bigint>();
      for (let posicion = 0; posicion < billeteras.length; posicion++) {
        const billetera = billeteras[posicion]!;
        const saldoCentavos = await sumarSaldo(contexto, billetera.id);
        totales.set(billetera.moneda, (totales.get(billetera.moneda) ?? 0n) + BigInt(saldoCentavos));
        if (posicion >= consulta.desplazamiento && elementos.length < consulta.limite) elementos.push({ billetera, saldoCentavos });
      }
      const resumen: { moneda: string; centavos: number }[] = [];
      for (const [moneda, total] of totales) resumen.push({ moneda, centavos: convertirSaldo(total) });
      return { elementos, total: billeteras.length, totales: resumen };
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['billeteras', 'movimientos_billetera'], modo: 'lectura' }, leer);
  }
}
