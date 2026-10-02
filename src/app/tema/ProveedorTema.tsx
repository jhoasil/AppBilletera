import { useState, type PropsWithChildren } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ContextoTema, type ModoTema } from './ContextoTema';
import { temaClaro, temaOscuro } from './tema';

const claveModoTema = 'app_billetera_modo_tema';

/** Recupera una preferencia válida o usa sistema si el almacenamiento no está disponible. */
function leerModoGuardado(): ModoTema {
  try {
    const modoGuardado = localStorage.getItem(claveModoTema);
    if (modoGuardado === 'claro' || modoGuardado === 'oscuro') {
      return modoGuardado;
    }
  } catch {
    // La apariencia sigue funcionando si el navegador bloquea el almacenamiento.
  }
  return 'sistema';
}

/**
 * Aplica el tema central y normaliza los estilos del navegador para que
 * todas las pantallas compartan la misma base visual de Material UI.
 */
export function ProveedorTema({ children }: PropsWithChildren) {
  const [modo, establecerModo] = useState<ModoTema>(leerModoGuardado);
  const sistemaOscuro = useMediaQuery('(prefers-color-scheme: dark)');
  const usarOscuro = modo === 'oscuro' || (modo === 'sistema' && sistemaOscuro);

  /** Cambia la apariencia y guarda la preferencia para restaurarla al abrir la aplicación. */
  function cambiarModo(nuevoModo: ModoTema) {
    establecerModo(nuevoModo);
    try {
      localStorage.setItem(claveModoTema, nuevoModo);
    } catch {
      // Si no se puede persistir, la elección se conserva durante esta sesión.
    }
  }

  return (
    <ContextoTema.Provider value={{ modo, cambiarModo }}>
      <ThemeProvider theme={usarOscuro ? temaOscuro : temaClaro}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ContextoTema.Provider>
  );
}
