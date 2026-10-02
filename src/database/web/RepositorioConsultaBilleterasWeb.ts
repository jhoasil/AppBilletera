import type { RepositorioConsultaBilleteras, ConsultaBilleterasConSaldo, BilleteraConSaldo } from '../../core/repositories/RepositorioConsultaBilleteras';
import type { ConsultaCatalogo } from '../../core/repositories/ConsultasRepositorio';
import type { Billetera } from '../../core/entities/Billetera';
import { baseWeb, prepararBaseWeb } from './baseWeb';
import { convertirEntidad, type ContextoWeb, type RegistroWeb } from './ContextoWeb';
import { sumarSaldo, convertirSaldo } from './consultasSaldoWeb';
import { validarPagina } from './consultasWeb';

/** Lee billeteras y saldos en una instantánea consistente del motor Web. */
export class RepositorioConsultaBilleterasWeb implements RepositorioConsultaBilleteras {
  /** Pagina el catálogo pequeño y agrega los saldos por índice sin materializar los movimientos. */
  async consultar(consulta: ConsultaCatalogo): Promise<ConsultaBilleterasConSaldo> {
    validarPagina(consulta); await prepararBaseWeb();
    /** Mantiene la consulta de patrimonio consistente ante transferencias realizadas en otra pestaña. */
    async function leer(contexto: ContextoWeb) {
      const billeteras: Billetera[] = [];
      /** Conserva solo catálogos, no registros financieros, respetando los filtros recibidos. */
      function seleccionar(registro: RegistroWeb) { if ((!consulta.incluirEliminados && registro.eliminado_en !== null) || (consulta.activo !== undefined && registro.activo !== consulta.activo)) return; billeteras.push(convertirEntidad<Billetera>(registro)); }
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
    return baseWeb.ejecutarTransaccion({ recursos: ['billeteras', 'movimientos_billetera'], modo: 'lectura' }, leer);
  }
}
