import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Aplicacion } from './app/Aplicacion';
import { ProveedorTema } from './app/tema/ProveedorTema';

const elementoRaiz = document.getElementById('raiz');

if (!elementoRaiz) {
  throw new Error('No se encontró el elemento raíz de AppBilletera.');
}

createRoot(elementoRaiz).render(
  <StrictMode>
    <ProveedorTema>
      <Aplicacion />
    </ProveedorTema>
  </StrictMode>,
);
