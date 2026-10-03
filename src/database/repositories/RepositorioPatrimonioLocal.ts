import type { RepositorioPatrimonio, ResumenPatrimonio, TotalPatrimonial } from '../../core/repositories/RepositorioPatrimonio';
import type { BilleteraConSaldo } from '../../core/repositories/RepositorioConsultaBilleteras';
import type { Billetera } from '../../core/entities/Billetera';
import { baseLocal, prepararBaseLocal } from '../componerBaseLocal';
import { convertirEntidad } from '../contracts/convertirRegistros';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';
import { convertirSaldo, sumarSaldo } from './consultasSaldo';

/** Agrega patrimonio sin sumar dos veces una transferencia entre billeteras. */
export class RepositorioPatrimonioLocal implements RepositorioPatrimonio {
  /** Mantiene saldos y movimientos internos en una misma transacción de lectura. */
  async consultar(desde: string, hasta: string): Promise<ResumenPatrimonio> {
    await prepararBaseLocal();
    /** Calcula saldos actuales y totales del período sin devolver historia financiera. */
    async function leer(contexto: ContextoDatos) {
      const catalogo: Billetera[] = []; const billeteras: BilleteraConSaldo[] = [];
      const monedas = new Map<string, { saldo: bigint; transferencias: bigint; positivos: bigint; negativos: bigint }>();
      /** Obtiene el acumulador exacto independiente de una moneda. */
      function acumulador(moneda: string) { let valor = monedas.get(moneda); if (!valor) { valor = { saldo: 0n, transferencias: 0n, positivos: 0n, negativos: 0n }; monedas.set(moneda, valor); } return valor; }
      /** Conserva el catálogo pequeño, incluyendo billeteras inactivas con patrimonio histórico. */
      function seleccionar(registro: RegistroDatos) { if (registro.eliminado_en === null) catalogo.push(convertirEntidad<Billetera>(registro)); }
      await contexto.recorrer('billeteras', seleccionar);
      for (const billetera of catalogo) { const saldoCentavos = await sumarSaldo(contexto, billetera.id); billeteras.push({ billetera, saldoCentavos }); acumulador(billetera.moneda).saldo += BigInt(saldoCentavos); }
      /** Cuenta una transferencia por su cabecera, no por sus dos movimientos compensados. */
      function transferencia(registro: RegistroDatos) { if (registro.eliminado_en === null && String(registro.fecha) >= desde && String(registro.fecha) <= hasta) acumulador(String(registro.moneda)).transferencias += BigInt(Number(registro.importe_centavos)); }
      await contexto.recorrer('transferencias_billeteras', transferencia);
      /** Agrega ajustes por fecha local, sin incorporarlos al resultado de ingresos y gastos. */
      function ajuste(registro: RegistroDatos) {
        if (registro.eliminado_en !== null) return;
        const fecha = new Date(String(registro.fecha)); const dia = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
        if (dia < desde || dia > hasta) return;
        const billetera = catalogo.find(function identificar(valor) { return valor.id === registro.billetera_id; }); if (!billetera) return;
        const diferencia = BigInt(Number(registro.diferencia_centavos)); const total = acumulador(billetera.moneda); if (diferencia > 0n) total.positivos += diferencia; else total.negativos += diferencia;
      }
      await contexto.recorrer('ajustes_billetera', ajuste);
      const totales: TotalPatrimonial[] = [];
      for (const [moneda, total] of monedas) totales.push({ moneda, saldoCentavos: convertirSaldo(total.saldo), transferenciasCentavos: convertirSaldo(total.transferencias), ajustesPositivosCentavos: convertirSaldo(total.positivos), ajustesNegativosCentavos: convertirSaldo(total.negativos) });
      return { billeteras, totales };
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['billeteras', 'movimientos_billetera', 'transferencias_billeteras', 'ajustes_billetera'], modo: 'lectura' }, leer);
  }
}
