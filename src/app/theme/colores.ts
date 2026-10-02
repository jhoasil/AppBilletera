import type { PaletteOptions } from '@mui/material/styles';

/** Paleta inicial inspirada en la referencia visual, centralizada para toda la interfaz. */
export const coloresClaros: PaletteOptions = {
  mode: 'light',
  primary: { main: '#005bea', contrastText: '#ffffff' },
  secondary: { main: '#475569' },
  success: { main: '#00843d' },
  error: { main: '#d92332' },
  warning: { main: '#a85b00' },
  info: { main: '#0065c8' },
  background: { default: '#f4f7fb', paper: '#ffffff' },
  text: { primary: '#101828', secondary: '#526075' },
  divider: '#dce3ed',
};

/** Paleta oscura con superficies diferenciadas y colores de estado de alto contraste. */
export const coloresOscuros: PaletteOptions = {
  mode: 'dark',
  primary: { main: '#8ab4ff', contrastText: '#101828' },
  secondary: { main: '#bac7dc' },
  success: { main: '#6edba0' },
  error: { main: '#ff8d98' },
  warning: { main: '#ffc46b' },
  info: { main: '#8ccaff' },
  background: { default: '#121821', paper: '#1d2633' },
  text: { primary: '#f2f5fa', secondary: '#bac7dc' },
  divider: '#3b495d',
};
