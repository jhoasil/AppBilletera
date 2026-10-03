import type { Components, Theme } from '@mui/material/styles';
import { tokensVisuales as tokens } from './tokens';

/** Valores compartidos para superficies compactas y controles cómodos al tacto. */
export const componentes: Components<Theme> = {
  MuiCssBaseline: { styleOverrides: { summary: { cursor: 'pointer', minHeight: 44, display: 'list-item', paddingTop: 12, '&:focus-visible': { outline: '3px solid currentColor', outlineOffset: 2 } } } },
  MuiButtonBase: {
    styleOverrides: { root: { '&.Mui-focusVisible': { outline: '3px solid currentColor', outlineOffset: 3 } } },
  },
  MuiDialog: { defaultProps: { fullWidth: true, maxWidth: 'sm' }, styleOverrides: { paper: /** Centraliza la elevación de diálogos según el tema. */ function dialogo({ theme }) { return { borderRadius: tokens.radioDialogo, boxShadow: theme.palette.mode === 'dark' ? tokens.sombraOscura : tokens.sombraDialogo }; } } },
  MuiDialogContent: { styleOverrides: { root: { padding: 24 } } },
  MuiDrawer: { styleOverrides: { anchorBottom: { '& .MuiDrawer-paper': { borderRadius: `${tokens.radioBottomSheet}px ${tokens.radioBottomSheet}px 0 0` } } } },
  MuiToolbar: { styleOverrides: { root: { minHeight: `${tokens.alturaAppBar}px !important` } } },
  MuiBottomNavigation: { styleOverrides: { root: { height: tokens.alturaNavegacion } } },
  MuiToggleButton: { styleOverrides: { root: { minHeight: 44, textTransform: 'none' } } },
  // Los chips describen estados; su tamaño no se utiliza como área táctil de acción.
  MuiChip: { styleOverrides: { root: { borderRadius: 8, fontSize: 12 }, sizeSmall: { minHeight: 24 } } },
  MuiPaper: { styleOverrides: { rounded: { borderRadius: tokens.radioTarjeta } } },
  MuiCardContent: { styleOverrides: { root: { padding: 16, '&:last-child': { paddingBottom: 16 } } } },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: { root: { minHeight: tokens.alturaBoton, borderRadius: tokens.radioInput } },
  },
  MuiIconButton: {
    styleOverrides: { root: { minWidth: 48, minHeight: 48 } },
  },
  MuiCard: {
    defaultProps: { variant: 'outlined' },
    styleOverrides: { root: /** Distingue superficies con una sombra discreta y bordes en ambos temas. */ function tarjeta({ theme }) { return { borderRadius: tokens.radioTarjeta, boxShadow: theme.palette.mode === 'dark' ? tokens.sombraOscura : tokens.sombraTarjeta }; } },
  },
  MuiTextField: {
    defaultProps: { fullWidth: true, variant: 'outlined' },
  },
  MuiOutlinedInput: {
    styleOverrides: { root: { borderRadius: tokens.radioInput, minHeight: tokens.alturaInput } },
  },
  MuiAppBar: {
    defaultProps: { color: 'default', elevation: 0 },
  },
};
