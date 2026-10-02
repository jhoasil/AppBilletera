import Stack from '@mui/material/Stack';
import { CabeceraPagina } from '../../compartido/componentes/CabeceraPagina';
import { FormularioGasto } from './FormularioGasto';
import { servicioGastos } from '../../app/datos/servicioGastos';
import type { CargaGasto } from '../../nucleo/servicios/CargaGasto';

/** Presenta Gastos con los componentes comunes hasta incorporar su funcionalidad. */
export function PaginaGastos() {
  /** Conecta la carga a la transacción de gasto, detalles y salidas de billetera. */
  function guardar(carga: CargaGasto) { return servicioGastos.crear(carga); }
  return (
    <Stack spacing={3}>
      <CabeceraPagina titulo="Gastos" />
      <FormularioGasto alGuardar={guardar} />
    </Stack>
  );
}
