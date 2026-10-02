import type { ReactNode, MouseEventHandler } from 'react';
import Button from '@mui/material/Button';

/** Texto, estado y evento de una acción principal. */
interface PropiedadesBotonAccion {
  etiqueta: string;
  icono?: ReactNode;
  alPulsar?: MouseEventHandler<HTMLButtonElement>;
  tipo?: 'button' | 'submit' | 'reset';
  deshabilitado?: boolean;
  pendiente?: boolean;
  anchoCompleto?: boolean;
  color?: 'primary' | 'success' | 'error';
}

/** Mantiene el tamaño táctil y la apariencia común de acciones y envíos de formularios. */
export function BotonAccion({
  etiqueta, icono, alPulsar, tipo = 'button', deshabilitado = false,
  pendiente = false, anchoCompleto = false, color = 'primary',
}: PropiedadesBotonAccion) {
  return (
    <Button variant="contained" size="large" type={tipo} color={color}
      startIcon={icono} onClick={alPulsar} disabled={deshabilitado}
      loading={pendiente} fullWidth={anchoCompleto} aria-busy={pendiente}>
      {etiqueta}
    </Button>
  );
}
