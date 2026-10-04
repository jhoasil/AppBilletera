import type { TipoBilletera } from '../entities/TipoBilletera';
import type { Billetera } from '../entities/Billetera';
import type { ConsultaCatalogo } from './ConsultasRepositorio';

/** Billetera con saldo calculado, sin agregar un atributo mutable a su entidad persistida. */
export interface BilleteraConSaldo { billetera: Billetera; saldoCentavos: number }
/** Página y patrimonio agrupado por moneda, obtenidos desde una misma instantánea transaccional. */
export interface ConsultaBilleterasConSaldo { elementos: readonly BilleteraConSaldo[]; total: number; totales: readonly { moneda: string; centavos: number }[] }
/** Filtro de clasificación aplicado antes de paginar y sumar patrimonio. */
export interface ConsultaBilleteras extends ConsultaCatalogo { tipo?: TipoBilletera }
/** Puerto de lectura optimizada para evitar saldos inconsistentes al transferir entre consultas. */
export interface RepositorioConsultaBilleteras {
  /** Consulta catálogo y agregaciones en un mismo contexto; nunca devuelve toda la historia financiera. */
  consultar(consulta: ConsultaBilleteras): Promise<ConsultaBilleterasConSaldo>;
}
