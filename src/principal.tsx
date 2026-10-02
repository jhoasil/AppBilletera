import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Aplicacion } from './app/Aplicacion';

const elementoRaiz = document.getElementById('raiz');

if (!elementoRaiz) {
  throw new Error('No se encontró el elemento raíz de AppBilletera.');
}

createRoot(elementoRaiz).render(
  <StrictMode>
    <Aplicacion />
  </StrictMode>,
);
