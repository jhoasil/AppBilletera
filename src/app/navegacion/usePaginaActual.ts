import { useEffect, useState } from 'react';

/** Destinos iniciales compartidos por ambas navegaciones. */
export type Pagina = 'inicio' | 'ingresos' | 'gastos' | 'reportes' | 'ajustes' | 'transferencias';

/** Lee la ruta del fragmento y usa Inicio para rutas desconocidas. */
function leerPaginaActual(): Pagina {
  const ruta = window.location.hash.slice(2).split('?')[0]?.split('/')[0];
  if (ruta === 'ingresos' || ruta === 'gastos' || ruta === 'reportes' || ruta === 'ajustes' || ruta === 'transferencias') {
    return ruta;
  }
  return 'inicio';
}

/** Sigue las rutas para conservar recarga, enlaces directos y atrás/adelante del navegador. */
export function usePaginaActual() {
  const [paginaActual, establecerPaginaActual] = useState<Pagina>(leerPaginaActual);

  /** Escucha los cambios de ruta y libera la suscripción cuando se desmonta. */
  function escucharNavegacion() {
    /** Actualiza la página y lleva el foco al contenido para facilitar la navegación accesible. */
    function actualizarPagina() {
      establecerPaginaActual(leerPaginaActual());
      document.getElementById('contenido-principal')?.focus();
      window.scrollTo(0, 0);
    }
    window.addEventListener('hashchange', actualizarPagina);

    /** Retira el evento para evitar suscripciones duplicadas al volver a montar. */
    function dejarDeEscuchar() {
      window.removeEventListener('hashchange', actualizarPagina);
    }
    return dejarDeEscuchar;
  }

  useEffect(escucharNavegacion, []);
  return paginaActual;
}
