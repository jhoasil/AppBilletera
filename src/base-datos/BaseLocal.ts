import type { AdaptadorBaseLocal, MigracionBaseLocal, OpcionesTransaccion } from './contratos/AdaptadorBaseLocal';

/**
 * Coordina el ciclo de vida sin conocer IndexedDB ni SQLite.
 * Serializa operaciones para impedir cierres o migraciones durante una transacción.
 */
export class BaseLocal<ContextoTransaccion, ContextoMigracion> {
  private inicializada = false;
  private conexionAbierta = false;
  private versionPreparada = 0;
  private cola: Promise<void> = Promise.resolve();

  /** Recibe un adaptador explícito para mantener la selección de plataforma fuera del dominio. */
  constructor(private readonly adaptador: AdaptadorBaseLocal<ContextoTransaccion, ContextoMigracion>) {}

  /** Encola una operación y mantiene la cola utilizable aunque una operación previa falle. */
  private encolar<Resultado>(operacion: () => Promise<Resultado>): Promise<Resultado> {
    const resultado = this.cola.then(operacion);
    /** Libera el siguiente turno sin ocultar el error en la promesa devuelta al solicitante. */
    function liberarTurno(): void {}
    this.cola = resultado.then(liberarTurno, liberarTurno);
    return resultado;
  }

  /**
   * Abre la base y aplica versiones consecutivas pendientes, sin permitir regresiones.
   * Cada migración es atómica; las anteriores confirmadas permanecen si una posterior falla.
   */
  inicializar(migraciones: readonly MigracionBaseLocal<ContextoMigracion>[]): Promise<void> {
    const plan = [...migraciones];
    /** Valida el plan y prepara el adaptador dentro del turno exclusivo de inicialización. */
    const preparar = async (): Promise<void> => {
      for (const [indice, migracion] of plan.entries()) {
        if (migracion.version !== indice + 1 || !migracion.descripcion.trim()) {
          throw new Error('Las migraciones deben tener descripción y versiones consecutivas desde uno.');
        }
      }
      if (this.inicializada) {
        if (plan.length !== this.versionPreparada) {
          throw new Error('Debe cerrar la base antes de cambiar el plan de migraciones.');
        }
        return;
      }
      if (this.conexionAbierta) {
        throw new Error('Debe cerrar la conexión pendiente antes de volver a inicializar.');
      }
      await this.adaptador.abrir();
      this.conexionAbierta = true;
      try {
        const versionActual = await this.adaptador.obtenerVersion();
        if (!Number.isSafeInteger(versionActual) || versionActual < 0 || versionActual > plan.length) {
          throw new Error('La versión de la base es inválida o más reciente que el plan disponible.');
        }
        for (const migracion of plan.slice(versionActual)) {
          await this.adaptador.aplicarMigracion(migracion);
        }
        this.inicializada = true;
        this.versionPreparada = plan.length;
      } catch (error) {
        try {
          await this.adaptador.cerrar();
          this.conexionAbierta = false;
        } catch (errorCierre) {
          throw new AggregateError([error, errorCierre], 'Fallaron la inicialización y el cierre de la base.');
        }
        throw error;
      }
    };
    return this.encolar(preparar);
  }

  /** Ejecuta una operación con alcance explícito; requiere inicializar antes y prohíbe anidar llamadas a esta base. */
  ejecutarTransaccion<Resultado>(
    opciones: OpcionesTransaccion,
    operacion: (contexto: ContextoTransaccion) => Promise<Resultado>,
  ): Promise<Resultado> {
    const alcance = { modo: opciones.modo, recursos: [...opciones.recursos] };
    /** Comprueba el estado y delega confirmación o reversión al motor físico. */
    const ejecutar = async (): Promise<Resultado> => {
      if (!this.inicializada) throw new Error('La base debe inicializarse antes de operar.');
      if (alcance.modo !== 'lectura' && alcance.modo !== 'escritura') {
        throw new Error('El modo de transacción debe ser lectura o escritura.');
      }
      if (alcance.recursos.length === 0 || alcance.recursos.some(recursoVacio)) {
        throw new Error('La transacción debe declarar al menos un recurso con nombre.');
      }
      return this.adaptador.ejecutarTransaccion(alcance, operacion);
    };
    /** Detecta nombres vacíos para rechazar un alcance inválido antes de acceder al motor. */
    function recursoVacio(recurso: string): boolean {
      return recurso.trim().length === 0;
    }
    return this.encolar(ejecutar);
  }

  /** Espera las operaciones previas y cierra sin eliminar datos; llamadas repetidas no tienen efecto. */
  cerrar(): Promise<void> {
    /** Cierra la conexión en su turno y actualiza el estado solamente si el motor confirma el cierre. */
    const cerrarConexion = async (): Promise<void> => {
      if (!this.conexionAbierta) return;
      await this.adaptador.cerrar();
      this.conexionAbierta = false;
      this.inicializada = false;
      this.versionPreparada = 0;
    };
    return this.encolar(cerrarConexion);
  }
}
