import { createContext, type Dispatch, type SetStateAction } from 'react';

/** Datos de presentación de una subpantalla; el retorno conserva su destino explícito. */
export interface CabeceraContextual { titulo: string; icono?: string | null; color?: string | null; href?: string; alVolver: () => void; deshabilitado: boolean; etiqueta: string }
/** Comunica una cabecera contextual al marco sin cambiar la ruta ni duplicar navegación. */
export const ContextoCabecera = createContext<Dispatch<SetStateAction<CabeceraContextual | null>> | null>(null);
