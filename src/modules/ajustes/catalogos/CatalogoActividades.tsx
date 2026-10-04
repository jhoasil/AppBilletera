import Box from '@mui/material/Box';
import { IconoCatalogo } from '../../../shared/components/IconoCatalogo';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { Actividad } from '../../../core/entities/Actividad';
import { servicioActividades } from '../../../app/data/serviciosCatalogos';
import { SelectorCatalogo } from '../../../shared/components/SelectorCatalogo';
import { SelectorIcono } from '../../../shared/components/SelectorIcono';
import { SelectorColor } from '../../../shared/components/SelectorColor';
import { CampoTextoCatalogo } from '../../../shared/components/CampoTextoCatalogo';
import { EditorCatalogo } from './EditorCatalogo';

/** Inicializa la actividad con identidad pendiente y fechas opcionales. */
function crearActividad(): Actividad {
  return { id: '', nombre: '', tipo: 'servicio', descripcion: null, icono: 'work_outline', color: null, fechaInicio: null, fechaFin: null, estado: 'activo', activo: true, creadoEn: '', actualizadoEn: '', eliminadoEn: null };
}

/** Resume el tipo y estado para consultar rápidamente la actividad. */
function detalle(actividad: Actividad) { return <Stack spacing={0.5}><Chip size="small" sx={{ alignSelf: 'flex-start', bgcolor: 'action.selected', color: 'primary.main' }} label={actividad.tipo.replaceAll('_', ' ')} /><Typography variant="caption" color="text.secondary">{actividad.fechaInicio ? new Date(`${actividad.fechaInicio}T12:00:00`).toLocaleDateString('es-AR') : 'Sin fecha inicial'} — {actividad.fechaFin ? new Date(`${actividad.fechaFin}T12:00:00`).toLocaleDateString('es-AR') : 'Actualidad'}{actividad.estado !== 'activo' ? ` · ${actividad.estado}` : ''}</Typography></Stack>; }

/** Incluye nombre y tipo para buscar sin recorrer operaciones financieras. */
function textoBusqueda(actividad: Actividad) { return `${actividad.nombre} ${actividad.tipo}`; }

/** Presenta los campos de actividad, fechas, estado y selectores visuales. */
function campos(actividad: Actividad, actualizar: (cambios: Partial<Actividad>) => void) {
  /** Actualiza la clasificación libre de la actividad. */
  function tipo(valor: string) { actualizar({ tipo: valor }); }
  /** Actualiza la descripción opcional. */
  function descripcion(valor: string) { actualizar({ descripcion: valor || null }); }
  /** Actualiza el comienzo del período. */
  function inicio(valor: string) { actualizar({ fechaInicio: valor || null }); }
  /** Actualiza el cierre del período. */
  function fin(valor: string) { actualizar({ fechaFin: valor || null }); }
  /** Elige únicamente estados válidos para la actividad. */
  function estado(valor: string) { if (valor === 'activo' || valor === 'finalizado' || valor === 'archivado') actualizar({ estado: valor }); }
  /** Actualiza el icono por su identificador. */
  function icono(valor: string) { actualizar({ icono: valor }); }
  /** Actualiza el color opcional sin modificar el tema global. */
  function color(valor: string) { actualizar({ color: valor || null }); }
  return <><SelectorCatalogo etiqueta="Tipo *" etiquetaExterior valor={actividad.tipo} alCambiar={tipo} obligatorio opciones={[...new Set(['trabajo', 'servicio', 'trabajo_temporal', 'comercio', actividad.tipo])].map(/** Conserva también tipos personalizados ya guardados. */ function opcion(valor) { return { id: valor, nombre: valor.replaceAll('_', ' ') }; })} />
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}><Box component="details"><Box component="summary" sx={{ cursor: 'pointer', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>Color <Box component="span" sx={{ display: 'inline-block', width: 20, height: 20, borderRadius: '50%', bgcolor: actividad.color ?? 'primary.main', verticalAlign: 'middle' }} /></Box><SelectorColor valor={actividad.color} alCambiar={color} /></Box><Box component="details"><Box component="summary" sx={{ cursor: 'pointer', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>Icono <IconoCatalogo identificador={actividad.icono} /></Box><SelectorIcono valor={actividad.icono} alCambiar={icono} /></Box></Box>
    <CampoTextoCatalogo etiqueta="Descripción (opcional)" multilinea etiquetaExterior valor={actividad.descripcion ?? ''} alCambiar={descripcion} />
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2, '@media (max-width:359px)': { gridTemplateColumns: '1fr' } }}><CampoTextoCatalogo etiqueta="Fecha inicio (opcional)" etiquetaExterior valor={actividad.fechaInicio ?? ''} alCambiar={inicio} tipo="date" /><CampoTextoCatalogo etiqueta="Fecha fin (opcional)" etiquetaExterior valor={actividad.fechaFin ?? ''} alCambiar={fin} tipo="date" /></Box>
    <SelectorCatalogo etiqueta="Estado" etiquetaExterior valor={actividad.estado} alCambiar={estado} obligatorio opciones={[{ id: 'activo', nombre: 'Activo' }, { id: 'finalizado', nombre: 'Finalizado' }, { id: 'archivado', nombre: 'Archivado' }]} /></>;

}

/** Administra actividades reutilizando su identidad para ingresos, gastos y trabajos. */
export function CatalogoActividades({ alVolver }: { alVolver?: () => void }) {
  return <EditorCatalogo actividad {...(alVolver ? { alVolver } : {})} singular="actividad" etiquetaCrear="Nueva actividad" alturaTarjeta={88} tamanoIcono={40} textoBusqueda={textoBusqueda} servicio={servicioActividades} crearNuevo={crearActividad} campos={campos} detalle={detalle} />;
}
