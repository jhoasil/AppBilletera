# Revisión visual

## Revisión vigente — TAREA 085

Fecha: 03/10/2026. Alcance: composición de las TAREAS 067–085, según GUIA_VISUAL.md, sección 91, y PANTALLAS.md, sección 51.

### Resultado y diferencias deliberadas

Inicio, formularios de ingreso/gasto, listados, transferencia, billeteras, detalle, conciliación, movimiento faltante, los cuatro catálogos, Reportes, Ajustes y Apariencia comparten cabeceras, superficies y componentes. Los comentarios en español explican retornos, filas compactas, disponibilidad, proyecciones y separación financiera.

- Móvil usa una sola cabecera contextual y cuatro destinos inferiores; escritorio mantiene el lateral.
- Los resúmenes principales usan azul suave en claro y superficie elevada en oscuro; los saldos se presentan sobre fondo neutro.
- Ingresos y gastos comparten filas con medio e importe, billetera real editable debajo, total exacto y botón semántico. Esta segunda línea se conserva aunque las referencias la omitan.
- Los catálogos presentan icono y color configurados, información real, disponibilidad y edición contextual. Trabajo activo/finalizado/archivado tiene una etiqueta diferente de disponibilidad.
- Los reportes alternan un desglose visible, identifican denominador y moneda, y separan patrimonio de transferencias, ajustes y resultado.
- Las vistas previas de Apariencia son ejemplos identificados. Existe una única preferencia Sistema/Claro/Oscuro.
- Se omiten comparativas, cantidades de movimientos, arrastre, descripciones de categorías, logos y preferencias sin soporte funcional. Los ajustes conservan violeta y texto explícito.

### Observación manual en navegador local

Se recorrió una pestaña temporal en localhost, con los catálogos disponibles, una billetera y sin operaciones financieras guardadas. No se guardaron formularios, cambios de catálogo, transferencias ni ajustes. Se ingresó un saldo declarado de 15 únicamente en el borrador de conciliación para observar impacto y retorno; no se persistió.

| Ancho solicitado | Muestras observadas |
| --- | --- |
| 320 px | Inicio y Nuevo ingreso en Sistema; detalle, conciliación, movimiento faltante, categorías y medios en Sistema; Reportes en Oscuro |
| 390 px | Actividades, edición cancelada y Ajustes en Sistema; Apariencia en Claro/Oscuro y selección Sistema; Inicio y Ajustes en Oscuro |
| 430 px | Nuevo gasto y catálogo de Billeteras en Sistema |
| 600 px | Transferencia y retorno desde conciliación en Sistema |
| 768 px | Apariencia y las dos miniaturas en Sistema |
| 1024 px | Listado de Billeteras y navegación lateral en Sistema |
| 1440 px | Reportes, selección de desglose y patrimonio en Sistema |

Sistema resolvía apariencia clara en esta sesión. Se observaron los tres botones y se alternaron Claro/Oscuro; se restauró Sistema, que era la elección inicial. No se simuló un cambio de tema del sistema operativo.

Se observaron carga, vacíos, controles deshabilitados, foco al ingresar un importe y navegación con Tab en Apariencia. Los retornos del formulario al listado y de movimiento faltante a conciliación conservaron el contexto. La observación de ancho del documento no mostró desborde en los formularios y muestras revisadas después de las correcciones.

### Correcciones de la revisión

- En 320 px los controles del catálogo pasan debajo del nombre para evitar cortar chips y fragmentar nombres comunes.
- Se eliminó la reserva de una línea vacía de ayuda en los selectores sin mensajes; las ayudas y errores reales siguen visibles.
- La flecha hacia abajo representa entrada y la de arriba salida, también en navegación y movimientos.
- El menú de operaciones ofrece edición y borrado; la confirmación de borrado lógico permanece separada.
- Inicio conserva un título accesible sin repetirlo visualmente. Sus dimensiones ocultas usan píxeles explícitos para evitar desborde por el significado porcentual de width en Material UI.
- El resumen oscuro utiliza la superficie elevada del tema, sin copiar un bloque azul saturado.

### Revisión conceptual y límites

Las combinaciones restantes de pantalla/ancho/tema se revisaron en código y mediante los tokens compartidos; la tabla no representa una matriz completa. Nombres extremos, muchas operaciones, distintos saldos y divisas, errores de persistencia y bloqueos durante escrituras se revisaron conceptualmente, sin generar registros artificiales.

Transferencia mostró origen con saldo y destino/acción deshabilitados por falta de otra billetera compatible. La vista previa completa de ambos saldos se revisó en el código: calcularImpactoTransferencia reutiliza sumarImportes/restarImportes y comprueba monedas y rango seguro; no persiste proyecciones. No se afirma haber observado una transferencia completa en navegador.

Áreas seguras, teclado virtual, dispositivos nativos, accesibilidad con lector de pantalla y cambio real del sistema operativo requieren revisión física posterior. El foco y el scroll de navegador observados no equivalen a esa validación.

### Comprobaciones y cierre

Tipos y compilación de producción correctos. Diff revisado y git diff --check sin errores. Cada tarea tiene su rama task_26/NNN_descripcion y commit; el bloque se integra mediante fast-forward en main. No se modificaron versión, tags ni se realizó push.

Tests: no creados ni ejecutados. Las TAREAS 086–088 quedan pendientes y requieren autorización.

## Antecedente — TAREA 066

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
