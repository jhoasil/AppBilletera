import type { ThemeOptions } from '@mui/material/styles';

/** Tipografía del sistema disponible offline, con jerarquía legible en pantallas móviles. */
export const tipografia: NonNullable<ThemeOptions['typography']> = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 14,
  h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
  h4: { fontSize: '1.125rem', fontWeight: 600 },
  h5: { fontSize: '1rem', fontWeight: 600 },
  h6: { fontSize: '1rem', fontWeight: 600 },
  body1: { lineHeight: 1.6 },
  body2: { lineHeight: 1.5 },
  button: { fontWeight: 600, textTransform: 'none' },
};
