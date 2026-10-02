import { EstructuraPrincipal } from './navegacion/EstructuraPrincipal';
import { usePaginaActual } from './navegacion/usePaginaActual';
import { PaginaInicio } from '../modulos/inicio/PaginaInicio';
import { PaginaIngresos } from '../modulos/ingresos/PaginaIngresos';
import { PaginaGastos } from '../modulos/gastos/PaginaGastos';
import { PaginaReportes } from '../modulos/reportes/PaginaReportes';
import { PaginaAjustes } from '../modulos/ajustes/PaginaAjustes';

const paginas = {
  inicio: <PaginaInicio />,
  ingresos: <PaginaIngresos />,
  gastos: <PaginaGastos />,
  reportes: <PaginaReportes />,
  ajustes: <PaginaAjustes />,
};

/** Muestra una única página dentro de la navegación compartida por todas las pantallas. */
export function Aplicacion() {
  const paginaActual = usePaginaActual();
  return (
    <EstructuraPrincipal paginaActual={paginaActual}>
      {paginas[paginaActual]}
    </EstructuraPrincipal>
  );
}
