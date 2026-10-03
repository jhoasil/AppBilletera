/** Dimensiones y superficies compartidas por las pantallas, según la guía visual vigente. */
export const tokensVisuales = {
  espaciado: 8, radioInput: 12, radioTarjeta: 16, radioDialogo: 20, radioBottomSheet: 24,
  alturaInput: 56, alturaBoton: 48, alturaAppBar: 56, alturaNavegacion: 64, anchoFormulario: 600,
  // Por debajo de este ancho la cifra usa la fila completa junto a iconos de 40 px.
  anchoTarjetaAccesoCompacta: 210,
  sombraTarjeta: '0 2px 8px rgba(15, 23, 42, 0.06)',
  sombraElevada: '0 6px 20px rgba(15, 23, 42, 0.10)',
  sombraDialogo: '0 12px 32px rgba(15, 23, 42, 0.18)',
  sombraBottomSheet: '0 -8px 30px rgba(15, 23, 42, 0.16)',
  sombraOscura: '0 4px 16px rgba(0, 0, 0, 0.25)',
} as const;

/** Superficies y textos financieros con contraste, centralizados para ambos temas. */
export const estadosFinancieros = {
  claro: { ingreso: { fondo: '#ECFDF5', texto: '#166534' }, gasto: { fondo: '#FEF2F2', texto: '#B91C1C' }, ajuste: { fondo: '#F5F3FF', texto: '#6D28D9' } },
  oscuro: { ingreso: { fondo: '#052E16', texto: '#86EFAC' }, gasto: { fondo: '#450A0A', texto: '#FCA5A5' }, ajuste: { fondo: '#2E1065', texto: '#C4B5FD' } },
};
