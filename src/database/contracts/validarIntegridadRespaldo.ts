import type { DatosRespaldo } from '../../core/repositories/RepositorioRespaldo';
import type { RegistroDatos } from './ContextoDatos';
import { validarRegistro } from './validarRegistro';
import { validarEfectoMovimiento } from './validarEfectoMovimiento';
import type { RangoConsulta } from './RangoConsulta';
import { tablasV1 } from '../migrations/v1';
import type { NombreTabla } from '../migrations/EsquemaBaseDatos';

/** Valida tipos y efectos monetarios completos antes de abrir la transacción de importación. */
export async function validarIntegridadRespaldo(datos: DatosRespaldo): Promise<void> {
  const indices = new Map<string, Map<string, RegistroDatos>>();
  for (const tabla of tablasV1) indices.set(tabla.nombre, new Map(datos[tabla.nombre]!.map(/** Indexa cada registro del archivo por UUID para comprobar referencias sin consultar el dispositivo. */ function identificar(registro) { return [String(registro.id), registro] as const; })));
  /** Resuelve referencias exclusivamente dentro del archivo, sin depender de los datos ya instalados. */
  async function obtener(tabla: NombreTabla, id: string) { return indices.get(tabla)?.get(id) ?? null; }
  for (const tabla of tablasV1) for (const registro of datos[tabla.nombre]!) await validarRegistro({ obtener }, tabla.nombre, registro);
  /** Proporciona las lecturas necesarias para validar unicidad y origen dentro de la instantánea del archivo. */
  async function recorrer(_tabla: NombreTabla, visitar: (registro: RegistroDatos) => void, indice?: string, rango?: RangoConsulta) {
    const clave = rango!.inferior as readonly string[];
    for (const movimiento of datos.movimientos_billetera!) {
      if (indice === 'por_billetera_fecha' ? movimiento.billetera_id === clave[0] : movimiento.referencia_tipo === clave[0] && movimiento.referencia_id === clave[1]) visitar(movimiento);
    }
  }
  const contexto = { obtener, recorrer };
  for (const movimiento of datos.movimientos_billetera!) await validarEfectoMovimiento(contexto, movimiento);
  for (const tipo of ['ingresos', 'gastos'] as const) for (const padre of datos[tipo]!) {
    let total = 0n;
    for (const detalle of datos[`${tipo}_medios_pago`]!) if (detalle[tipo === 'ingresos' ? 'ingreso_id' : 'gasto_id'] === padre.id && detalle.eliminado_en === null) total += BigInt(Number(detalle.importe_centavos));
    if (padre.eliminado_en === null && total !== BigInt(Number(padre.importe_centavos))) throw new Error(`Los detalles de ${tipo} no coinciden con el total.`);
  }
  const esperados = new Map<string, bigint>(); const actuales = new Map<string, bigint>(); const iniciales = new Set<string>();
  /** Acumula el efecto esperado de una operación sobre una billetera, usando centavos exactos. */
  function sumar(mapa: Map<string, bigint>, tipo: string, referencia: string, billetera: string, importe: bigint) { const clave = `${tipo}/${referencia}/${billetera}`; mapa.set(clave, (mapa.get(clave) ?? 0n) + importe); }
  for (const tipo of ['ingresos', 'gastos'] as const) for (const detalle of datos[`${tipo}_medios_pago`]!) {
    const padre = indices.get(tipo)!.get(String(detalle[tipo === 'ingresos' ? 'ingreso_id' : 'gasto_id']))!;
    if (detalle.billetera_id !== null && indices.get('billeteras')!.get(String(detalle.billetera_id))!.moneda !== padre.moneda) throw new Error('Un detalle usa una billetera de otra moneda.');
    if (detalle.eliminado_en === null && padre.eliminado_en !== null) throw new Error('Una operación eliminada conserva detalles vigentes.');
    const referenciaDetalle = tipo === 'ingresos' ? 'INGRESO_MEDIO_PAGO' : 'GASTO_MEDIO_PAGO';
    const vinculado = datos.movimientos_billetera!.some(/** Reconoce un detalle migrado sin reinterpretar sus relaciones históricas. */ function coincide(movimiento) { return movimiento.referencia_tipo === referenciaDetalle && movimiento.referencia_id === detalle.id && movimiento.eliminado_en === null; });
    if (detalle.eliminado_en === null && detalle.billetera_id !== null) sumar(esperados, vinculado ? referenciaDetalle : tipo === 'ingresos' ? 'ingreso' : 'gasto', String(vinculado ? detalle.id : padre.id), String(detalle.billetera_id), BigInt(Number(detalle.importe_centavos)) * (tipo === 'ingresos' ? 1n : -1n));
  }
  for (const transferencia of datos.transferencias_billeteras!) {
    for (const id of [transferencia.billetera_origen_id, transferencia.billetera_destino_id]) if (indices.get('billeteras')!.get(String(id))!.moneda !== transferencia.moneda) throw new Error('Una transferencia mezcla monedas.');
    if (transferencia.eliminado_en === null) { sumar(esperados, 'transferencia', String(transferencia.id), String(transferencia.billetera_origen_id), -BigInt(Number(transferencia.importe_centavos))); sumar(esperados, 'transferencia', String(transferencia.id), String(transferencia.billetera_destino_id), BigInt(Number(transferencia.importe_centavos))); }
  }
  for (const ajuste of datos.ajustes_billetera!) if (ajuste.eliminado_en === null) sumar(esperados, 'ajuste', String(ajuste.id), String(ajuste.billetera_id), BigInt(Number(ajuste.diferencia_centavos)));
  for (const movimiento of datos.movimientos_billetera!) {
    if (movimiento.tipo === 'SALDO_INICIAL') {
      if (movimiento.referencia_tipo !== null || movimiento.referencia_id !== null || iniciales.has(String(movimiento.billetera_id))) throw new Error('El saldo inicial está repetido o tiene una referencia incompatible.');
      iniciales.add(String(movimiento.billetera_id)); continue;
    }
    const tipos: Record<string, string> = { INGRESO: 'ingreso', GASTO: 'gasto', TRANSFERENCIA_ENTRADA: 'transferencia', TRANSFERENCIA_SALIDA: 'transferencia', AJUSTE_POSITIVO: 'ajuste', AJUSTE_NEGATIVO: 'ajuste' };
    const tiposVigentes: Record<string, string> = { INGRESO: 'INGRESO_MEDIO_PAGO', GASTO: 'GASTO_MEDIO_PAGO', TRANSFERENCIA_ENTRADA: 'TRANSFERENCIA', TRANSFERENCIA_SALIDA: 'TRANSFERENCIA', AJUSTE_POSITIVO: 'AJUSTE', AJUSTE_NEGATIVO: 'AJUSTE' };
    if (![tipos[String(movimiento.tipo)], tiposVigentes[String(movimiento.tipo)]].includes(String(movimiento.referencia_tipo)) || movimiento.referencia_id === null) throw new Error('El tipo de movimiento no coincide con su referencia.');
    const positivo = ['INGRESO', 'TRANSFERENCIA_ENTRADA', 'AJUSTE_POSITIVO'].includes(String(movimiento.tipo));
    if (positivo ? Number(movimiento.importe_centavos) <= 0 : Number(movimiento.importe_centavos) >= 0) throw new Error('El signo del movimiento no coincide con su tipo.');
    if (movimiento.eliminado_en === null) sumar(actuales, movimiento.referencia_tipo === 'TRANSFERENCIA' ? 'transferencia' : movimiento.referencia_tipo === 'AJUSTE' ? 'ajuste' : String(movimiento.referencia_tipo), String(movimiento.referencia_id), String(movimiento.billetera_id), BigInt(Number(movimiento.importe_centavos)));
  }
  if (esperados.size !== actuales.size) throw new Error('Faltan movimientos o existen efectos financieros sin operación vigente.');
  for (const [clave, total] of esperados) if (actuales.get(clave) !== total) throw new Error('Los movimientos no coinciden con el efecto financiero de sus operaciones.');
}
