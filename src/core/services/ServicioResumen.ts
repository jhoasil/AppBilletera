import type { RepositorioResumen } from '../repositories/RepositorioResumen';

/** Coordina consultas de resultado sin conocer el motor de persistencia. */
export class ServicioResumen {
  /** Recibe el puerto que agrega importes exactos por moneda. */
  constructor(private readonly repositorio: RepositorioResumen) {}
  /** Valida un período calendario inclusivo antes de consultar. */
  consultar(desde: string, hasta: string) {
    for (const fecha of [desde, hasta]) if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || new Date(`${fecha}T00:00:00Z`).toISOString().slice(0, 10) !== fecha) throw new Error('Seleccioná fechas válidas.');
    if (desde > hasta) throw new Error('El inicio del período no puede superar su fin.');
    return this.repositorio.consultar(desde, hasta);
  }
}
