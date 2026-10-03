import Box from '@mui/material/Box';
import { alpha, getContrastRatio, useTheme } from '@mui/material/styles';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import CameraAlt from '@mui/icons-material/CameraAlt';
import Code from '@mui/icons-material/Code';
import WorkOutline from '@mui/icons-material/WorkOutlineOutlined';
import FormatPaint from '@mui/icons-material/FormatPaint';
import Storefront from '@mui/icons-material/Storefront';
import Payments from '@mui/icons-material/Payments';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import CreditCard from '@mui/icons-material/CreditCard';
import LocalGasStation from '@mui/icons-material/LocalGasStation';
import Restaurant from '@mui/icons-material/Restaurant';
import SportsEsports from '@mui/icons-material/SportsEsports';
import Toll from '@mui/icons-material/Toll';
import Build from '@mui/icons-material/Build';
import Category from '@mui/icons-material/Category';
import AccountBalance from '@mui/icons-material/AccountBalance';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';

/** Selección curada de Material Icons, con etiquetas españolas y carga sin descargar SVG externos. */
export const iconosCatalogo = [
  { id: 'directions_car', nombre: 'Transporte', componente: DirectionsCar },
  { id: 'camera_alt', nombre: 'Fotografía', componente: CameraAlt },
  { id: 'code', nombre: 'Programación', componente: Code },
  { id: 'work_outline', nombre: 'Trabajo', componente: WorkOutline },
  { id: 'format_paint', nombre: 'Pintura', componente: FormatPaint },
  { id: 'storefront', nombre: 'Ventas', componente: Storefront },
  { id: 'payments', nombre: 'Efectivo', componente: Payments },
  { id: 'swap_horiz', nombre: 'Transferencia', componente: SwapHoriz },
  { id: 'credit_card', nombre: 'Tarjeta', componente: CreditCard },
  { id: 'local_gas_station', nombre: 'Combustible', componente: LocalGasStation },
  { id: 'restaurant', nombre: 'Comida', componente: Restaurant },
  { id: 'sports_esports', nombre: 'Ocio', componente: SportsEsports },
  { id: 'toll', nombre: 'Peaje', componente: Toll },
  { id: 'build', nombre: 'Mantenimiento', componente: Build },
  { id: 'category', nombre: 'Otros', componente: Category },
  { id: 'account_balance', nombre: 'Banco', componente: AccountBalance },
  { id: 'account_balance_wallet', nombre: 'Billetera', componente: AccountBalanceWallet },
] as const;

/**
 * Resuelve el icono del catálogo y su color como metadatos visuales.
 * El color importado solo se usa si es válido y legible sobre la superficie;
 * nunca modifica entidades ni reemplaza los colores semánticos del dinero.
 */
export function IconoCatalogo({ identificador, color, tamano = 40, contenedor = false }: { identificador: string | null; color?: string | null; tamano?: number; contenedor?: boolean }) {
  const tema = useTheme();
  /** Mantiene una alternativa visual para identificadores desconocidos o legados. */
  function buscar(icono: (typeof iconosCatalogo)[number]) { return icono.id === identificador; }
  const Componente = iconosCatalogo.find(buscar)?.componente ?? Category;
  const configurado = color && /^#[0-9a-f]{6}$/i.test(color) ? color : tema.palette.primary.main;
  const legible = getContrastRatio(configurado, tema.palette.background.paper) >= 3 ? configurado : tema.palette.primary.main;
  const icono = <Componente aria-hidden="true" sx={{ color: legible, fontSize: contenedor ? 28 : 24 }} />;
  return contenedor ? <Box component="span" sx={{ width: tamano, height: tamano, flexShrink: 0, display: 'inline-grid', placeItems: 'center', bgcolor: alpha(configurado, 0.14), borderRadius: '12px' }}>{icono}</Box> : icono;
}
