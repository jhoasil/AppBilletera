import type { RepositorioDetalleBilletera } from '../repositories/RepositorioDetalleBilletera';
import { instanteDeFecha } from './validarCarga';

/** Convierte filtros de calendario a un período local completo y delega las agregaciones a persistencia. */
export class ServicioDetalleBilletera {
  /** Recibe un puerto de consulta sin exponer índices o cursores a la pantalla. */
  constructor(private readonly repositorio: RepositorioDetalleBilletera) {}

  /** Consulta veinte movimientos y el saldo actual; filtrar movimientos nunca cambia el saldo mostrado. */
  consultar(id: string, pagina = 0, desde = '', hasta = '') {
    if (desde && hasta && desde > hasta) throw new Error('El inicio del período no puede superar su fin.');
    const inicio = desde ? instanteDeFecha(desde) : undefined;
    let fin: string | undefined;
    if (hasta) {
      const siguienteDia = new Date(instanteDeFecha(hasta));
      siguienteDia.setDate(siguienteDia.getDate() + 1);
      siguienteDia.setMilliseconds(-1);
      fin = siguienteDia.toISOString();
    }
    return this.repositorio.consultar({ billeteraId: id, limite: 20, desplazamiento: pagina * 20, ...(inicio ? { desde: inicio } : {}), ...(fin ? { hasta: fin } : {}) });
  }
}
