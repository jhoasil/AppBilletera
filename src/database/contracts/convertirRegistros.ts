import type { RegistroDatos } from './ContextoDatos';

/** Traduce propiedades camelCase de dominio a columnas snake_case de persistencia. */
export function convertirRegistro(entidad: object): RegistroDatos {
  const registro: RegistroDatos = {};
  /** Inserta un guion bajo delante de cada letra mayúscula. */
  function separarLetra(letra: string) { return `_${letra.toLowerCase()}`; }
  for (const [nombre, valor] of Object.entries(entidad)) registro[nombre.replace(/[A-Z]/g, separarLetra)] = valor;
  return registro;
}

/** Reconstruye una entidad desde columnas físicas después de obtenerla en persistencia. */
export function convertirEntidad<Entidad extends object>(registro: RegistroDatos): Entidad {
  const entidad: Record<string, unknown> = {};
  /** Restaura la letra mayúscula al comienzo de cada palabra interna. */
  function unirPalabra(_coincidencia: string, letra: string) { return letra.toUpperCase(); }
  for (const [nombre, valor] of Object.entries(registro)) entidad[nombre.replace(/_([a-z])/g, unirPalabra)] = valor;
  return entidad as Entidad;
}

