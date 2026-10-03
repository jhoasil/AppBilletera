# Decisiones de AppBilletera

Este documento registra las decisiones técnicas, funcionales y de arquitectura vigentes de AppBilletera.

Su objetivo es explicar **qué se decidió y por qué**, sin duplicar en detalle las reglas contenidas en:

```text
AGENTS.md
docs/ARQUITECTURA.md
docs/MODELO_DATOS.md
docs/GUIA_VISUAL.md
docs/PANTALLAS.md
```

Cuando una decisión cambie de forma intencional, deben revisarse también los documentos relacionados.

---

# Decisiones vigentes

En la TAREA 051 el usuario autorizó conservar los casos históricos ambiguos como **legado pendiente de revisión**. No se inventan billeteras ni asociaciones entre detalles y movimientos. La migración V2 transforma solamente relaciones inequívocas; los nuevos ingresos y gastos requieren billetera real y referencias a sus detalles. Esta excepción permite conservar y restaurar legado, sin habilitar nuevas operaciones con información financiera incompleta.

| Decisión | Motivo |
| --- | --- |
| Una única base de código para Web, PWA, Android, iOS e iPadOS | Compartir pantallas, lógica y reglas de negocio, encapsulando diferencias específicas de plataforma mediante adaptadores. |
| React, TypeScript, Vite, Material UI y Capacitor | Utilizar un stack moderno, multiplataforma y compatible con el alcance definido para AppBilletera. |
| TypeScript en modo estricto | Detectar errores antes de ejecución y mantener contratos claros entre dominio, servicios y persistencia. |
| pnpm como único gestor de paquetes | Mantener un único lockfile y evitar inconsistencias producidas por mezclar npm, Yarn y pnpm. |
| `pnpm-lock.yaml` como único lockfile | Garantizar instalaciones reproducibles. No mantener `package-lock.json` ni `yarn.lock`. |
| Estructura arquitectónica técnica en inglés | Utilizar convenciones reconocibles para otros desarrolladores: `app`, `core`, `database`, `modules`, `shared`, `services`, `repositories`, `components`, etc. |
| Dominio y funcionalidad propia en español | Mantener nombres de entidades, servicios, variables, funciones, módulos funcionales, tablas, columnas, documentación y mensajes alineados con el dominio de AppBilletera. |
| Mantener nombres externos en su idioma original | No traducir APIs, librerías ni convenciones como React, TypeScript, `useState`, `Promise`, `onClick`, UUID o SQL. |
| Arquitectura local-first | Permitir utilizar completamente la aplicación sin conexión a internet. |
| Sin backend obligatorio en V1 | Evitar complejidad innecesaria mientras la aplicación puede resolver su funcionalidad principal de forma local. |
| Preparar el modelo para futura sincronización cloud | Facilitar una evolución posterior sin implementar prematuramente infraestructura de sincronización. |
| IndexedDB para Web/PWA | Utilizar persistencia local adecuada al navegador. |
| SQLite para Android, iOS e iPadOS | Utilizar una base local robusta en plataformas nativas. |
| Los motores de persistencia están detrás de contratos y adaptadores | Evitar que presentación, dominio y servicios dependan de IndexedDB o SQLite. |
| La UI nunca accede directamente a IndexedDB, SQLite ni SQL | Mantener separación de responsabilidades y permitir reemplazar implementaciones sin modificar pantallas. |
| UUID directamente en `id` | Permitir crear registros offline con identidad definitiva y facilitar futura sincronización. |
| No mantener simultáneamente `id` y `uuid` | El UUID constituye directamente la identidad principal del registro. |
| No utilizar IDs autoincrementales como identidad principal | Evitar colisiones y mapeos adicionales al sincronizar registros creados en distintos dispositivos. |
| Claves primarias llamadas `id` | Mantener una convención uniforme para todas las entidades. |
| Claves foráneas con formato `<entidad>_id` | Mantener SQL legible y consistente: `actividad_id`, `billetera_id`, `categoria_id`, etc. |
| Base de datos propia en español y `snake_case` | Mantener consistencia con el dominio y las convenciones SQL del proyecto. |
| Dinero persistido como enteros en unidades menores | Evitar errores de precisión de punto flotante. |
| Utilizar campos como `importe_centavos` | Representar dinero de forma exacta. |
| ARS como moneda inicial | Corresponde al alcance inicial del producto. |
| El diseño no debe bloquear múltiples monedas futuras | Permitir extender la aplicación sin rediseñar completamente el modelo. |
| No realizar conversiones de moneda mediante una transferencia común | Una conversión ARS/USD futura debe representarse como una operación específica con su propia lógica. |
| `Actividad` representa fuentes de ingreso, trabajos y proyectos | Evitar crear entidades independientes para DiDi, fotografía, programación, trabajos temporales u otros tipos de actividad. |
| Los trabajos temporales utilizan `Actividad` | La combinación de fechas y estados ya permite representar correctamente este concepto. |
| Actividades, categorías, medios de pago y billeteras se administran desde Ajustes | Mantener separados los catálogos de las operaciones financieras cotidianas. |
| Los formularios de ingreso/gasto consumen catálogos pero no los crean | Mantener rápida la carga de movimientos y evitar mezclar responsabilidades. |
| Medio de pago y billetera son conceptos diferentes | El medio responde **cómo** se pagó/cobró; la billetera responde **dónde** está o de dónde salió el dinero. |
| `billetera_predeterminada_id` es únicamente una sugerencia | Facilitar carga rápida sin utilizar una configuración actual para reinterpretar operaciones históricas. |
| Cada detalle de ingreso almacena `billetera_id` | Conservar la billetera realmente utilizada en la operación. |
| Cada detalle de gasto almacena `billetera_id` | Conservar históricamente desde dónde salió el dinero. |
| La billetera histórica del detalle tiene prioridad sobre la billetera predeterminada del medio | Cambiar una configuración futura no debe modificar el significado de operaciones anteriores. |
| Un ingreso se compone de cabecera y detalles | Permitir distribuir un mismo ingreso entre múltiples medios y billeteras. |
| Un gasto se compone de cabecera y detalles | Permitir distribuir un gasto entre múltiples medios y billeteras. |
| No crear columnas fijas `efectivo`, `transferencia` o `tarjeta` en ingresos/gastos | Los medios de pago son configurables y no deben formar parte fija del esquema de la operación. |
| Solo persistir detalles con importe mayor a cero | Evitar registros innecesarios y simplificar trazabilidad. |
| No permitir ingresos ni gastos con total cero | Una operación financiera debe representar un importe real. |
| La suma de los detalles debe coincidir con el total de la operación | Mantener integridad financiera entre cabecera y distribución. |
| `movimientos_billetera` es la fuente de verdad del saldo | Permitir reconstruir saldos, auditar operaciones y evitar saldos históricos editables directamente. |
| El saldo de una billetera no se edita directamente | Cualquier modificación debe poder explicarse mediante un movimiento. |
| El saldo inicial genera un movimiento `SALDO_INICIAL` | Mantener trazabilidad desde el origen de la billetera. |
| Los movimientos derivados de ingresos referencian el detalle que los originó | Permitir conocer exactamente qué medio, billetera e importe produjo el impacto patrimonial. |
| Los movimientos derivados de gastos referencian el detalle que los originó | Mejorar trazabilidad e idempotencia. |
| Los movimientos utilizan `referencia_tipo` y `referencia_id` | Permitir asociar un movimiento con distintos tipos de operaciones sin perder trazabilidad. |
| La identidad lógica de un efecto financiero considera `referencia_tipo`, `referencia_id` y `tipo` | Evitar generar dos veces el mismo impacto por reintentos accidentales. |
| Las operaciones financieras deben ser idempotentes | Una repetición accidental no debe duplicar dinero. |
| Ingresos, detalles y movimientos forman una única operación lógica | Evitar registros parciales. |
| Gastos, detalles y movimientos forman una única operación lógica | Mantener consistencia financiera. |
| Transferencias y sus dos movimientos forman una única operación lógica | Evitar que exista solamente la salida o solamente la entrada. |
| Ajustes y sus movimientos forman una única operación lógica | Mantener coherencia patrimonial. |
| Utilizar transacciones cuando el motor lo permita | Confirmar o revertir conjuntamente todas las escrituras relacionadas. |
| Una transferencia no es un ingreso ni un gasto | Solo mueve patrimonio entre billeteras. |
| Una transferencia genera `TRANSFERENCIA_SALIDA` y `TRANSFERENCIA_ENTRADA` | Registrar ambos impactos conservando el patrimonio total. |
| Las transferencias no afectan rentabilidad | No representan generación ni consumo económico. |
| Los ajustes no son automáticamente ingresos ni gastos | Una diferencia patrimonial no implica necesariamente resultado económico. |
| Los ajustes se muestran por separado en reportes | Diferenciar correcciones patrimoniales del resultado real. |
| La conciliación compara saldo calculado con saldo real | Detectar inconsistencias sin modificar directamente el saldo. |
| Si se identifica una operación faltante, debe registrarse la operación real | Preferir trazabilidad real frente a un ajuste genérico. |
| Utilizar `AJUSTE_POSITIVO` o `AJUSTE_NEGATIVO` cuando la diferencia no pueda atribuirse a una operación concreta | Permitir corregir patrimonio sin inventar ingresos o gastos. |
| Los saldos deben agregarse en la capa de persistencia | Evitar descargar todos los movimientos y calcular mediante `.filter().reduce()` en JavaScript. |
| Utilizar índices para consultas financieras frecuentes | Mantener buen rendimiento con miles o cientos de miles de registros. |
| No agregar caches sin una necesidad comprobable | Evitar duplicación de estado innecesaria. |
| `saldo_actual_centavos` solo podrá existir como cache reconstruible | `movimientos_billetera` continuará siendo la fuente de verdad. |
| Preparar conceptualmente `saldos_billetera_periodo` para el futuro | Permitir optimizar saldos históricos si el volumen lo justifica. |
| No implementar cierres periódicos prematuramente | Evitar sobreingeniería mientras las consultas indexadas sean suficientes. |
| Utilizar borrado lógico para información histórica | Conservar referencias necesarias para explicar operaciones antiguas. |
| Un registro inactivo deja de estar disponible para nuevas operaciones pero continúa resolviendo históricos | Evitar pérdida de contexto en movimientos existentes. |
| Separar Resultado, Patrimonio y Movimientos internos | Evitar reportes financieros conceptualmente incorrectos. |
| Resultado = Ingresos − Gastos | Las transferencias y ajustes no forman parte automáticamente del resultado. |
| Patrimonio = saldos de billeteras | Representar dónde está el dinero actualmente. |
| Rentabilidad por actividad = ingresos de la actividad − gastos asociados | Permitir analizar trabajos, proyectos y fuentes de ingresos individualmente. |
| No atribuir automáticamente gastos sin actividad | Evitar distorsionar rentabilidad. |
| La carga rápida es una prioridad de UX | Registrar operaciones habituales debe requerir la menor cantidad razonable de pasos. |
| Recordar últimos valores de interfaz | Reducir interacciones en operaciones repetitivas. |
| Las preferencias UI pueden utilizar `localStorage` | Son configuraciones locales y no información financiera. |
| Los datos financieros no se guardan en `localStorage` | Mantenerlos bajo la capa de persistencia correspondiente. |
| Material UI es el sistema visual principal | Mantener consistencia y accesibilidad entre plataformas. |
| La interfaz es mobile-first | El teléfono es el escenario principal de uso. |
| La misma pantalla se adapta a mobile, tablet y desktop | Evitar mantener distintas implementaciones funcionales por tamaño. |
| Modo `Sistema`, `Claro` y `Oscuro` desde el inicio | Evitar agregar dark mode como adaptación posterior. |
| `Sistema` es el modo predeterminado | Respetar inicialmente la configuración del dispositivo. |
| No utilizar negro puro como fondo general oscuro | Mantener superficies y jerarquía visual adecuadas. |
| Colores, radios, sombras, tipografía y tamaños se centralizan | Evitar estilos inconsistentes pantalla por pantalla. |
| `docs/GUIA_VISUAL.md` es la referencia normativa del sistema visual | Centralizar dimensiones, colores, tipografía, radios, sombras y responsive. |
| `docs/PANTALLAS.md` es la referencia normativa de estructura y comportamiento de pantallas | Evitar que cada implementación interprete de forma distinta qué debe mostrar una vista. |
| Ingresos y Gastos comparten el mismo patrón visual | Favorecer consistencia y memoria muscular del usuario. |
| Los catálogos comparten el mismo lenguaje visual | Actividades, categorías, medios y billeteras deben sentirse parte del mismo sistema. |
| Los colores semánticos nunca son la única señal | Mantener accesibilidad mediante iconos, signos y texto. |
| La TAREA 51 verifica la alineación de la implementación con el modelo financiero vigente | Confirmar antes de modificar la interfaz que billetera histórica, trazabilidad, idempotencia, atomicidad, moneda y migraciones compatibles estén realmente implementadas. |
| Las TAREAS 52–66 están destinadas a actualizar las pantallas según la nueva especificación visual | Finalizar la interfaz antes de generar la cobertura definitiva de tests. |
| Los tests se generan solamente después de terminar la fase visual | Evitar crear tests de componentes para pantallas que inmediatamente serán modificadas. |
| La primera tarea autorizada para crear tests es la TAREA 67 | Mantener el plan actualizado después de insertar la auditoría financiera y las tareas visuales. |
| La TAREA 67 crea tests pero no los ejecuta | Separar construcción de cobertura de su ejecución. |
| La ejecución de tests corresponde a la TAREA 68 | Requiere autorización explícita del usuario. |
| La preparación de release corresponde a la TAREA 69 | No preparar ni publicar versiones automáticamente. |
| No ejecutar tests sin autorización explícita | Evitar consumo innecesario y respetar el flujo definido por el proyecto. |
| No ejecutar `git push` automáticamente | La publicación remota requiere autorización explícita. |
| Cada tarea utiliza su propia rama | Mantener cambios aislados, revisables y fáciles de revertir. |
| Cada tarea termina con su propio commit | Mantener historial claro y trazable. |
| Utilizar Conventional Commits | Estandarizar el historial del repositorio. |
| Tipo del commit en inglés y descripción en español | Mantener compatibilidad con la convención estándar sin abandonar la nomenclatura del proyecto. |
| Utilizar Semantic Versioning | Mantener versiones comprensibles y compatibles con releases futuros. |
| No incrementar la versión en cada commit | Las versiones representan hitos funcionales, no cambios individuales. |
| Los tags se crean solamente para releases reales | Evitar contaminar el historial con versiones parciales. |
| Los respaldos utilizan JSON versionado | Permitir validar compatibilidad y evolucionar el formato. |
| La importación de respaldo debe ser transaccional | Evitar dejar datos parcialmente importados. |
| Las migraciones evolucionan el esquema sin borrar la aplicación | Preservar los datos locales entre versiones. |
| No modificar de forma incompatible una migración ya distribuida | Los cambios posteriores deben incorporarse mediante nuevas migraciones. |
| Todas las funciones propias deben tener JSDoc en español | Facilitar comprensión y mantenimiento del código. |
| Documentar especialmente reglas financieras y decisiones no evidentes | Priorizar comentarios que expliquen el motivo y no simplemente repitan el código. |
| No utilizar comentarios redundantes línea por línea | Mantener una documentación útil y sostenible. |
| No sobreingenierizar V1 | Evitar incorporar microservicios, CQRS, event sourcing, sincronización cloud u otras estructuras antes de que exista una necesidad concreta. |

---

# Decisiones de arquitectura especialmente importantes

Las siguientes decisiones tienen prioridad porque afectan directamente la integridad de los datos.

## 1. Billetera predeterminada no es billetera histórica

```text
medios_pago.billetera_predeterminada_id
```

representa:

```text
una sugerencia para nuevas operaciones
```

Mientras:

```text
ingresos_medios_pago.billetera_id
gastos_medios_pago.billetera_id
```

representan:

```text
la billetera realmente utilizada
```

Cambiar la configuración de un medio no debe reinterpretar operaciones antiguas.

---

## 2. El saldo proviene de movimientos

Fuente de verdad:

```text
movimientos_billetera
```

Conceptualmente:

```text
saldo =
SUM(movimientos válidos de la billetera)
```

No modificar saldos directamente.

---

## 3. Resultado y patrimonio son conceptos distintos

Resultado:

```text
Ingresos
-
Gastos
=
Ganancia neta
```

Patrimonio:

```text
SUM(saldos de billeteras)
```

Movimientos internos:

```text
Transferencias
Ajustes
```

No mezclar estos conceptos en reportes.

---

## 4. Cada impacto debe ser trazable

Para ingresos:

```text
Ingreso
→ DetalleIngresoMedioPago
→ MovimientoBilletera
```

Para gastos:

```text
Gasto
→ DetalleGastoMedioPago
→ MovimientoBilletera
```

Para transferencias:

```text
Transferencia
→ Salida
→ Entrada
```

Para ajustes:

```text
Ajuste
→ Movimiento
```

---

## 5. Las operaciones financieras deben ser idempotentes

Reintentar una operación no debe producir dos veces el mismo efecto.

Conceptualmente:

```text
referencia_tipo
+
referencia_id
+
tipo
```

identifican el efecto financiero derivado.

---

# Decisiones visuales especialmente importantes

## Mobile-first

La referencia principal de diseño es el uso desde celular.

La interfaz debe seguir siendo funcional y cómoda aproximadamente desde:

```text
320 px
```

de ancho.

---

## Sistema visual centralizado

Los valores principales se encuentran en:

```text
docs/GUIA_VISUAL.md
```

No inventar:

```text
colores
radios
sombras
alturas
espaciados
```

distintos para cada pantalla si ya existe un token equivalente.

---

## Comportamiento de pantallas

La definición funcional se encuentra en:

```text
docs/PANTALLAS.md
```

Antes de modificar una pantalla debe consultarse este documento además de la guía visual.

---

# Decisiones del flujo de desarrollo

El plan vigente se encuentra en:

```text
docs/TAREAS_CODEX.md
```

Estado actual:

```text
TAREAS 00–50
completadas
```

Fase siguiente:

```text
TAREA 51
verificar alineación de la implementación con el modelo financiero vigente
```

Luego:

```text
TAREAS 52–66
actualización visual de pantallas
```

Después:

```text
TAREA 67
generar tests sin ejecutarlos
```

```text
TAREA 68
ejecutar tests únicamente con autorización explícita
```

```text
TAREA 69
preparar release únicamente cuando sea solicitado
```

No avanzar automáticamente entre tareas.

---

# Regla de actualización

Este documento registra decisiones, no instrucciones de implementación paso a paso.

Cuando una decisión cambie:

1. actualizar este documento;
2. revisar `AGENTS.md`;
3. revisar `ARQUITECTURA.md` si afecta arquitectura;
4. revisar `MODELO_DATOS.md` si afecta persistencia;
5. revisar `GUIA_VISUAL.md` o `PANTALLAS.md` si afecta UI;
6. revisar `TAREAS_CODEX.md` si cambia el plan de trabajo;
7. actualizar `CHANGELOG.md` cuando corresponda.

No mantener dos documentos con decisiones contradictorias.

En caso de conflicto, aplicar el orden de prioridad definido en `AGENTS.md`.
