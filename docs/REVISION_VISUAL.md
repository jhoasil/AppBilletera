# Revisión visual

## Revisión de Nuevo gasto — TAREA 088

03/10/2026. Se documentó el alcance antes de modificar código. Main ya incluía la TAREA 87: merge --ff-only confirmó que estaba actualizado. Trabajo en task_26/088_refinar_nuevo_gasto.

Nuevo gasto incorpora etiquetas exteriores e iconos de descripción/observaciones, categoría obligatoria, actividad opcional, fecha y descripción apiladas. Las tarjetas de pago presentan icono configurado, importe y billetera real editable en texto debajo. TOTAL GASTO usa superficie roja, cifra exacta de 32 px e icono de salida; Guardar gasto conserva rojo y validaciones. Más y Agregar otro medio de pago abren las opciones reales; moneda y quitar/agregar distribuciones siguen disponibles. Si todos los medios activos están incluidos se informa sin inventar opciones. Ingreso conserva su variante de lista y total verde.

Se observó Claro a 390 y 320 px CSS: categoría Combustible y actividad DiDi precargadas, campos disponibles, tres medios reales, billetera Efectivo y otros destinos pendientes de selección. Más abrió opciones con moneda, instrucciones y retirada de medios. En 320 px se observaron scroll, total cero y guardado deshabilitado; no hubo desbordamiento horizontal. Los importes se apilan bajo el nombre por debajo de 360 px. Se abrió Ingreso a 320 px y conservó su composición. No se escribieron ni guardaron operaciones financieras.

[Captura local de Nuevo gasto](../tmp/tarea-088/nuevo-gasto.jpg), excluida de Git. Captura completa a 390 px: la navegación fija permanece en la posición del viewport, no implica que todo quepa en una pantalla. Se mantienen decimales, catálogos y destinos reales sin copiar cifras o logos de muestra. Oscuro/Sistema y otros anchos se revisaron conceptualmente con tokens; dispositivos físicos, lectores de pantalla, errores de persistencia y guardado efectivo no se observaron.

Tipos y compilación correctos. Diff revisado y git diff --check sin errores. Commit indicado: style(gastos): refina formulario de nuevo gasto. Tests: no creados ni ejecutados. Sin push, tags ni merge de TAREA 88; se detiene al finalizar.

## Revisión de Nuevo ingreso — TAREA 087

Fecha: 03/10/2026. Tarea definida en TAREAS_CODEX.md y documentación visual antes de modificar código; alcance exclusivo del formulario de ingreso y variantes optativas necesarias.

Compactación posterior solicitada: Fecha y Descripción en una fila desde 390 px, icono nativo de calendario sin duplicación, menor relleno/separación y controles de cobro de 48 px. Ayuda breve sin perder formato decimal. Se observó en Claro a 390 y 320 px CSS, sin desbordamiento horizontal; a 320 px los campos se apilan. No se guardaron borradores. [Captura compacta actual](../tmp/tarea-087/ingreso-compacto-390.jpg), local y excluida de Git. Tipos correctos y git diff --check sin errores; no se repitió compilación para este ajuste de presentación. Las observaciones siguientes corresponden a la revisión anterior. Tests: no ejecutados.

Se incorporaron etiquetas exteriores accesibles para actividad y campos de texto, iconos de fecha/descripción/observaciones y ejemplos opcionales. Los medios muestran icono configurado de 40 px e importe alineado a la derecha con cero orientativo y nombre accesible, sin repetir la etiqueta visual del importe. La billetera real sigue visible y editable, con quitar/agregar medios y moneda disponibles. La ayuda se sitúa después de las filas; total verde y guardado azul conservan las validaciones y el bloqueo existente.

Observación manual en Claro a 390 y 320 px CSS: actividad DiDi precargada, fecha local, campos opcionales, tres medios disponibles, billetera real, total cero y guardado deshabilitado. Se escribió 1 únicamente en el borrador de Efectivo para observar total $1,00 y botón habilitado, sin guardar; el borrador se descartó. Se corrigió la división del nombre Transferencia en el ancho mínimo, colocando su importe debajo de la identidad del medio por debajo de 360 px. No se observó desbordamiento horizontal. Scroll permite llegar al total y a la acción. Nuevo gasto se observó en 320 px: conserva sus etiquetas interiores, campos y acción propia.

Capturas locales excluidas de Git: [campos y medios](../tmp/tarea-087/ingreso-campos-390.jpg) y [total y guardado del borrador](../tmp/tarea-087/ingreso-total-390.jpg). La altura adicional respecto de la referencia se debe a las billeteras reales por distribución y a la moneda disponible, que no se ocultan para imitar el PNG. La captura del pie muestra la composición antes del último ajuste de iconos/etiquetas en medios; el total y el botón no cambiaron después.

Tipos y compilación correctos; diff revisado y git diff --check sin errores. Oscuro/Sistema y otros tamaños se revisaron conceptualmente mediante los tokens, sin afirmar observación manual en esta tarea. No se simularon errores de persistencia ni se probaron dispositivos físicos o lectores de pantalla. Sin escrituras financieras ni cambios de cálculos. Tests: no creados ni ejecutados. Rama task_26/087_refinar_nuevo_ingreso; commit style(ingresos): refina formulario de nuevo ingreso. Sin push ni merge automático.

## Revisión de Inicio — TAREA 086

Fecha: 03/10/2026. Alcance: ajuste adicional de Inicio autorizado por el usuario, según GUIA_VISUAL.md y PANTALLAS.md. La planificación anterior de la TAREA 89 se renumera como 86; las tareas numeradas de tests y release fueron retiradas por el usuario.

### Cambios y comparación

Corrección posterior autorizada el 03/10/2026: las tarjetas inferiores repetían los mismos ingresos y gastos de hoy. Se sustituyen por dos botones de registro, conservando todos los importes en el resumen superior. Las acciones quedan fuera del recorrido por monedas para evitar duplicarlas. Se mantienen rutas, contraste y altura táctil; los botones se apilan por debajo de 360 px. Las capturas y mediciones de la revisión inicial que siguen documentan el estado previo a esta simplificación.

Esta corrección se observó en Oscuro a 390 y 320 px CSS: acciones en dos columnas y apiladas, respectivamente, sin desbordamiento horizontal. [Captura local actualizada](../tmp/tarea-086/inicio-botones-sin-redundancia.jpg), excluida de Git. Validación de tipos correcta; diff revisado y git diff --check sin errores. Sin cambios financieros ni tests creados o ejecutados.

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

## Referencia final de Nuevo ingreso — corrección de TAREA 087

03/10/2026. Documentación actualizada antes de implementar la imagen final del usuario. Cobros agrupados en una sola lista con divisores; billetera real como selector de texto visible bajo el nombre del medio; importe a la derecha y total verde de 32 px con icono de tendencia dentro del bloque. La descripción permanece opcional, con etiqueta abreviada. Moneda, instrucciones decimales y agregar/quitar distribuciones se conservan en Opciones de medios y moneda. El formulario de gasto mantiene su variante previa.

Se observó Claro en 390 y 320 px CSS, sin desbordamiento horizontal. En el ancho mínimo los importes pasan debajo del medio. El selector Billetera real Efectivo abrió el menú con Efectivo y Galicia; se cerró sin cambiar datos. Se abrió el desplegable de opciones y se observaron moneda, instrucciones y retirada de medios. No se guardaron operaciones. La falta de destino en otros medios se presenta como Seleccionar billetera, sin inventar asociaciones.

[Captura completa local](../tmp/tarea-087/ingreso-referencia-final.jpg), excluida de Git. No se reproducen cifras, logos ni formatos sin decimales de la muestra. La navegación fija aparece en su posición del viewport en la captura completa; esta captura no implica que todo el formulario quepa en una pantalla. Oscuro/Sistema, dispositivos físicos y errores de persistencia no se observaron en esta corrección; se conservan tokens y contratos existentes. Tipos, compilación y git diff --check correctos. Tests: no creados ni ejecutados. Commit adicional en task_26/087_refinar_nuevo_ingreso; sin merge ni push.

### Corrección de TAREA 088 — lista compacta

Fecha y Descripción ahora comparten fila desde 390 px. Los pagos reutilizan la fila de Ingreso dentro de una lista con separadores: icono, nombre, billetera real editable e importe. Se retiró la variante redundante de tarjetas; total rojo y opciones permanecen. Documentación actualizada antes del código. Observación manual en Claro a 390 px sin desbordamiento horizontal, sin guardar operaciones. [Captura local](../tmp/tarea-088/gasto-lista-compacta.jpg), excluida de Git. Adaptación menor de 390 px revisada mediante la distribución compartida ya observada anteriormente, no una nueva matriz de tamaños/temas. Tipos y git diff --check correctos. Tests: no creados ni ejecutados. Commit adicional en la rama de TAREA 88, sin merge ni push.

## TAREA 89 — Listas de Ingresos y Gastos (03/10/2026)

TAREA 88 integrada en main mediante fast-forward antes de crear task_26/089_refinar_listas_ingresos_gastos. Planificación y criterios registrados antes de modificar código.

Revisión manual en navegador local, tema Claro: ambas listas con datos existentes a 390 y 320 px; Ingresos a 1024 px con navegación lateral. Cabecera horizontal, acciones semánticas, filtros rápidos, resumen por moneda, búsqueda, grupos mensuales y distribuciones históricas visibles. En 320 px los filtros pueden envolver y el importe pasa debajo del nombre; no se fuerza altura de pantalla. Capturas locales ignoradas en tmp/tarea-089/ingresos-390.jpg y gastos-390.jpg.

Observado: búsqueda DiDi conserva dos ingresos y total $28.000,00; búsqueda sin coincidencias muestra vacío y cero; Mes anterior selecciona septiembre y vacío con los datos disponibles; Todos recupera octubre. En Gastos el filtro Combustible aplicado conserva el gasto existente y $20.000,00; controles de fechas, actividad y categoría accesibles. No se guardaron ni eliminaron operaciones.

Comprobación estática: consultas filtran antes de contar/paginar; el recorrido mantiene una página y acumulados por mes/moneda. Totales exactos mediante sumarImportes, calculados en infraestructura y no en React. Distribuciones recuperadas solo para registros visibles; moneda de cabecera y billetera histórica, sin recurrir a la predeterminada. Tipos y compilación de producción correctos; git diff --check correcto. Tests: no creados ni ejecutados.

Límites: no se observaron páginas posteriores (solo dos ingresos y un gasto disponibles), varias monedas, detalles legados ni fallos de almacenamiento. Tampoco se verificaron visualmente Oscuro/Sistema ni dispositivos nativos en esta revisión; se conservan paletas y adaptadores existentes. Diferencias deliberadas: centavos y catálogos reales, sin datos/logos inventados; Todos los períodos en vez del mes ambiguo de la muestra; menú de borrado confirmado conservado; contraste del botón de ingreso según la paleta normativa.

## TAREA 90 — Reportes (04/10/2026)

TAREA 89 integrada en main mediante fast-forward; rama task_26/090_refinar_reportes. Planificación y decisiones documentadas antes del código. Cinco pestañas, selector de mes/rangos, tarjetas de resultado, comparación con base real, evolución mensual, distribuciones por medio y patrimonio separado. Servicios preparan datos agregados mediante lecturas existentes; sin escrituras ni migraciones.

Revisión manual en Claro: Resumen a 320 y 390 px y escritorio de 1024 px; Ingresos, Gastos, Actividades y Billeteras a 390 px. Navegación inferior/lateral conservada. En 320 px se apilan cabecera y tarjetas, y la tira de pestañas permite desplazamiento horizontal dentro de su contenedor. En 390 px quedan visibles las cinco pestañas. El anillo se coloca encima de su leyenda en móvil para conservar importes y centavos; no se exige encajar la pantalla completa en una captura.

Observado con datos existentes: octubre, ingresos $28.000,00, gastos $20.000,00, neto $8.000,00; DiDi/Combustible y Efectivo al 100% de sus respectivos denominadores. Rentabilidad de DiDi conserva gastos asociados y neto; Uber sin operaciones permanece visible. Evolución mayo–octubre con importes exactos disponibles en el desplegable; anillo y leyenda de gastos accesibles. Selección de septiembre cambia extremos a 01–30 y muestra ausencia de operaciones; patrimonio actual $858.000,00 permanece igual y transferencias/ajustes del período pasan a cero. Regresar a octubre recupera transferencias $50.000,00 y ajustes positivos $350.000,00 separados; la base anterior cero produce Sin base comparable. No se guardaron ni eliminaron datos.

Validación estática: tipos y compilación correctos, git diff --check correcto. Ganancia y porcentajes en servicios/utilidades de dominio; consultas agregadas paginadas para evolución, sin materializar historia en React. La escala gráfica es visual y abreviada; las leyendas y detalles mantienen importes exactos por divisa. Movimientos recientes globales rotulados como independientes del período. Tests: no creados ni ejecutados.

Límites: no se observaron visualmente múltiples monedas, ganancias negativas, comparaciones con base positiva, fallos de almacenamiento, Oscuro/Sistema ni plataformas nativas; no se generaron datos para esos escenarios. Hoy/Semana/Año/Personalizado conservados e inspeccionados estáticamente; la selección manual se realizó por mes. Lecturas de resultado, comparación, evolución y patrimonio usan transacciones independientes y pueden reflejar instantes distintos ante una escritura concurrente. Capturas locales ignoradas: tmp/tarea-090/resumen-390.jpg y gastos-390.jpg. Diferencias deliberadas: cifras y centavos reales, paleta normativa, flechas semánticas existentes y tres magnitudes internas separadas, sin copiar el total combinado ambiguo de la imagen.


## Corrección adicional TAREA 90 — 04/10/2026

Comparación con c880b95b: eliminada la cabecera de marca duplicada solo en Reportes móvil; título y mes compactos, tarjetas semánticas más bajas, ganancia con icono circular, accesos patrimoniales de tarjeta completa. Transferencias conserva su importe propio y etiqueta; ajustes positivos/negativos permanecen en Billeteras mediante Ver detalle de movimientos internos. Sin suma financiera nueva. Comparaciones muestran flecha y color favorable según ingreso/gasto; ausencia de base interpretable se abrevia Sin comparación.

Gráficos con retícula monetaria rotulada y valores exactos desplegables; etiqueta Mensual sin selector ficticio. Anillo y leyenda contiguos desde 360 px, apilados debajo; leyenda separa nombre/porcentaje de importe para conservar centavos. Cabecera mantiene fechas completas accesibles. Ver billeteras reemplaza el enlace ambiguo Ver todos.

Revisión manual en Claro: Resumen en anchos solicitados 320/390 y escritorio 1024; Ingresos/Gastos en móvil. Compilación y tipos correctos. Sin escrituras de operaciones ni cambios de modelo. Captura tmp/tarea-090/resumen-corregido.png (ignorada por Git). No se verificaron visualmente variantes oscuras, múltiples monedas ni comparaciones con base positiva en esta corrección. Se conserva diferencia con la imagen por centavos, flechas semánticas vigentes y datos reales. Tests: no ejecutados.


## TAREA 91 — Ajustes y Actividades, 04/10/2026

Menú agrupado, iconos semánticos, indicador del tema, carga rápida enlazada al catálogo de medios y accesos a respaldo. Actividades agrega filtros antes de paginación, fechas/tipo, editor en página, selectores plegables y descripción multilínea. Validación manual en Claro móvil: abrir Actividades, consultar DiDi, cancelar sin escribir, filtrar Inactivas vacío, volver a Todas y Ajustes. Compilación y tipos correctos. No se probaron guardado, cambios de disponibilidad, importación/exportación, modo oscuro ni dispositivos nativos. No se implementan notificaciones, moneda global ni borrado físico. Datos preservados. Tests: no ejecutados.

## TAREA 92 — Catálogos de medios/billeteras y Gasto (04/10/2026)

Completada. Listas con filtros previos a la paginación, editores en página, selección visual y vista previa. Patrimonio actual obtenido del servicio existente, separado por moneda y etiquetado como global. Gasto con tres filas de campos, moneda visible, total rojo y guardar azul; opciones adicionales siguen accesibles. Datos y escrituras financieras conservados.

Comprobaciones: pnpm compilar (incluye tipos) correcto; revisión manual de navegación, filtro Carga rápida y USD, formularios y vista previa sin guardar datos; pantallas móviles estrechas y escritorio sin desbordamiento horizontal observado. No se verificaron guardados mediante UI ni plataformas nativas. Tests: no creados ni ejecutados. Capturas locales ignoradas en tmp/tarea-092. Se preservan iconos Material y centavos, sin copiar logos ni valores ficticios de las referencias.
