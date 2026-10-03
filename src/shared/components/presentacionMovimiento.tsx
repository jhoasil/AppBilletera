import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import Tune from '@mui/icons-material/Tune';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import type { TipoMovimientoBilletera } from '../../core/entities/MovimientoBilletera';

// La flecha hacia abajo representa entrada y la de arriba salida en todas las pantallas.
/** Clasifica exclusivamente etiquetas e iconos de presentación; no calcula efectos ni saldos. */
export function presentacionMovimiento(tipo: TipoMovimientoBilletera) {
  if (tipo === 'INGRESO') return { nombre: 'Ingreso', color: 'success.main', icono: <ArrowDownward /> };
  if (tipo === 'GASTO') return { nombre: 'Gasto', color: 'error.main', icono: <ArrowUpward /> };
  if (tipo.startsWith('TRANSFERENCIA')) return { nombre: tipo === 'TRANSFERENCIA_ENTRADA' ? 'Transferencia recibida' : 'Transferencia enviada', color: 'info.main', icono: <SwapHoriz /> };
  if (tipo.startsWith('AJUSTE')) return { nombre: tipo === 'AJUSTE_POSITIVO' ? 'Ajuste positivo' : 'Ajuste negativo', color: 'secondary.main', icono: <Tune /> };
  return { nombre: 'Saldo inicial', color: 'text.secondary', icono: <AccountBalanceWallet /> };
}
