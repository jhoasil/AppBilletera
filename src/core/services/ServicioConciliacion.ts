import type { RepositorioConciliacion } from '../repositories/RepositorioConciliacion';
import type { ConfirmacionConciliacion } from './calcularConciliacion';
import { crearImporte, restarImportes } from '../money/Importe';

/** Valida la decisión expresa de conciliar sin convertir diferencias en ingresos o gastos. */
export class ServicioConciliacion {
  /** Recibe el puerto que conserva la atomicidad de la conciliación. */
  constructor(private readonly repositorio: RepositorioConciliacion) {}
  /** Exige un motivo si hay diferencia y delega la verificación del saldo vigente. */
  confirmar(datos: ConfirmacionConciliacion): Promise<void> {
    const diferencia = restarImportes(crearImporte(datos.saldoRealCentavos), crearImporte(datos.saldoEsperadoCentavos)).centavos;
    if (!datos.billeteraId || (diferencia !== 0 && !datos.motivo.trim())) throw new Error('Seleccioná una billetera y explicá el motivo de la diferencia.');
    return this.repositorio.confirmar({ ...datos, motivo: datos.motivo.trim(), observaciones: datos.observaciones.trim() });
  }
}
