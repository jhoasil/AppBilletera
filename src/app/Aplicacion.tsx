import { lazy, Suspense } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { EstructuraPrincipal } from './navigation/EstructuraPrincipal';
import { usePaginaActual } from './navigation/usePaginaActual';
import { PaginaInicio } from '../modules/inicio/PaginaInicio';
import { PaginaIngresos } from '../modules/ingresos/PaginaIngresos';
import { PaginaGastos } from '../modules/gastos/PaginaGastos';
import { PaginaReportes } from '../modules/reportes/PaginaReportes';

/** Carga los editores de catálogos al abrir Ajustes para reducir el paquete inicial. */
async function cargarAjustes() {
  const modulo = await import('../modules/ajustes/PaginaAjustes');
  return { default: modulo.PaginaAjustes };
}
const PaginaAjustes = lazy(cargarAjustes);

/** Carga las transferencias cuando se abre su pantalla, sin agrandar el paquete inicial. */
async function cargarTransferencia() { const modulo = await import('../modules/billeteras/PaginaTransferencia'); return { default: modulo.PaginaTransferencia }; }
const PaginaTransferencia = lazy(cargarTransferencia);
/** Carga la consulta de patrimonio únicamente cuando se abre Billeteras. */
async function cargarBilleteras() { const modulo = await import('../modules/billeteras/PaginaBilleteras'); return { default: modulo.PaginaBilleteras }; }
const PaginaBilleteras = lazy(cargarBilleteras);
/** Carga el detalle financiero solamente cuando se consulta una billetera. */
async function cargarDetalleBilletera() { const modulo = await import('../modules/billeteras/PaginaDetalleBilletera'); return { default: modulo.PaginaDetalleBilletera }; }
const PaginaDetalleBilletera = lazy(cargarDetalleBilletera);

const paginas = {
  inicio: <PaginaInicio />,
  ingresos: <PaginaIngresos />,
  gastos: <PaginaGastos />,
  reportes: <PaginaReportes />,
  ajustes: <PaginaAjustes />,
  transferencias: <PaginaTransferencia />,
  billeteras: <PaginaBilleteras />,
  billetera: <PaginaDetalleBilletera />,
};

/** Muestra una única página dentro de la navegación compartida por todas las pantallas. */
export function Aplicacion() {
  const paginaActual = usePaginaActual();
  return (
    <EstructuraPrincipal paginaActual={paginaActual}>
      <Suspense fallback={<CircularProgress aria-label="Cargando página" />}>{paginas[paginaActual]}</Suspense>
    </EstructuraPrincipal>
  );
}
