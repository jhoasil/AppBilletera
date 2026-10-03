# Revisión visual

## Revisión vigente de Inicio — TAREA 086

Fecha: 03/10/2026. Alcance: ajuste adicional de Inicio autorizado por el usuario, según GUIA_VISUAL.md y PANTALLAS.md. La planificación anterior de la TAREA 89 se renumera como 86; las tareas numeradas de tests y release fueron retiradas por el usuario.

### Cambios y comparación

- Roboto variable latina incluida localmente, con licencia y fuente incorporadas al precache de producción. Se observó la fuente aplicada en navegador; no se realizó una prueba de desconexión física.
- Marca con mayor peso, icono de billetera sólido y Ajustes a la derecha. Inicio conserva el acceso a Billeteras en Mi dinero. El título accesible oculto queda fuera del Stack para evitar separación adicional antes de la fecha.
- Ganancia con etiqueta/cifra a la izquierda e icono de tendencia a la derecha. Importes inferiores destacados y centrados; en 320 px pasan a dos filas para conservar los centavos.
- Accesos rápidos neutros con círculos semánticos, botones de 48 px y contraste corregido. En tarjetas de hasta 210 px la cifra ocupa la fila completa; en 320 px los accesos se apilan.
- Billeteras reales distribuidas según su cantidad, sin huecos ficticios, con Transferir y Ver todas al pie. Movimientos más compactos, fecha sin segundos y cifra completa que puede bajar de fila. Los ajustes mantienen violeta.
- Navegación inferior con indicador activo; escritorio conserva el lateral. Comentarios en español explican las decisiones de composición. Consultas, cálculos, formatos monetarios, acciones y persistencia permanecen iguales.

Se comparó el código anterior del commit a4ef9b4 con la implementación a **390 × 844 px CSS**, en Claro, con la misma escala y los mismos datos existentes. La copia anterior se sirvió temporalmente en el mismo origen y se retiró después de la observación. No se guardaron operaciones financieras para preparar las capturas.

Capturas locales, excluidas de Git: [antes](../tmp/tarea-086/inicio-antes-390-claro.jpg), [después en Claro](../tmp/tarea-086/inicio-despues-390-claro.jpg) y [después en Oscuro](../tmp/tarea-086/inicio-despues-390-oscuro.jpg). La pareja comparable es la de Claro; la captura oscura posterior refleja nuevos registros ingresados por el usuario durante la sesión.

En la pareja comparable, la etiqueta Ganancia pasó de y=178 a y=141 y el encabezado Últimos movimientos de y=817 a y=712: se recuperan 105 px antes del listado. No se afirma coincidencia completa con el PNG: se mantienen decimales, datos reales, iconos configurados y las adaptaciones necesarias para legibilidad.

### Observación manual y límites

| Ancho CSS observado | Claro | Oscuro |
| --- | --- | --- |
| 320 px | Inicio, importes completos, foco y scroll | Inicio, accesos apilados |
| 390 px | Comparación antes/después | Inicio y captura final |
| 430 px | Inicio | Inicio |
| 600 px | Inicio | Inicio |
| 1024 px | Inicio con navegación lateral | Inicio con navegación lateral |

Las muestras finales de la tabla tuvieron altura CSS de 844 px. Se midió el viewport real para compensar la escala del navegador. El ancho del documento no excedió su ancho disponible en las muestras revisadas. Se observó desplazamiento hasta movimientos y foco mediante Tab, sin cortar los centavos al reducir el ancho.

Sistema fue seleccionado y resolvió tema oscuro durante la sesión; no se cambió la apariencia del sistema operativo. La preferencia Oscuro observada se dejó seleccionada. También se revisaron Reportes y detalle de Efectivo: conservan la variante vertical de TarjetaResumen.

Se observaron carga, vacío de movimientos con una billetera y posteriormente registros existentes con dos billeteras. Cero o tres billeteras, nombres extremos, importes extraordinarios, otras divisas y errores de persistencia se revisaron conceptualmente, sin inventar datos. La tabla corresponde a Inicio, no a todas las pantallas. Teclado virtual, lector de pantalla, áreas seguras físicas y dispositivos nativos requieren revisión posterior.

### Comprobaciones y cierre

Validación de tipos y compilación de producción correctas. Fuente WOFF2 y licencia presentes en el precache generado. Diff revisado y git diff --check sin errores. Rama: task_26/086_ajustar_inicio_referencia. Commit indicado: style(inicio): ajusta composicion a referencia visual. Sin cambios de versión, tags ni push.

Tests: no creados ni ejecutados. Se detiene el trabajo al finalizar la TAREA 86.

## Antecedente — TAREA 085

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

Tests: no creados ni ejecutados. Este cierre precede a la actualización del usuario del 03/10/2026: la TAREA 86 vigente corresponde al ajuste adicional de Inicio y las tareas numeradas de tests y release se retiraron del plan.

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
