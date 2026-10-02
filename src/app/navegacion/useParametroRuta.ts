import { useEffect, useState } from 'react';

/** Sigue un parámetro del fragmento para conservar enlaces, recargas y navegación entre detalles. */
export function useParametroRuta(nombre: string): string {
  /** Lee solamente el parámetro solicitado, sin ejecutar contenido de la dirección. */
  function leer() { return new URLSearchParams(window.location.hash.split('?')[1] ?? '').get(nombre) ?? ''; }
  const [valor, establecerValor] = useState(leer);
  /** Suscribe la selección a los cambios del fragmento. */
  function escuchar() {
    /** Actualiza incluso cuando cambia la identidad dentro de la misma página. */
    function actualizar() { establecerValor(leer()); }
    actualizar(); window.addEventListener('hashchange', actualizar);
    /** Retira la suscripción cuando se abandona la pantalla. */
    function cancelar() { window.removeEventListener('hashchange', actualizar); }
    return cancelar;
  }
  useEffect(escuchar, [nombre]);
  return valor;
}
