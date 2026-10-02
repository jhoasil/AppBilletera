import { baseWeb, prepararBaseWeb } from '../web/baseWeb';
import { convertirRegistro, type ContextoWeb } from '../web/ContextoWeb';
import { datosIniciales } from './datosIniciales';

/** Inserta una sola vez los catálogos sugeridos y conserva cambios y desactivaciones posteriores. */
export async function prepararDatosIniciales(): Promise<void> {
  await prepararBaseWeb();
  /** Inserta todos los datos y su marca de preparación como una sola operación atómica. */
  async function insertar(contexto: ContextoWeb) {
    if (await contexto.obtenerMarca('datos_iniciales_v1')) return;
    const instante = new Date().toISOString();
    /** Crea una identidad local y la auditoría del registro sugerido. */
    function auditoria() { return { id: crypto.randomUUID(), creadoEn: instante, actualizadoEn: instante, eliminadoEn: null, activo: true }; }
    const billetera = { ...auditoria(), nombre: 'Efectivo', tipo: 'efectivo', icono: 'payments', color: '#00843d', moneda: 'ARS', conciliadoEn: null };
    await contexto.guardar('billeteras', convertirRegistro(billetera), true);
    for (const actividad of datosIniciales.actividades) await contexto.guardar('actividades', convertirRegistro({ ...auditoria(), ...actividad, descripcion: null, fechaInicio: null, fechaFin: null, estado: 'activo' }), true);
    for (const categoria of datosIniciales.categorias) await contexto.guardar('categorias_gasto', convertirRegistro({ ...auditoria(), ...categoria }), true);
    for (const [orden, medio] of datosIniciales.medios.entries()) await contexto.guardar('medios_pago', convertirRegistro({ ...auditoria(), ...medio, orden, mostrarEnCargaRapida: true, billeteraPredeterminadaId: orden === 0 ? billetera.id : null }), true);
    await contexto.guardarMarca('datos_iniciales_v1');
  }
  await baseWeb.ejecutarTransaccion({ recursos: ['actividades', 'categorias_gasto', 'medios_pago', 'billeteras', '_metadatos'], modo: 'escritura' }, insertar);
}
