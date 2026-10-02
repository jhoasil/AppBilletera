import type { TransferenciaBilletera } from '../entidades/TransferenciaBilletera';
import type { RepositorioTransferencias } from '../repositorios/RepositorioTransferencias';
import { instanteDeFecha } from './validarCarga';
import { interpretarImporte } from '../dinero/interpretarImporte';

/** Datos de una transferencia interna que nunca participa del resultado de ingresos y gastos. */
export interface CargaTransferencia { billeteraOrigenId: string; billeteraDestinoId: string; importe: string; moneda: string; fecha: string; descripcion: string }

/** Coordina una transferencia con dos movimientos de signo contrario en una sola escritura. */
export class ServicioTransferencias {
  /** Recibe el contrato financiero independiente del motor. */
  constructor(private readonly repositorio: RepositorioTransferencias) {}

  /** Valida origen, destino e importe y crea una operación interna trazable. */
  async crear(carga: CargaTransferencia): Promise<void> {
    if (!carga.billeteraOrigenId || !carga.billeteraDestinoId || carga.billeteraOrigenId === carga.billeteraDestinoId) throw new Error('Elegí dos billeteras distintas.');
    const importeCentavos = interpretarImporte(carga.importe);
    if (importeCentavos <= 0) throw new Error('La transferencia debe tener un importe mayor a cero.');
    instanteDeFecha(carga.fecha);
    const ahora = new Date().toISOString();
    const transferencia: TransferenciaBilletera = { id: crypto.randomUUID(), billeteraOrigenId: carga.billeteraOrigenId, billeteraDestinoId: carga.billeteraDestinoId, importeCentavos, moneda: carga.moneda, fecha: carga.fecha, descripcion: carga.descripcion.trim() || null, creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null };
    await this.repositorio.guardar(transferencia);
  }
}
