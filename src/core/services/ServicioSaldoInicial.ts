import type { Billetera } from '../entities/Billetera';
import type { MovimientoBilletera } from '../entities/MovimientoBilletera';
import type { RepositorioSaldoInicial } from '../repositories/RepositorioSaldoInicial';
import { interpretarImporte } from '../money/interpretarImporte';

/** Registra el punto de partida financiero sin modificar un atributo de saldo. */
export class ServicioSaldoInicial {
  /** Recibe el puerto transaccional para mantener la lógica independiente del motor local. */
  constructor(private readonly repositorio: RepositorioSaldoInicial) {}

  /** Configura una billetera existente o crea una nueva junto a su movimiento inicial. */
  async registrar(billeteraId: string, importe: string, fecha: string, billeteraNueva?: Billetera): Promise<void> {
    const importeCentavos = interpretarImporte(importe);
    const instante = new Date(`${fecha}T00:00:00.000Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !Number.isFinite(instante.getTime()) || instante.toISOString().slice(0, 10) !== fecha) throw new Error('Indicá una fecha válida para el saldo inicial.');
    const ahora = new Date().toISOString();
    const movimiento: MovimientoBilletera = {
      id: crypto.randomUUID(), billeteraId, tipo: 'SALDO_INICIAL', referenciaTipo: null, referenciaId: null,
      importeCentavos, fecha: new Date(`${fecha}T00:00:00`).toISOString(), descripcion: 'Saldo inicial', creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null,
    };
    await this.repositorio.registrar(movimiento, billeteraNueva);
  }
}
