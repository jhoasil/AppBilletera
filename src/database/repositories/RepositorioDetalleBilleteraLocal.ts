import type { RepositorioDetalleBilletera, DetalleBilletera } from '../../core/repositories/RepositorioDetalleBilletera';
import type { ConsultaMovimientosBilletera } from '../../core/repositories/ConsultasRepositorio';
import type { MovimientoBilletera } from '../../core/entities/MovimientoBilletera';
import type { Billetera } from '../../core/entities/Billetera';
import { baseLocal, prepararBaseLocal } from '../componerBaseLocal';
import { convertirEntidad } from '../contracts/convertirRegistros';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';
import { sumarSaldo, rangoBilletera } from './consultasSaldo';
import { validarPagina } from './consultasDatos';

/** Consulta una billetera utilizando el índice compuesto sin entregar toda su historia a JavaScript. */
export class RepositorioDetalleBilleteraLocal implements RepositorioDetalleBilletera {
  /** Entrega una instantánea consistente del saldo actual y movimientos paginados por período. */
  async consultar(consulta: ConsultaMovimientosBilletera): Promise<DetalleBilletera> {
    validarPagina(consulta);
    const rango = rangoBilletera(consulta.billeteraId, consulta.desde, consulta.hasta);
    await prepararBaseLocal();
    /** Resuelve ambas lecturas financieras dentro de la misma transacción para evitar resultados mezclados. */
    async function leer(contexto: ContextoDatos) {
      const registro = await contexto.obtener('billeteras', consulta.billeteraId);
      if (!registro || registro.eliminado_en !== null) throw new Error('La billetera ya no está disponible.');
      const billetera = convertirEntidad<Billetera>(registro);
      const saldoCentavos = await sumarSaldo(contexto, billetera.id);
      const elementos: MovimientoBilletera[] = []; let total = 0;
      /** Cuenta coincidencias vigentes y conserva exclusivamente la página solicitada. */
      function seleccionar(movimiento: RegistroDatos) {
        if (movimiento.eliminado_en !== null) return;
        if (total >= consulta.desplazamiento && elementos.length < consulta.limite) elementos.push(convertirEntidad<MovimientoBilletera>(movimiento));
        total++;
      }
      await contexto.recorrerPorFecha('movimientos_billetera', 'por_billetera_fecha', rango, seleccionar);
      return { billetera, saldoCentavos, movimientos: { elementos, total } };
    }
    return baseLocal.ejecutarTransaccion({ recursos: ['billeteras', 'movimientos_billetera'], modo: 'lectura' }, leer);
  }
}
