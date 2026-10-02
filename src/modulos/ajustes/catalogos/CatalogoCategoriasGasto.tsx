import type { CategoriaGasto } from '../../../nucleo/entidades/CategoriaGasto';
import { servicioCategorias } from '../../../app/datos/serviciosCatalogos';
import { EditorCatalogo } from './EditorCatalogo';
import { CampoTextoCatalogo } from '../../../compartido/componentes/CampoTextoCatalogo';

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
  return <><CampoTextoCatalogo etiqueta="Identificador del icono" valor={categoria.icono ?? ''} alCambiar={icono} />
    <CampoTextoCatalogo etiqueta="Color hexadecimal (opcional)" valor={categoria.color ?? ''} alCambiar={color} /></>;
}

/** Habilita listar, crear, editar y cambiar la disponibilidad conservando registros históricos. */
export function CatalogoCategoriasGasto() {
  return <EditorCatalogo singular="categoría de gasto" servicio={servicioCategorias} crearNuevo={crearCategoria} campos={campos} />;
}
