import { lazy, Suspense } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { EstructuraPrincipal } from './navegacion/EstructuraPrincipal';
import { usePaginaActual } from './navegacion/usePaginaActual';
import { PaginaInicio } from '../modulos/inicio/PaginaInicio';
import { PaginaIngresos } from '../modulos/ingresos/PaginaIngresos';
import { PaginaGastos } from '../modulos/gastos/PaginaGastos';
import { PaginaReportes } from '../modulos/reportes/PaginaReportes';

/** Carga los editores de catálogos al abrir Ajustes para reducir el paquete inicial. */
async function cargarAjustes() {
  const modulo = await import('../modulos/ajustes/PaginaAjustes');
  return { default: modulo.PaginaAjustes };
}
const PaginaAjustes = lazy(cargarAjustes);

/** Carga las transferencias cuando se abre su pantalla, sin agrandar el paquete inicial. */
async function cargarTransferencia() { const modulo = await import('../modulos/billeteras/PaginaTransferencia'); return { default: modulo.PaginaTransferencia }; }
const PaginaTransferencia = lazy(cargarTransferencia);
/** Carga la consulta de patrimonio únicamente cuando se abre Billeteras. */
async function cargarBilleteras() { const modulo = await import('../modulos/billeteras/PaginaBilleteras'); return { default: modulo.PaginaBilleteras }; }
const PaginaBilleteras = lazy(cargarBilleteras);

const paginas = {
  inicio: <PaginaInicio />,
  ingresos: <PaginaIngresos />,
  gastos: <PaginaGastos />,
  reportes: <PaginaReportes />,
  ajustes: <PaginaAjustes />,
  transferencias: <PaginaTransferencia />,
  billeteras: <PaginaBilleteras />,
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
