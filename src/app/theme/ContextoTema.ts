import { createContext } from 'react';

/** Preferencia de apariencia; sistema sigue los cambios del dispositivo. */
export type ModoTema = 'sistema' | 'claro' | 'oscuro';

/** Contrato para consultar y cambiar la preferencia desde cualquier pantalla. */
export interface PreferenciaTema {
  modo: ModoTema;
  cambiarModo: (modo: ModoTema) => void;
}

export const ContextoTema = createContext<PreferenciaTema | undefined>(undefined);
