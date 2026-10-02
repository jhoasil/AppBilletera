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
] as const;

/** Presenta un identificador de icono sin guardar su SVG en los datos. */
export function IconoCatalogo({ identificador }: { identificador: string | null }) {
  /** Localiza un icono conocido y mantiene una alternativa visual para datos importados. */
  function buscar(icono: (typeof iconosCatalogo)[number]) { return icono.id === identificador; }
  const Componente = iconosCatalogo.find(buscar)?.componente ?? Category;
  return <Componente color="primary" aria-hidden="true" />;
}
