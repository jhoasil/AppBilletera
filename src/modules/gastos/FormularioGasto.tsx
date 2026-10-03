import type { ReactNode } from 'react';
import type { LineaCobro } from '../../core/services/CargaIngreso';
import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import { FormularioOperacionRapida, type CargaOperacion } from '../../shared/components/FormularioOperacionRapida';
import type { CargaGasto } from '../../core/services/CargaGasto';

/** Conecta la carga de gasto a una acción de aplicación sin acceder a persistencia desde la pantalla. */
export interface PropiedadesFormularioGasto { alGuardar?: (carga: CargaGasto) => Promise<void>; inicial?: CargaGasto; alCompletar?: () => void; resumenImpacto?: (moneda: string, lineas: readonly LineaCobro[]) => ReactNode }

/** Precarga categoría y actividad opcional; reutiliza el cálculo exacto y los medios rápidos. */
export function FormularioGasto({ alGuardar, inicial, alCompletar, resumenImpacto }: PropiedadesFormularioGasto) {
  /** Adapta una actividad opcional a la selección vacía del formulario y conserva su referencia estable. */
  function preparar() { return inicial ? { ...inicial, actividadId: inicial.actividadId ?? '' } : undefined; }
  const datosIniciales = useMemo(preparar, [inicial]);
  /** Convierte la selección vacía a null sin modificar las distribuciones monetarias. */
  async function guardar(carga: CargaOperacion) { if (alGuardar) await alGuardar({ ...carga, actividadId: carga.actividadId || null }); }
  // Los campos y ayudas del formulario compartido explican el destino sin repetir una introducción.
  return <Stack spacing={2}><FormularioOperacionRapida tipo="gasto" {...(resumenImpacto ? { resumenImpacto } : {})} {...(datosIniciales ? { inicial: datosIniciales } : {})} {...(alGuardar ? { alGuardar: guardar } : {})} {...(alCompletar ? { alCompletar } : {})} /></Stack>;
}
