import type { DatosRespaldo, RepositorioRespaldo } from '../../core/repositories/RepositorioRespaldo';
import { validarIntegridadRespaldo } from '../contracts/validarIntegridadRespaldo';
import { tablasV1 } from '../migrations/v1';
import { baseLocal, prepararBaseLocal } from '../componerBaseLocal';
import type { ContextoDatos, RegistroDatos } from '../contracts/ContextoDatos';

/** Compara registros por columnas declaradas, independientemente del orden de las propiedades JSON. */
function mismosDatos(a: RegistroDatos, b: RegistroDatos): boolean { const claves = Object.keys(a).sort(); return claves.length === Object.keys(b).length && claves.every(/** Compara valores de una misma columna para rechazar conflictos de identidad. */ function comparar(clave) { return a[clave] === b[clave]; }); }

/** Exporta tablas completas e importa sin sobrescribir identidades ni eliminar registros históricos. */
export class RepositorioRespaldoLocal implements RepositorioRespaldo {
  /** Lee una instantánea coherente de las once tablas del esquema. */
  async exportar(): Promise<DatosRespaldo> {
    await prepararBaseLocal();
    /** Materializa el respaldo únicamente ante una exportación expresa. */
    async function leer(contexto: ContextoDatos) { const datos: DatosRespaldo = {}; for (const tabla of tablasV1) { const filas: RegistroDatos[] = []; /** Conserva todas las revisiones vigentes y borradas lógicamente. */ function agregar(registro: RegistroDatos) { filas.push(registro); } await contexto.recorrer(tabla.nombre, agregar); datos[tabla.nombre] = filas; } return datos; }
    return baseLocal.ejecutarTransaccion({ recursos: tablasV1.map(/** Obtiene los nombres declarados para delimitar las tablas de la transacción de respaldo. */ function nombre(tabla) { return tabla.nombre; }), modo: 'lectura' }, leer);
  }
  /** Valida el grafo completo y confirma todos los registros nuevos juntos; cualquier conflicto revierte. */
  async importar(datos: DatosRespaldo): Promise<void> {
    const nombres = tablasV1.map(/** Obtiene los nombres declarados para delimitar las tablas de la transacción de respaldo. */ function nombre(tabla) { return tabla.nombre; });
    if (Object.keys(datos).length !== nombres.length || Object.keys(datos).some(/** Detecta tablas ajenas al formato compatible antes de importar. */ function desconocida(nombre) { return !nombres.includes(nombre as typeof nombres[number]); })) throw new Error('El respaldo no contiene exactamente las tablas compatibles.');
    const registros = new Map<string, Map<string, RegistroDatos>>();
    for (const tabla of tablasV1) {
      const filas = datos[tabla.nombre]; if (!Array.isArray(filas)) throw new Error(`Falta la tabla ${tabla.nombre}.`);
      const indice = new Map<string, RegistroDatos>(); registros.set(tabla.nombre, indice);
      for (const fila of filas) {
        if (!fila || typeof fila !== 'object' || Array.isArray(fila) || typeof fila.id !== 'string' || indice.has(fila.id) || Object.keys(fila).length !== tabla.columnas.length || tabla.columnas.some(/** Detecta columnas obligatorias ausentes para rechazar registros incompletos. */ function ausente(columna) { return !(columna.nombre in fila); })) throw new Error(`Registro inválido o repetido en ${tabla.nombre}.`);
        indice.set(fila.id, fila);
      }
    }
    for (const tabla of tablasV1) for (const fila of datos[tabla.nombre]!) for (const columna of tabla.columnas) if (columna.referencia && fila[columna.nombre] !== null && !registros.get(columna.referencia)?.has(String(fila[columna.nombre]))) throw new Error(`Referencia incompleta en ${tabla.nombre}.${columna.nombre}.`);
    for (const tipo of ['ingresos', 'gastos'] as const) for (const padre of datos[tipo]!) {
      let total = 0n; for (const detalle of datos[`${tipo}_medios_pago`]!) if (detalle[`${tipo === 'ingresos' ? 'ingreso' : 'gasto'}_id`] === padre.id && detalle.eliminado_en === null) total += BigInt(Number(detalle.importe_centavos));
      if (padre.eliminado_en === null && total !== BigInt(Number(padre.total_centavos))) throw new Error(`Los detalles de ${tipo} no coinciden con el total.`);
    }
    for (const movimiento of datos.movimientos_billetera!) {
      const referencias: Record<string, string> = { ingreso: 'ingresos', gasto: 'gastos', transferencia: 'transferencias_billeteras', ajuste: 'ajustes_billetera' };
      if ((movimiento.referencia_tipo === null) !== (movimiento.referencia_id === null) || (movimiento.referencia_tipo !== null && !registros.get(referencias[String(movimiento.referencia_tipo)] ?? '')?.has(String(movimiento.referencia_id)))) throw new Error('Un movimiento tiene una referencia inválida.');
    }
    await validarIntegridadRespaldo(datos);
    await prepararBaseLocal();
    /** Guarda en orden de dependencias; el contexto valida tipos, dinero y restricciones también al importar. */
    async function escribir(contexto: ContextoDatos) {
      const pendientes: { tabla: typeof nombres[number]; registro: RegistroDatos }[] = [];
      for (const tabla of tablasV1) for (const registro of datos[tabla.nombre]!) { const existente = await contexto.obtener(tabla.nombre, String(registro.id)); if (existente) { if (!mismosDatos(existente, registro)) throw new Error('El respaldo contiene una identidad con datos diferentes. Importalo en una instalación vacía o conservá ambos respaldos.'); } else pendientes.push({ tabla: tabla.nombre, registro }); }
      // Billeteras precede a medios de pago, que pueden referenciar una billetera predeterminada.
      const orden = ['actividades', 'categorias_gasto', 'billeteras', 'medios_pago', 'ingresos', 'gastos', 'ingresos_medios_pago', 'gastos_medios_pago', 'transferencias_billeteras', 'ajustes_billetera', 'movimientos_billetera'];
      for (const tabla of orden) for (const pendiente of pendientes) if (pendiente.tabla === tabla) await contexto.guardar(pendiente.tabla, pendiente.registro, true);
    }
    return baseLocal.ejecutarTransaccion({ recursos: nombres, modo: 'escritura' }, escribir);
  }
}
