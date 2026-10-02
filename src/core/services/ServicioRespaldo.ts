import type { DatosRespaldo, RepositorioRespaldo } from '../repositories/RepositorioRespaldo';

/** Formato público versionado; la versión de aplicación es informativa y no sustituye la del formato. */
export interface Respaldo { version_formato: 1; version_aplicacion: string; exportado_en: string; datos: DatosRespaldo }
/** Coordina respaldos sin conocer APIs de descarga ni motores locales. */
export class ServicioRespaldo {
  /** Recibe el puerto transaccional y la versión central de aplicación. */
  constructor(private readonly repositorio: RepositorioRespaldo, private readonly version: string) {}
  /** Serializa una instantánea completa, incluida la historia con borrado lógico. */
  async exportar(): Promise<string> { const respaldo: Respaldo = { version_formato: 1, version_aplicacion: this.version, exportado_en: new Date().toISOString(), datos: await this.repositorio.exportar() }; return JSON.stringify(respaldo, null, 2); }
  /** Valida la cabecera antes de delegar la integridad y la escritura atómica. */
  importar(texto: string): Promise<void> {
    const respaldo: unknown = JSON.parse(texto);
    if (!respaldo || typeof respaldo !== 'object' || !('version_formato' in respaldo) || respaldo.version_formato !== 1 || !('version_aplicacion' in respaldo) || typeof respaldo.version_aplicacion !== 'string' || !('exportado_en' in respaldo) || typeof respaldo.exportado_en !== 'string' || !Number.isFinite(Date.parse(respaldo.exportado_en)) || !('datos' in respaldo) || !respaldo.datos || typeof respaldo.datos !== 'object' || Array.isArray(respaldo.datos)) throw new Error('El formato o la versión del respaldo no son compatibles.');
    return this.repositorio.importar(respaldo.datos as DatosRespaldo);
  }
}
