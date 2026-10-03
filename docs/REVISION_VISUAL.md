# Revisión visual

## Revisión vigente — TAREA 066

Fecha: 02/10/2026. Referencias: AGENTS.md, GUIA_VISUAL.md y PANTALLAS.md.

Se revisaron la estructura y los componentes de Inicio, ingreso y gasto (formularios y listados), transferencia, billeteras y detalle, conciliación y movimiento faltante, los cuatro catálogos, Reportes, Ajustes y Apariencia. La revisión conserva las reglas financieras y la persistencia existentes.

### Inspección manual en navegador local

Se recorrieron pantallas sin guardar operaciones, transferencias ni ajustes. Se utilizaron los datos disponibles: una billetera, catálogos precargados y listados financieros vacíos. Las muestras visuales fueron:

| Ancho | Pantallas inspeccionadas |
| --- | --- |
| 320 px | Inicio, Reportes, detalle, conciliación, movimiento faltante y listado de ingresos |
| 390 px | Nuevo ingreso, Medios de pago y catálogo de Billeteras |
| 430 px | Nuevo gasto |
| 600 px | Transferencia |
| 768 px | Apariencia y vistas previas |
| 1024 px | Listado de billeteras y navegación lateral |
| 1440 px | Reportes |

Las muestras móviles mantienen navegación inferior, campos legibles y acciones accesibles mediante scroll vertical; escritorio utiliza el lateral. Las consultas de ancho de Inicio, Reportes y movimiento faltante en 320 px no mostraron desborde horizontal. Esto no equivale a verificar cada combinación de pantalla, ancho, tema y contenido.

Se inspeccionaron superficies claras y oscuras y la selección Sistema. El comportamiento ante cambios del sistema operativo se revisó en ProveedorTema; no se simuló un cambio del dispositivo. Se restauró la preferencia Claro que estaba seleccionada antes de alternar los modos en la vista de revisión.

### Consistencia y correcciones

- Ingreso y gasto comparten FormularioOperacionRapida, campos, total y acción de guardado.
- Los catálogos comparten EditorCatalogo, tarjetas, iconos, chips, búsqueda y acciones de disponibilidad; conservan registros inactivos.
- El estado de actividad y su disponibilidad utilizan etiquetas diferentes para evitar mostrar simultáneamente «Activa» e «Inactiva» sin contexto.
- Los importes recientes de Inicio usan 20 px, negrita y cifras tabulares. Nombres largos, acciones y paginación pueden envolver en pantallas pequeñas.
- Los radios de Apariencia y de los contenedores de iconos utilizan los tokens centrales, evitando la multiplicación implícita de shape.borderRadius en sx.
- Las áreas seguras laterales y la inferior se conservan también en anchos mayores; la barra superior respeta las laterales.
- Ingreso, gasto, transferencia y ajuste se distinguen mediante texto, signo cuando corresponde, icono y color. Reportes mantiene separado el patrimonio del resultado.
- Se revisaron conceptualmente márgenes, tipografía, sombras, contraste semántico, foco visible, errores y bloqueos durante escrituras. Se observaron estados de carga, vacíos y controles deshabilitados; no se provocaron fallos de persistencia.

### Límites del alcance

CategoriaGasto no tiene descripción persistida: el catálogo muestra «Sin descripción configurada». Agregar ese atributo requiere una tarea funcional con su migración; esta revisión no lo inventa.

El proveedor de tema soporta Sistema, Claro y Oscuro, pero no una preferencia de color principal. Apariencia conserva esas capacidades y muestra vistas previas con las paletas centrales, sin introducir otra configuración ni otro ThemeProvider.

Los listados con muchas operaciones, nombres extremos y estados de escritura se revisaron conceptualmente en el código; no se generaron datos de prueba. No se validaron dispositivos físicos, cambios reales del sistema operativo ni áreas seguras nativas en ejecución.

### Validación

Verificación de tipos y compilación de producción correctas. Diff revisado y git diff --check sin errores.

Tests: no creados ni ejecutados.

## Antecedente — TAREA 045

La revisión histórica inspeccionó Inicio, carga de ingresos y Apariencia en 390, 768 y 1440 px, con modos claro y oscuro. Incorporó áreas seguras, ajuste de títulos y foco visible. La revisión vigente amplía ese alcance sin convertir el antecedente en una especificación normativa.
