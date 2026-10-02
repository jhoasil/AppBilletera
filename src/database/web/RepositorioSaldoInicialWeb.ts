import type { Billetera } from '../../core/entidades/Billetera';
import type { MovimientoBilletera } from '../../core/entidades/MovimientoBilletera';
import type { RepositorioSaldoInicial } from '../../core/repositorios/RepositorioSaldoInicial';
import { baseWeb, prepararBaseWeb } from './baseWeb';
import { convertirRegistro, type ContextoWeb, type RegistroWeb } from './ContextoWeb';

/** Adaptador Web que protege el saldo inicial incluso frente a escrituras desde otras pestañas. */
export class RepositorioSaldoInicialWeb implements RepositorioSaldoInicial {
  /** Comprueba e inserta en una sola transacción; jamás reemplaza un saldo inicial anterior. */
  async registrar(movimiento: MovimientoBilletera, billeteraNueva?: Billetera): Promise<void> {
    await prepararBaseWeb();
    /** Mantiene juntas la creación de billetera y la inserción del movimiento para evitar huérfanos. */
    async function escribir(contexto: ContextoWeb) {
      if (movimiento.tipo !== 'SALDO_INICIAL' || movimiento.referenciaTipo !== null || movimiento.referenciaId !== null) throw new Error('El movimiento no corresponde a un saldo inicial.');
      if (billeteraNueva) {
        if (billeteraNueva.id !== movimiento.billeteraId) throw new Error('El saldo inicial debe pertenecer a la nueva billetera.');
        await contexto.guardar('billeteras', convertirRegistro(billeteraNueva), true);
      }
      const billetera = await contexto.obtener('billeteras', movimiento.billeteraId);
      if (!billetera || billetera.eliminado_en !== null || !billetera.activo) throw new Error('Seleccioná una billetera activa.');
      let registrado = false;
      /** Inspecciona el historial de esta billetera sin cargar todos los movimientos en memoria. */
      function comprobar(registro: RegistroWeb) { if (registro.tipo === 'SALDO_INICIAL') registrado = true; }
      await contexto.recorrer('movimientos_billetera', comprobar, 'por_billetera_fecha', IDBKeyRange.bound([movimiento.billeteraId, ''], [movimiento.billeteraId, '\uffff']));
      if (registrado) throw new Error('Esta billetera ya tiene un saldo inicial registrado. Las correcciones deben realizarse mediante una conciliación.');
      await contexto.guardar('movimientos_billetera', convertirRegistro(movimiento), true);
    }
    return baseWeb.ejecutarTransaccion({ recursos: ['billeteras', 'movimientos_billetera'], modo: 'escritura' }, escribir);
  }
}
