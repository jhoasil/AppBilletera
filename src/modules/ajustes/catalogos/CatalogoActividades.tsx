import type { Actividad } from '../../../core/entidades/Actividad';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { servicioActividades } from '../../../app/datos/serviciosCatalogos';
import { SelectorCatalogo } from '../../../shared/componentes/SelectorCatalogo';
import { SelectorIcono } from '../../../shared/componentes/SelectorIcono';
import { SelectorColor } from '../../../shared/componentes/SelectorColor';
import { CampoTextoCatalogo } from '../../../shared/componentes/CampoTextoCatalogo';
import { EditorCatalogo } from './EditorCatalogo';

/** Inicializa la actividad con identidad pendiente y fechas opcionales. */
function crearActividad(): Actividad {
  return { id: '', nombre: '', tipo: 'servicio', descripcion: null, icono: 'work_outline', color: null, fechaInicio: null, fechaFin: null, estado: 'activo', activo: true, creadoEn: '', actualizadoEn: '', eliminadoEn: null };
}

/** Resume el tipo y estado para consultar rápidamente la actividad. */
function detalle(actividad: Actividad) { return `${actividad.tipo === 'trabajo_temporal' ? 'Trabajo temporal' : actividad.tipo} · ${actividad.estado} · ${actividad.fechaInicio ?? 'Sin inicio'} / ${actividad.fechaFin ?? 'Sin fin'} · ${actividad.activo ? 'Disponible' : 'Inactiva'}`; }

/** Presenta los campos de actividad, fechas, estado y selectores visuales. */
function campos(actividad: Actividad, actualizar: (cambios: Partial<Actividad>) => void) {
  /** Actualiza la clasificación libre de la actividad. */
  function tipo(valor: string) { actualizar({ tipo: valor }); }
  /** Clasifica el registro como trabajo temporal conservando su identidad y relaciones. */
  function temporal() { actualizar({ tipo: 'trabajo_temporal' }); }
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
  return <><CampoTextoCatalogo etiqueta="Tipo" valor={actividad.tipo} alCambiar={tipo} obligatorio />
    <Button onClick={temporal} aria-pressed={actividad.tipo === 'trabajo_temporal'}>Usar como trabajo temporal</Button>
    {actividad.tipo === 'trabajo_temporal' && <Alert severity="info">Este trabajo conserva la misma actividad para asociar múltiples ingresos y gastos. Podés finalizarlo o archivarlo sin perder su historial.</Alert>}
    <CampoTextoCatalogo etiqueta="Descripción (opcional)" valor={actividad.descripcion ?? ''} alCambiar={descripcion} />
    <CampoTextoCatalogo etiqueta="Fecha de inicio (opcional)" valor={actividad.fechaInicio ?? ''} alCambiar={inicio} tipo="date" />
    <CampoTextoCatalogo etiqueta="Fecha de fin (opcional)" valor={actividad.fechaFin ?? ''} alCambiar={fin} tipo="date" />
    <SelectorCatalogo etiqueta="Estado" valor={actividad.estado} alCambiar={estado} obligatorio opciones={[{ id: 'activo', nombre: 'Activo' }, { id: 'finalizado', nombre: 'Finalizado' }, { id: 'archivado', nombre: 'Archivado' }]} />
    <SelectorIcono valor={actividad.icono} alCambiar={icono} /><SelectorColor valor={actividad.color} alCambiar={color} /></>;
}

/** Administra actividades reutilizando su identidad para ingresos, gastos y trabajos. */
export function CatalogoActividades() {
  return <EditorCatalogo singular="actividad" servicio={servicioActividades} crearNuevo={crearActividad} campos={campos} detalle={detalle} />;
}
