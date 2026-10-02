import { useContext } from 'react';
import { ContextoTema } from './ContextoTema';

/** Expone la preferencia de apariencia para que los controles puedan consultarla y modificarla. */
export function useTema() {
  const contextoTema = useContext(ContextoTema);

  if (!contextoTema) {
    throw new Error('useTema debe utilizarse dentro de ProveedorTema.');
  }

  return contextoTema;
}
