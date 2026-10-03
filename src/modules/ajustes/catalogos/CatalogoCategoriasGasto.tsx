import type { CategoriaGasto } from '../../../core/entities/CategoriaGasto';
import { servicioCategorias } from '../../../app/data/serviciosCatalogos';
import { EditorCatalogo } from './EditorCatalogo';
import { SelectorIcono } from '../../../shared/components/SelectorIcono';
import { SelectorColor } from '../../../shared/components/SelectorColor';

/** Prepara una categoría editable sin asignar identidad antes del guardado. */
function crearCategoria(): CategoriaGasto {
  return { id: '', nombre: '', activo: true, icono: 'category', color: null, creadoEn: '', actualizadoEn: '', eliminadoEn: null };
}

/** Presenta metadatos visuales opcionales sin fijar categorías en las reglas de gastos. */
function campos(categoria: CategoriaGasto, actualizar: (cambios: Partial<CategoriaGasto>) => void) {
  /** Actualiza el icono almacenado como identificador, sin SVG. */
  function icono(valor: string) { actualizar({ icono: valor || null }); }
  /** Actualiza el color opcional elegido para clasificar gastos. */
  function color(valor: string) { actualizar({ color: valor || null }); }
  return <><SelectorIcono valor={categoria.icono ?? 'category'} alCambiar={icono} />
    <SelectorColor valor={categoria.color} alCambiar={color} /></>;
}

/** Busca nombres del catálogo sin consultar operaciones históricas. */
function textoBusqueda(categoria: CategoriaGasto) { return categoria.nombre; }

// El modelo vigente no tiene descripción: la fila muestra solamente sus datos reales.

/** Habilita listar, crear, editar y cambiar la disponibilidad conservando registros históricos. */
export function CatalogoCategoriasGasto() {
  return <EditorCatalogo singular="categoría de gasto" etiquetaCrear="Nueva categoría" alturaTarjeta={80} tamanoIcono={44} textoBusqueda={textoBusqueda} servicio={servicioCategorias} crearNuevo={crearCategoria} campos={campos} />;
}
