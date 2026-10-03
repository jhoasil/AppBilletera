import type { Components, Theme } from '@mui/material/styles';

/** Valores compartidos para superficies compactas y controles cómodos al tacto. */
export const componentes: Components<Theme> = {
  MuiButtonBase: {
    styleOverrides: { root: { '&.Mui-focusVisible': { outline: '3px solid currentColor', outlineOffset: 3 } } },
  },
  MuiDialog: { defaultProps: { fullWidth: true, maxWidth: 'sm' } },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: { root: { minHeight: 48, borderRadius: 12 } },
  },
  MuiIconButton: {
    styleOverrides: { root: { minWidth: 48, minHeight: 48 } },
  },
  MuiCard: {
    defaultProps: { variant: 'outlined' },
    styleOverrides: { root: { borderRadius: 16 } },
  },
  MuiTextField: {
    defaultProps: { fullWidth: true, variant: 'outlined' },
  },
  MuiOutlinedInput: {
    styleOverrides: { root: { borderRadius: 12 } },
  },
  MuiAppBar: {
    defaultProps: { color: 'default', elevation: 0 },
  },
};
