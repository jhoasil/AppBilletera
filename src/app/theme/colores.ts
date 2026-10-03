import type { PaletteOptions } from '@mui/material/styles';

/** Paleta inicial inspirada en la referencia visual, centralizada para toda la interfaz. */
export const coloresClaros: PaletteOptions = {
  mode: 'light',
  primary: { main: '#2563EB', contrastText: '#ffffff' },
  secondary: { main: '#7C3AED' },
  success: { main: '#16A34A', contrastText: '#052E16' },
  error: { main: '#DC2626' },
  warning: { main: '#F59E0B' },
  info: { main: '#2563EB' },
  background: { default: '#F8FAFC', paper: '#ffffff' },
  text: { primary: '#0F172A', secondary: '#475569' },
  divider: '#E2E8F0',
  action: { hover: '#F1F5F9', selected: '#EFF6FF' },
};

/** Paleta oscura con superficies diferenciadas y colores de estado de alto contraste. */
export const coloresOscuros: PaletteOptions = {
  mode: 'dark',
  primary: { main: '#3B82F6', contrastText: '#0F172A' },
  secondary: { main: '#A78BFA' },
  success: { main: '#22C55E', contrastText: '#052E16' },
  error: { main: '#EF4444', contrastText: '#450A0A' },
  warning: { main: '#F59E0B' },
  info: { main: '#3B82F6' },
  background: { default: '#0F172A', paper: '#111827' },
  text: { primary: '#F8FAFC', secondary: '#94A3B8' },
  divider: '#334155',
  action: { hover: '#1F2937', selected: '#172554' },
};
