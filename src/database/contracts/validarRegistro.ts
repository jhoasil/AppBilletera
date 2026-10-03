import type { ContextoDatos, RegistroDatos } from './ContextoDatos';
import type { NombreTabla } from '../migrations/EsquemaBaseDatos';
import { tablasV1 } from '../migrations/v1';

/** Valida el esquema y las FK en el contexto actual para compartir integridad entre motores. */
export async function validarRegistro(contexto: Pick<ContextoDatos, 'obtener'>, tabla: NombreTabla, registro: RegistroDatos): Promise<void> {
    const definicion = tablasV1.find(buscarTabla);
    /** Localiza la definición física de la tabla solicitada. */
    function buscarTabla(candidata: (typeof tablasV1)[number]) { return candidata.nombre === tabla; }
    if (!definicion) throw new Error('La tabla no pertenece al esquema disponible.');
    for (const columna of definicion.columnas) {
      const valor = registro[columna.nombre];
      if (valor === null && columna.permiteNulo) continue;
      let valido = false;
      switch (columna.tipo) {
        case 'entero': valido = typeof valor === 'number' && Number.isSafeInteger(valor) && valor >= (columna.minimo ?? -Number.MAX_SAFE_INTEGER) && valor <= (columna.maximo ?? Number.MAX_SAFE_INTEGER) && (!columna.distintoDeCero || valor !== 0); break;
        case 'booleano': valido = typeof valor === 'boolean'; break;
        case 'uuid': valido = typeof valor === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor); break;
        case 'moneda': valido = typeof valor === 'string' && /^[A-Z]{3}$/.test(valor); break;
        case 'fecha': valido = typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor) && !Number.isNaN(Date.parse(valor)) && new Date(valor).toISOString().slice(0, 10) === valor; break;
        case 'instante': valido = typeof valor === 'string' && !Number.isNaN(Date.parse(valor)) && new Date(valor).toISOString() === valor; break;
        case 'texto': valido = typeof valor === 'string'; break;
      }
      if (!valido || (columna.valoresPermitidos && !columna.valoresPermitidos.includes(String(valor)) && !(tabla === 'movimientos_billetera' && columna.nombre === 'referencia_tipo' && ['INGRESO_MEDIO_PAGO', 'GASTO_MEDIO_PAGO', 'TRANSFERENCIA', 'AJUSTE'].includes(String(valor))))) throw new Error(`Valor inválido en ${tabla}.${columna.nombre}.`);
      if (columna.referencia && !(await contexto.obtener(columna.referencia, String(valor)))) throw new Error(`La referencia ${columna.nombre} no existe.`);
    }
    for (const restriccion of definicion.restricciones ?? []) {
      if (restriccion.tipo === 'distintos' && registro[restriccion.columnas[0]] === registro[restriccion.columnas[1]]) throw new Error('Origen y destino deben ser distintos.');
      if (restriccion.tipo === 'diferencia' && BigInt(registro[restriccion.resultado] as number) !== BigInt(registro[restriccion.minuendo] as number) - BigInt(registro[restriccion.sustraendo] as number)) throw new Error('La diferencia no coincide con los saldos.');
    }
}

