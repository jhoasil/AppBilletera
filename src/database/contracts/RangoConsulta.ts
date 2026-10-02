/** Claves portables admitidas por los índices declarativos de ambos motores. */
export type ClaveConsulta = string | number | readonly (string | number)[];
/** Rango inclusivo que evita depender de IDBKeyRange fuera del adaptador Web. */
export class RangoConsulta {
  /** Conserva los extremos opcionales sin usar APIs específicas del motor. */
  constructor(readonly inferior?: ClaveConsulta, readonly superior?: ClaveConsulta) {}
  /** Selecciona una clave exacta, simple o compuesta. */
  static unico(clave: ClaveConsulta) { return new RangoConsulta(clave, clave); }
  /** Selecciona un intervalo inclusivo entre dos claves. */
  static acotar(inferior: ClaveConsulta, superior: ClaveConsulta) { return new RangoConsulta(inferior, superior); }
  /** Selecciona desde una clave inclusive. */
  static desde(clave: ClaveConsulta) { return new RangoConsulta(clave); }
  /** Selecciona hasta una clave inclusive. */
  static hasta(clave: ClaveConsulta) { return new RangoConsulta(undefined, clave); }
}
