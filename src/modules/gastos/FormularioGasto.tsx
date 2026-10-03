import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FormularioOperacionRapida, type CargaOperacion } from '../../shared/components/FormularioOperacionRapida';
import type { CargaGasto } from '../../core/services/CargaGasto';

/** Conecta la carga de gasto a una acción de aplicación sin acceder a persistencia desde la pantalla. */
export interface PropiedadesFormularioGasto { alGuardar?: (carga: CargaGasto) => Promise<void>; inicial?: CargaGasto; alCompletar?: () => void }

/** Precarga categoría y actividad opcional; reutiliza el cálculo exacto y los medios rápidos. */
export function FormularioGasto({ alGuardar, inicial, alCompletar }: PropiedadesFormularioGasto) {
  /** Adapta una actividad opcional a la selección vacía del formulario y conserva su referencia estable. */
  function preparar() { return inicial ? { ...inicial, actividadId: inicial.actividadId ?? '' } : undefined; }
  const datosIniciales = useMemo(preparar, [inicial]);
  /** Convierte la selección vacía a null sin modificar las distribuciones monetarias. */
  async function guardar(carga: CargaOperacion) { if (alGuardar) await alGuardar({ ...carga, actividadId: carga.actividadId || null }); }
  return <Stack spacing={2}><Typography variant="body2" color="text.secondary">Indicá la categoría y descripción del gasto. Asociá una actividad cuando corresponda; cada importe saldrá de la billetera que selecciones.</Typography><FormularioOperacionRapida tipo="gasto" {...(datosIniciales ? { inicial: datosIniciales } : {})} {...(alGuardar ? { alGuardar: guardar } : {})} {...(alCompletar ? { alCompletar } : {})} /></Stack>;
}
