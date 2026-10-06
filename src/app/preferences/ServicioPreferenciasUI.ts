/** Preferencias de selección: contienen únicamente UUID de catálogos, nunca importes ni operaciones. */
export type ClavePreferencia = 'ultima_actividad_ingreso' | 'ultima_actividad_gasto' | 'ultima_categoria_gasto' | `ultima_billetera_medio_${string}`;

/** Recuerda selecciones de interfaz sin convertir localStorage en almacenamiento financiero. */
export class ServicioPreferenciasUI {
  /** Lee un UUID válido; almacenamiento bloqueado o corrupto equivale a una selección vacía. */
  obtener(clave: ClavePreferencia): string | null {
    try {
      const valor = localStorage.getItem(clave);
      return valor && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor) ? valor : null;
    } catch { return null; }
  }

  /** Recuerda una selección confirmada o la limpia; un fallo de preferencia no invalida un guardado. */
  recordar(clave: ClavePreferencia, id: string | null): void {
    try {
      if (id === null) localStorage.removeItem(clave);
      else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) localStorage.setItem(clave, id);
    } catch { /* La preferencia es opcional y nunca debe hacer fallar una operación financiera. */ }
  }

  /** Recupera la última selección solo si continúa disponible entre las opciones del formulario. */
  obtenerDisponible(clave: ClavePreferencia, opciones: readonly { id: string }[]): string {
    const id = this.obtener(clave);
    /** Compara identidad sin guardar información adicional del catálogo. */
    function coincide(opcion: { id: string }) { return opcion.id === id; }
    return opciones.some(coincide) ? id! : '';
  }

  /** Precarga el último destino activo del medio, o su sugerencia vigente, para nuevas operaciones. */
  obtenerBilleteraMedio(medioPagoId: string, predeterminadaId: string | null, billeteras: readonly { id: string; activo: boolean }[]): string {
    const activas = billeteras.filter(/** Excluye destinos desactivados de las nuevas sugerencias. */ function activa(billetera) { return billetera.activo; });
    const recordada = this.obtenerDisponible(`ultima_billetera_medio_${medioPagoId}`, activas);
    return recordada || (activas.some(/** Comprueba la disponibilidad de la sugerencia del catálogo. */ function predeterminada(billetera) { return billetera.id === predeterminadaId; }) ? predeterminadaId! : '');
  }

  /** Recuerda la selección explícita por medio sin almacenar importes ni alterar su catálogo. */
  recordarBilleteraMedio(medioPagoId: string, billeteraId: string | null): void {
    this.recordar(`ultima_billetera_medio_${medioPagoId}`, billeteraId);
  }
}

export const preferenciasUI = new ServicioPreferenciasUI();
