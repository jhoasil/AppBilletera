import type { PropsWithChildren } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { tema } from './tema';

/**
 * Aplica el tema central y normaliza los estilos del navegador para que
 * todas las pantallas compartan la misma base visual de Material UI.
 */
export function ProveedorTema({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={tema}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
