# Plan de desarrollo de AppBilletera

## Regla principal

Realizar solamente UNA tarea por vez.

Cada tarea debe:

1. leer AGENTS.md;
2. leer solo documentación relacionada;
3. revisar git status y crear la rama task_AA/NNN_descripcion_de_la_tarea de la tarea, donde AA son los dos últimos dígitos del año de inicio (2026 → 26), con tres dígitos para el número de tarea (00 → 000, 01 → 001, 10 → 010); si ya existe para la misma tarea, verificarla y continuar en ella;
4. verificar la rama activa y modificar solo lo necesario;
5. revisar git diff;
6. realizar commit en esa rama;
7. informar resumen, rama y hash;
8. detenerse.

NO avanzar automáticamente.

La instrucción «continúa con la siguiente tarea» autoriza fusionar primero la tarea terminada en `main` y luego ejecutar solamente la siguiente tarea en su rama `task_AA/NNN_descripcion_de_la_tarea`, siguiendo las comprobaciones de Git de `AGENTS.md`. Al terminar, realizar commit, informar resumen y detenerse; no realizar push ni ejecutar tests por esta instrucción.

NO crear tests hasta la tarea específica.

NO ejecutar tests sin autorización explícita.

## Revisión adicional de Inicio — completada

La actualización del usuario asigna la TAREA 86 al ajuste de Inicio, antes planificado como TAREA 89, y retira las tareas de tests y release. Completada el 03/10/2026; evidencias y límites en REVISION_VISUAL.md. El commit documental anterior conserva la trazabilidad de esa planificación. Esta tarea visual no autoriza crear ni ejecutar tests ni preparar una release.

---

# TAREA 00 — Crear repositorio y documentación

## Objetivo

Preparar el proyecto antes de programar.

Crear:

```text
AGENTS.md
README.md
CHANGELOG.md

docs/
    PRODUCTO.md
    ARQUITECTURA.md
    MODELO_DATOS.md
    DECISIONES.md
    VERSIONADO.md
    TAREAS_CODEX.md
```

Crear:

```text
.gitignore
```

Inicializar Git si corresponde.

Versión inicial:

```text
0.1.0
```

## No hacer

No crear funcionalidades.

## Commit

```text
chore(proyecto): inicializa AppBilletera
```

Detenerse.

---

# TAREA 01 — Crear React + TypeScript + Vite

## Objetivo

Crear la aplicación base.

Utilizar:

```text
React
TypeScript
Vite
pnpm
```

Configurar TypeScript estricto.

Crear estructura:

```text
src/
    app/
    core/
    database/
    modules/
    shared/
```

No agregar persistencia todavía.

## Commit

```text
feat(base): crea aplicacion React y TypeScript
```

Detenerse.

---

# TAREA 02 — Material UI

## Objetivo

Agregar el sistema visual principal.

Instalar:

```text
Material UI
Material Icons
```

Crear:

```text
src/app/theme/
    tema.ts
    colores.ts
    tipografia.ts
    componentes.ts
    ProveedorTema.tsx
```

No crear módulos funcionales todavía.

## Commit

```text
feat(tema): integra Material UI
```

Detenerse.

---

# TAREA 03 — Modo claro, oscuro y sistema

## Objetivo

Implementar temas desde el inicio.

Modos:

```text
sistema
claro
oscuro
```

Predeterminado:

```text
sistema
```

Guardar preferencia con:

```text
localStorage
```

Todos los colores deben provenir del theme.

No hardcodear colores en componentes.

## Commit

```text
feat(tema): agrega modos claro oscuro y sistema
```

Detenerse.

---

# TAREA 04 — Layout y navegación

## Objetivo

Crear la estructura visual principal.

Mobile:

```text
Inicio
Ingresos
Gastos
Reportes
```

Ajustes accesible desde AppBar o menú.

Desktop:

adaptar a navegación lateral.

Crear páginas placeholder.

## Commit

```text
feat(navegacion): crea navegacion responsive
```

Detenerse.

---

# TAREA 05 — Componentes visuales compartidos

## Objetivo

Evitar diseños distintos en cada módulo.

Crear componentes reutilizables cuando correspondan:

```text
CabeceraPagina
TarjetaResumen
CampoImporte
EstadoVacio
SelectorCatalogo
BotonAccion
ListaMovimiento
```

No implementar lógica financiera todavía.

## Commit

```text
feat(ui): agrega componentes visuales compartidos
```

Detenerse.

---

# TAREA 06 — Entidades de dominio

## Objetivo

Crear modelos TypeScript principales.

Crear:

```text
Actividad
MedioPago
CategoriaGasto
Billetera
Ingreso
DetalleIngresoMedioPago
Gasto
DetalleGastoMedioPago
TransferenciaBilletera
MovimientoBilletera
AjusteBilletera
```

Todo en español.

Todas las interfaces y funciones propias deben tener JSDoc.

## Commit

```text
feat(dominio): define entidades principales
```

Detenerse.

---

# TAREA 07 — Manejo de dinero

## Objetivo

Centralizar operaciones monetarias.

Crear:

```text
crearImporte()
sumarImportes()
restarImportes()
formatearImporte()
```

Trabajar con enteros.

Moneda inicial:

```text
ARS
```

Separar cálculo de formateo visual.

## Commit

```text
feat(dinero): implementa manejo seguro de importes
```

Detenerse.

---

# TAREA 08 — Contratos de repositorios

Crear:

```text
RepositorioActividades
RepositorioMediosPago
RepositorioCategoriasGasto
RepositorioBilleteras
RepositorioIngresos
RepositorioGastos
RepositorioTransferencias
RepositorioMovimientosBilletera
```

No implementar motores físicos todavía.

## Commit

```text
feat(persistencia): define contratos de repositorios
```

Detenerse.

---

# TAREA 09 — Abstracción de base local

## Objetivo

Crear infraestructura común para:

```text
inicialización
migraciones
transacciones
cierre
```

Preparar adaptadores:

```text
Web
Nativo
```

No crear todavía los repositorios completos.

## Commit

```text
feat(persistencia): crea abstraccion de base local
```

Detenerse.

---

# TAREA 10 — Diseñar base de datos V1

## Objetivo

Crear la migración inicial.

Tablas:

```text
actividades
medios_pago
categorias_gasto
billeteras

ingresos
ingresos_medios_pago

gastos
gastos_medios_pago

transferencias_billeteras
movimientos_billetera
ajustes_billetera
```

## Convenciones

PK:

```text
id
```

FK:

```text
actividad_id
categoria_id
medio_pago_id
billetera_id
ingreso_id
gasto_id
billetera_origen_id
billetera_destino_id
```

El campo:

```text
id
```

es UUID.

No crear un campo `uuid` adicional.

Agregar:

```text
creado_en
actualizado_en
eliminado_en
```

cuando corresponda.

Documentar cada tabla en la migración.

Actualizar:

```text
docs/MODELO_DATOS.md
```

Agregar diagrama Mermaid ER.

## Commit

```text
feat(base-datos): define esquema inicial v1
```

Detenerse.

---

# TAREA 11 — Índices

## Objetivo

Agregar índices mínimos necesarios.

Incluir especialmente:

```text
movimientos_billetera(billetera_id, fecha)
movimientos_billetera(referencia_tipo, referencia_id)

ingresos(fecha)
gastos(fecha)

ingresos(actividad_id, fecha)
gastos(actividad_id, fecha)

gastos(categoria_id, fecha)
```

Documentar el motivo de cada índice importante.

## Commit

```text
feat(base-datos): agrega indices principales
```

Detenerse.

---

# TAREA 12 — Persistencia Web

## Objetivo

Implementar IndexedDB.

La UI no debe conocer IndexedDB.

Implementar migración V1.

## Commit

```text
feat(web): implementa persistencia IndexedDB
```

Detenerse.

---

# TAREA 13 — Datos iniciales

Crear seeds editables.

Actividades:

```text
DiDi
Uber
```

Medios:

```text
Efectivo
Transferencia
Tarjeta
```

Categorías:

```text
Combustible
Comida
Ocio
Peaje
Mantenimiento
Otros
```

Billeteras sugeridas:

```text
Efectivo
```

No hardcodearlos como reglas.

## Commit

```text
feat(datos): agrega datos iniciales
```

Detenerse.

---

# TAREA 14 — Ajustes: navegación de catálogos

## Objetivo

Crear sección Ajustes.

Accesos:

```text
Actividades
Categorías de gastos
Medios de pago
Billeteras
Apariencia
Datos
Información
```

Todavía no implementar todos los ABM.

## Commit

```text
feat(ajustes): crea estructura de configuracion
```

Detenerse.

---

# TAREA 15 — ABM de medios de pago

Permitir:

```text
listar
crear
editar
activar
desactivar
```

Campos adicionales:

```text
icono
color
mostrar_en_carga_rapida
orden
billetera_predeterminada_id
```

## Commit

```text
feat(catalogos): agrega ABM de medios de pago
```

Detenerse.

---

# TAREA 16 — ABM de categorías de gasto

Permitir:

```text
listar
crear
editar
activar
desactivar
```

Agregar:

```text
icono
color
```

si aporta valor.

## Commit

```text
feat(catalogos): agrega ABM de categorias de gasto
```

Detenerse.

---

# TAREA 17 — ABM de actividades

Campos:

```text
nombre
tipo
descripcion
icono
color
fecha_inicio
fecha_fin
estado
activo
```

Permitir:

```text
crear
editar
consultar
activar
desactivar
```

Crear selector Material Icons.

Crear selector de color.

## Commit

```text
feat(actividades): agrega ABM de actividades
```

Detenerse.

---

# TAREA 18 — Trabajos temporales

Agregar soporte para actividad temporal.

Estados:

```text
activo
finalizado
archivado
```

Permitir fechas de inicio y fin.

No crear otra entidad si Actividad ya resuelve correctamente el concepto.

## Commit

```text
feat(actividades): agrega trabajos temporales
```

Detenerse.

---

# TAREA 19 — ABM de billeteras

Permitir:

```text
listar
crear
editar
activar
desactivar
```

Campos:

```text
nombre
tipo
icono
color
moneda
```

No permitir editar saldo directamente.

## Commit

```text
feat(billeteras): agrega ABM de billeteras
```

Detenerse.

---

# TAREA 20 — Saldo inicial

## Objetivo

Permitir indicar saldo inicial al crear/configurar una billetera.

Campos:

```text
importe
fecha
```

Crear movimiento:

```text
SALDO_INICIAL
```

No guardar el saldo inicial solamente como atributo mutable.

## Commit

```text
feat(billeteras): agrega saldo inicial trazable
```

Detenerse.

---

# TAREA 21 — Preferencias de carga rápida

## Objetivo

Crear servicio de preferencias UI.

Recordar usando `localStorage`:

```text
ultima_actividad_ingreso
ultima_actividad_gasto
ultima_categoria_gasto
```

No guardar datos financieros en localStorage.

## Commit

```text
feat(preferencias): recuerda ultimos valores utilizados
```

Detenerse.

---

# TAREA 22 — Formulario rápido de ingreso

## Objetivo

Crear una carga muy rápida.

Precargar:

```text
última actividad utilizada
fecha actual
```

Mostrar directamente todos los medios configurados como carga rápida.

Ejemplo:

```text
Efectivo
Transferencia
Tarjeta
```

Campos vacíos equivalen a 0.

Calcular total en pantalla.

No permitir guardar total 0.

Guardar únicamente detalles con importe mayor a 0.

## Commit

```text
feat(ingresos): crea formulario rapido de ingresos
```

Detenerse.

---

# TAREA 23 — Persistencia de ingresos

## Objetivo

Guardar:

```text
ingresos
ingresos_medios_pago
movimientos_billetera
```

en una misma operación transaccional cuando corresponda.

Generar movimientos positivos sobre las billeteras correspondientes.

## Commit

```text
feat(ingresos): persiste ingresos y movimientos de billetera
```

Detenerse.

---

# TAREA 24 — ABM de ingresos

Agregar:

```text
listado
detalle
edición
borrado lógico
```

Al editar un ingreso, mantener consistencia de movimientos de billetera.

## Commit

```text
feat(ingresos): completa ABM de ingresos
```

Detenerse.

---

# TAREA 25 — Formulario rápido de gasto

Precargar:

```text
última categoría
última actividad
fecha actual
```

Mostrar medios rápidos directamente.

Campos vacíos equivalen a 0.

No permitir guardar total 0.

Persistir solamente líneas mayores a 0.

## Commit

```text
feat(gastos): crea formulario rapido de gastos
```

Detenerse.

---

# TAREA 26 — Persistencia de gastos

Guardar transaccionalmente:

```text
gastos
gastos_medios_pago
movimientos_billetera
```

Generar movimientos negativos.

## Commit

```text
feat(gastos): persiste gastos y movimientos de billetera
```

Detenerse.

---

# TAREA 27 — ABM de gastos

Agregar:

```text
listado
detalle
edición
borrado lógico
```

Mantener consistencia con movimientos de billetera.

## Commit

```text
feat(gastos): completa ABM de gastos
```

Detenerse.

---

# TAREA 28 — Transferencias entre billeteras

Crear pantalla:

```text
Desde
Hacia
Monto
Fecha
Descripción
```

No permitir misma billetera como origen y destino.

Generar:

```text
TRANSFERENCIA_SALIDA
TRANSFERENCIA_ENTRADA
```

No afectar ingresos, gastos ni rentabilidad.

## Commit

```text
feat(billeteras): implementa transferencias internas
```

Detenerse.

---

# TAREA 29 — Listado de billeteras y saldos

Mostrar:

```text
Efectivo
Mercado Pago
Galicia
...
```

con saldo.

Los saldos deben obtenerse desde persistencia optimizada.

No cargar todos los movimientos en memoria.

## Commit

```text
feat(billeteras): agrega consulta de saldos
```

Detenerse.

---

# TAREA 30 — Detalle de billetera

Mostrar:

```text
saldo actual
últimos movimientos
transferir
conciliar
```

Permitir filtros por período cuando corresponda.

## Commit

```text
feat(billeteras): agrega detalle y movimientos
```

Detenerse.

---

# TAREA 31 — Conciliación de billetera

Crear pantalla:

```text
Saldo calculado
Saldo real
Diferencia
Motivo
Observación
```

Si diferencia = 0:

no generar ajuste.

Si diferencia != 0:

ofrecer:

```text
Registrar movimiento faltante
Ajustar diferencia
```

## Commit

```text
feat(billeteras): agrega conciliacion de saldos
```

Detenerse.

---

# TAREA 32 — Ajustes positivos y negativos

Crear registros de ajuste.

Tipos:

```text
AJUSTE_POSITIVO
AJUSTE_NEGATIVO
```

Los ajustes no deben contabilizarse automáticamente como ingresos/gastos.

## Commit

```text
feat(billeteras): implementa ajustes de saldo
```

Detenerse.

---

# TAREA 33 — Pantalla Inicio

Mostrar:

```text
Ganancia de hoy
Ingresos de hoy
Gastos de hoy
```

Debajo de Ingresos:

```text
+ Agregar ingreso
```

Debajo de Gastos:

```text
+ Agregar gasto
```

Agregar sección:

```text
Mi dinero
```

con principales billeteras.

Agregar:

```text
Transferir
Ver todas
```

Mostrar últimos movimientos.

## Commit

```text
feat(inicio): implementa resumen principal
```

Detenerse.

---

# TAREA 34 — Reportes básicos

Períodos:

```text
Hoy
Semana
Mes
Año
Personalizado
```

Mostrar:

```text
Ingresos
Gastos
Ganancia neta
```

Desgloses:

```text
actividad
medio de pago
categoría
```

Las agregaciones deben ejecutarse en persistencia.

## Commit

```text
feat(reportes): agrega resumenes financieros
```

Detenerse.

---

# TAREA 35 — Rentabilidad de actividades

Calcular:

```text
Ingresos
Gastos asociados
Ganancia neta
```

para cada actividad.

## Commit

```text
feat(reportes): agrega rentabilidad por actividad
```

Detenerse.

---

# TAREA 36 — Reportes patrimoniales

Mostrar:

```text
Saldo por billetera
Patrimonio líquido
Transferencias internas
Ajustes
```

Separar claramente:

```text
resultado
patrimonio
movimientos internos
```

## Commit

```text
feat(reportes): agrega reportes patrimoniales
```

Detenerse.

---

# TAREA 37 — Estrategia de saldos históricos

## Objetivo

Documentar e implementar solamente lo necesario para consultas eficientes.

Mantener:

```text
movimientos_billetera
```

como fuente de verdad.

Evaluar cache:

```text
saldo_actual_centavos
```

si mejora claramente el rendimiento.

Diseñar:

```text
saldos_billetera_periodo
```

para futuras consultas históricas optimizadas.

No crear complejidad innecesaria si todavía no hace falta.

Actualizar documentación técnica.

## Commit

```text
feat(billeteras): optimiza estrategia de saldos
```

Detenerse.

---

# TAREA 38 — Ajustes de apariencia

Completar pantalla:

```text
Ajustes → Apariencia
```

Opciones:

```text
Sistema
Claro
Oscuro
```

Verificar que toda la aplicación utilice correctamente el theme.

## Commit

```text
feat(ajustes): completa configuracion de apariencia
```

Detenerse.

---

# TAREA 39 — Información de versión

Mostrar en Ajustes:

```text
AppBilletera
Versión
Build
```

Leer versión desde fuente central.

## Commit

```text
feat(ajustes): muestra informacion de version
```

Detenerse.

---

# TAREA 40 — Respaldo

Implementar:

```text
Exportar respaldo
Importar respaldo
```

Formato JSON versionado.

Importación transaccional.

## Commit

```text
feat(respaldo): implementa exportacion e importacion
```

Detenerse.

---

# TAREA 41 — PWA

Configurar:

```text
manifest
iconos
metadatos
instalación
```

Mantener Web tradicional funcionando.

## Commit

```text
feat(pwa): agrega soporte PWA
```

Detenerse.

---

# TAREA 42 — Capacitor

Integrar Capacitor.

Compartir el mismo frontend.

No agregar plataforma todavía.

## Commit

```text
feat(capacitor): prepara aplicacion multiplataforma
```

Detenerse.

---

# TAREA 43 — Android

Agregar Android.

Configurar SQLite nativo.

Documentar:

```text
build
cap sync
Android Studio
APK debug
```

No agregar keystores privados.

## Commit

```text
feat(android): agrega plataforma Android
```

Detenerse.

---

# TAREA 44 — iOS / iPadOS

Agregar soporte iOS.

Configurar SQLite nativo.

Documentar requisitos:

```text
macOS
Xcode
```

No asumir que Xcode está disponible.

## Commit

```text
feat(ios): prepara plataforma iOS
```

Detenerse.

---

# TAREA 45 — Revisión visual

Revisar:

```text
mobile
tablet
desktop
modo claro
modo oscuro
contraste
formularios
espaciado
navegación
```

No agregar nuevas funcionalidades.

## Commit

```text
style(ui): unifica experiencia visual
```

Detenerse.

---

# TAREA 46 — Auditoría de carga rápida

Revisar específicamente cuántos pasos requiere:

```text
crear ingreso
crear gasto
transferir
conciliar
```

Reducir pasos innecesarios sin eliminar validaciones importantes.

No agregar funcionalidades no solicitadas.

## Commit

```text
refactor(ux): simplifica flujos de carga
```

Detenerse.

---

# TAREA 47 — Auditoría arquitectónica

Buscar:

```text
duplicación
acceso directo a IndexedDB/SQLite
God Services
God Repositories
dependencias circulares
consultas ineficientes
cálculos en React
```

Corregir solamente problemas claros.

## Commit

```text
refactor(arquitectura): corrige inconsistencias
```

Detenerse.

---

# TAREA 48 — Auditoría de nomenclatura española

Buscar términos propios del proyecto en inglés.

Revisar:

```text
archivos
carpetas
interfaces
funciones
variables
SQL
documentación
mensajes
```

No traducir nombres de APIs/librerías.

## Commit

```text
refactor(nomenclatura): completa nombres en español
```

Detenerse.

---

# TAREA 49 — Auditoría de documentación del código

Revisar todas las funciones propias.

Cada una debe tener JSDoc.

Verificar comentarios de:

```text
tablas
migraciones
transacciones
conciliaciones
dinero
soft delete
movimientos
caches
```

No cambiar comportamiento.

## Commit

```text
docs(codigo): completa documentacion interna
```

Detenerse.

---

# TAREA 50 — Actualizar documentación general

Actualizar:

```text
README.md
PRODUCTO.md
ARQUITECTURA.md
MODELO_DATOS.md
DECISIONES.md
VERSIONADO.md
CHANGELOG.md
```

## Commit

```text
docs(proyecto): actualiza documentacion general
```

Detenerse.

---
# TAREA 51 — Verificar alineación del modelo financiero vigente

## Objetivo

Comprobar que la implementación existente después de la TAREA 50 coincida con las reglas financieras vigentes documentadas actualmente.

Esta tarea existe porque algunas reglas fueron formalizadas con mayor precisión después de implementar las tareas funcionales originales.

Leer:

```text
AGENTS.md
docs/ARQUITECTURA.md
docs/MODELO_DATOS.md
docs/DECISIONES.md
docs/SALDOS_HISTORICOS.md
```

Inspeccionar únicamente los archivos relacionados con:

```text
src/core/entities/
src/core/services/
src/core/repositories/
src/database/migrations/
src/database/repositories/
src/database/web/
```

y las implementaciones nativas directamente relacionadas cuando corresponda.

No recorrer módulos visuales ni realizar cambios de UI en esta tarea.

## Verificar billetera histórica

Comprobar que cada detalle monetario persistido conserve la billetera realmente utilizada:

```text
ingresos_medios_pago.billetera_id
gastos_medios_pago.billetera_id
```

`billetera_id` debe ser obligatorio para todo detalle monetario válido.

No reconstruir operaciones históricas mediante:

```text
medios_pago.billetera_predeterminada_id
```

La billetera predeterminada debe continuar siendo únicamente una sugerencia para nuevas operaciones.

## Verificar referencias de movimientos

Para ingresos, comprobar que el movimiento derivado pueda identificar el detalle concreto que produjo el impacto:

```text
referencia_tipo = INGRESO_MEDIO_PAGO
referencia_id   = ingresos_medios_pago.id
```

Para gastos:

```text
referencia_tipo = GASTO_MEDIO_PAGO
referencia_id   = gastos_medios_pago.id
```

Mantener para transferencias:

```text
referencia_tipo = TRANSFERENCIA
referencia_id   = transferencias_billeteras.id
```

y para ajustes:

```text
referencia_tipo = AJUSTE
referencia_id   = ajustes_billetera.id
```

## Verificar idempotencia

Comprobar que un reintento accidental no pueda producir dos veces el mismo efecto financiero.

La identidad lógica de un movimiento derivado debe considerar conceptualmente:

```text
referencia_tipo
referencia_id
tipo
```

Utilizar una restricción física o una validación equivalente según las capacidades del motor.

No asumir que una comprobación previa fuera de una transacción es suficiente si existe posibilidad de concurrencia.

## Verificar atomicidad

Comprobar que las operaciones financieras relacionadas se confirmen o reviertan juntas.

Especialmente:

```text
Ingreso + detalles + movimientos
Gasto + detalles + movimientos
Transferencia + salida + entrada
Ajuste + movimiento
Saldo inicial + movimiento
```

Revisar también edición y borrado lógico para impedir efectos financieros huérfanos o duplicados.

## Verificar moneda

Comprobar que la billetera elegida para cada detalle sea compatible con la moneda de la operación.

Mantener transferencias comunes solamente entre billeteras de la misma moneda.

## Migraciones

Si la implementación actual ya cumple todas las reglas:

```text
NO modificar el esquema innecesariamente.
```

Si es necesario cambiar un esquema persistido:

```text
crear una migración nueva y compatible
preservar los datos existentes
no exigir borrar o reinstalar la aplicación
no realizar cambios destructivos silenciosos sobre una migración ya utilizada
```

La migración debe funcionar de forma coherente en IndexedDB y SQLite.

## Documentación

Si el código ya coincide con la documentación, no reescribir los documentos normativos.

Si se detecta una diferencia real que obligue a cambiar una decisión previamente documentada, detenerse antes de alterar la regla y reportar la contradicción.

## No hacer

No modificar:

```text
pantallas
estilos
tema
navegación
reportes visuales
```

No crear tests.

No ejecutar tests.

No hacer release.

## Commit

Si fue necesario modificar código:

```text
fix(finanzas): alinea implementacion con modelo vigente
```

Si la tarea solamente requirió ajustes internos sin corregir un defecto observable, utilizar el tipo de commit apropiado según `AGENTS.md`.

Si no fue necesario modificar ningún archivo, informar que la implementación ya estaba alineada y no crear un commit vacío.

Detenerse.

---

# Regla de lectura para TAREAS 52–86

Durante la fase visual, no leer completos `docs/GUIA_VISUAL.md` y `docs/PANTALLAS.md` en cada tarea salvo que sea realmente necesario.

Leer:

```text
principios generales y tokens compartidos necesarios
+
secciones específicas de la pantalla o componente actual
```

Inspeccionar solamente los archivos de código directamente relacionados con la tarea.

No recorrer todo el repositorio.

---

# TAREA 52 — Alinear sistema visual base

## Objetivo

Preparar la base visual común antes de modificar las pantallas individualmente.

Leer obligatoriamente `AGENTS.md` y las secciones generales/tokens relevantes de:

```text
docs/GUIA_VISUAL.md
docs/PANTALLAS.md
```

Inspeccionar principalmente:

```text
src/app/theme/
src/shared/components/
```

No recorrer todo el repositorio.

## Revisar theme

Alinear con `GUIA_VISUAL.md`:

```text
colores
tipografía
espaciado
radios
sombras
breakpoints
alturas
superficies
```

Valores principales:

```text
espaciado base: 8px

radio input: 12px
radio tarjeta: 16px
radio dialog: 20px
radio bottom sheet: 24px

altura input: 56px
altura botón: 48px
altura AppBar: 56px
altura BottomNavigation: 64px
```

## Modo claro

Referencia:

```text
fondo:             #F8FAFC
superficie:        #FFFFFF
superficie 2:      #F1F5F9
texto principal:   #0F172A
texto secundario:  #475569
borde:             #E2E8F0
```

## Modo oscuro

Referencia:

```text
fondo:             #0F172A
superficie:        #111827
superficie elevada:#1F2937
texto principal:   #F8FAFC
texto secundario:  #94A3B8
borde:             #334155
```

No utilizar negro puro como fondo general.

## Colores semánticos

Mantener centralizados:

```text
primario
ingreso
gasto
advertencia
ajuste
transferencia
```

No repetir códigos de color directamente en cada pantalla.

## Componentes compartidos

Revisar especialmente:

```text
BotonAccion
CabeceraPagina
CampoImporte
CampoTextoCatalogo
EstadoVacio
FormularioOperacionRapida
IconoCatalogo
ListaMovimiento
PantallaOperaciones
SelectorCatalogo
SelectorColor
SelectorIcono
TarjetaResumen
```

Alinear:

```text
padding
radio
altura
tipografía
hover
focus
disabled
loading
modo claro
modo oscuro
```

## Regla

No rediseñar todavía las pantallas completas.

Esta tarea solamente prepara el sistema visual reutilizable.

No crear tests.

No ejecutar tests.

## Commit

```text
style(ui): alinea sistema visual base
```

Detenerse.

---

# TAREA 53 — Actualizar pantalla Inicio

## Objetivo

Modificar `PaginaInicio` para reproducir el diseño definido en:

```text
docs/GUIA_VISUAL.md
docs/PANTALLAS.md
```

Inspeccionar principalmente:

```text
src/modules/inicio/PaginaInicio.tsx
```

y solamente los componentes compartidos utilizados por esta pantalla.

## Estructura

Orden:

```text
AppBar

Ganancia de hoy

Ingresos / Gastos

Mi dinero

Últimos movimientos

BottomNavigation
```

## Ganancia de hoy

Crear tarjeta principal.

Referencia:

```text
width: 100%
min-height: 140–160px
padding: 16–20px
border-radius: 16px
```

Mostrar:

```text
Ganancia de hoy

$90.000

Ingresos        Gastos
$132.000        $42.000
```

Importe principal:

```text
32–36px
font-weight: 700
```

## Ingresos y Gastos

Mostrar dos tarjetas cuando exista ancho suficiente.

Cada una:

```text
min-height: 112–120px
border-radius: 16px
```

Ingresos:

```text
Ingresos
$...
+ Agregar ingreso
```

Gastos:

```text
Gastos
$...
+ Agregar gasto
```

No agregar un FAB general para estas acciones.

## Mi dinero

Mostrar aproximadamente las tres billeteras principales.

Ejemplo:

```text
Efectivo
Mercado Pago
Banco Galicia
```

Agregar:

```text
Transferir
Ver todas
```

## Últimos movimientos

Mostrar inicialmente aproximadamente:

```text
4–5 movimientos
```

Diferenciar:

```text
Ingreso
Gasto
Transferencia
Ajuste
```

mediante icono, signo y color.

No depender exclusivamente del color.

## Responsive

Revisar conceptualmente:

```text
320px
390px
430px
768px
1024px
1440px
```

Modo:

```text
Claro
Oscuro
```

No modificar reglas financieras.

No crear tests.

## Commit

```text
style(inicio): actualiza pantalla principal
```

Detenerse.

---

# TAREA 54 — Actualizar pantallas de Ingresos

## Objetivo

Actualizar visualmente:

```text
Nuevo ingreso
Listado de ingresos
```

Inspeccionar principalmente:

```text
src/modules/ingresos/
```

## Nuevo ingreso

Mantener este orden:

```text
Actividad
Fecha
Descripción
Observaciones
Medios de cobro
Total
Guardar ingreso
```

## Actividad

Mostrar selector claro y cómodo.

Precargar la última actividad válida según las reglas existentes.

## Fecha

Predeterminada con fecha actual.

## Medios de cobro

Cada medio rápido debe mostrar claramente:

```text
Icono
Nombre del medio
Billetera
Importe
```

Ejemplo:

```text
Efectivo
Billetera: Efectivo
$35.000
```

La billetera predeterminada puede venir seleccionada.

Debe poder cambiarse.

## Filas rápidas

Referencia:

```text
min-height: 56px
```

Campo importe:

```text
height: 56px
font-size: 18px
font-weight: 600
```

## Total

Utilizar semántica de ingreso.

Referencia modo claro:

```text
background: #ECFDF5
color: #16A34A
```

Altura:

```text
64–72px
```

Importe:

```text
24px
font-weight: 700
```

## Botón

```text
Guardar ingreso
```

Altura:

```text
48–52px
```

Full-width en móvil.

## Listado de ingresos

Mostrar por operación:

```text
Actividad
Descripción
Fecha
Importe
```

Ejemplo:

```text
DiDi
Jornada tarde
02/10/2026

+$55.000
```

Mantener paginación y filtros existentes.

No modificar:

```text
persistencia
movimientos
idempotencia
reglas financieras
```

salvo que sea estrictamente necesario para representar correctamente la interfaz.

No crear tests.

## Commit

```text
style(ingresos): actualiza pantallas de ingresos
```

Detenerse.

---

# TAREA 55 — Actualizar pantallas de Gastos

## Objetivo

Actualizar visualmente:

```text
Nuevo gasto
Listado de gastos
```

Inspeccionar principalmente:

```text
src/modules/gastos/
```

## Nuevo gasto

Mantener el mismo patrón visual de Nuevo ingreso.

Orden:

```text
Categoría
Actividad
Fecha
Descripción
Observaciones
Medios de pago
Total
Guardar gasto
```

## Consistencia

Ingreso y gasto deben compartir:

```text
altura de campos
espaciado
radios
estructura
ubicación del total
ubicación del botón
```

La principal diferencia es semántica.

Ingreso:

```text
verde
```

Gasto:

```text
rojo
```

## Total gasto

Referencia modo claro:

```text
background: #FEF2F2
color: #DC2626
```

Altura:

```text
64–72px
```

## Listado

Mostrar:

```text
Categoría
Descripción
Actividad
Fecha
Importe
```

Ejemplo:

```text
Combustible
Carga YPF
DiDi
02/10/2026

-$20.000
```

Mantener filtros y paginación existentes.

No crear tests.

## Commit

```text
style(gastos): actualiza pantallas de gastos
```

Detenerse.

---

# TAREA 56 — Actualizar pantalla Transferencia

## Objetivo

Actualizar visualmente:

```text
Transferencia entre billeteras
```

Inspeccionar principalmente:

```text
src/modules/billeteras/PaginaTransferencia.tsx
```

## Orden

```text
Desde
Hacia
Monto
Fecha
Descripción
Vista previa
Transferir
```

## Selector origen

Mostrar:

```text
Icono
Nombre
Saldo actual
```

Altura mínima:

```text
64px
```

## Selector destino

Mismo patrón que origen.

## Importe

Campo protagonista.

Utilizar teclado numérico en móvil.

## Vista previa

Mostrar claramente el impacto antes de confirmar.

Ejemplo:

```text
Efectivo

-$100.000

      ↓

Banco Galicia

+$100.000
```

Contenedor:

```text
min-height: 112–128px
padding: 16px
border-radius: 16px
```

## Mantener reglas existentes

```text
origen != destino
misma moneda
importe > 0
```

Una transferencia no es:

```text
Ingreso
Gasto
```

No modificar esa lógica.

No crear tests.

## Commit

```text
style(billeteras): actualiza pantalla de transferencia
```

Detenerse.

---

# TAREA 57 — Actualizar listado de Billeteras

## Objetivo

Actualizar:

```text
PaginaBilleteras
```

Inspeccionar principalmente:

```text
src/modules/billeteras/PaginaBilleteras.tsx
```

## Resumen superior

Mostrar:

```text
Mi dinero

$ total
```

Tarjeta:

```text
min-height: 120–140px
border-radius: 16px
```

## Acciones

Mostrar:

```text
Transferir
```

y otras acciones existentes cuando aporten valor.

## Cada billetera

Mostrar:

```text
Icono
Nombre
Saldo
Moneda
Última conciliación
```

Referencia:

```text
min-height: 88–96px
padding: 12–16px
border-radius: 16px
```

Icono:

```text
48px
```

Saldo:

```text
20px
font-weight: 700
```

## Navegación

Seleccionar una billetera debe abrir:

```text
Detalle de billetera
```

No modificar la lógica de cálculo de saldo.

No calcular saldos en React recorriendo movimientos.

No crear tests.

## Commit

```text
style(billeteras): actualiza listado de billeteras
```

Detenerse.

---

# TAREA 58 — Actualizar Detalle de billetera

## Objetivo

Actualizar visualmente:

```text
PaginaDetalleBilletera
```

Inspeccionar:

```text
src/modules/billeteras/PaginaDetalleBilletera.tsx
```

## Tarjeta principal

Mostrar:

```text
Icono
Nombre
Saldo actual
Última conciliación
```

Referencia:

```text
min-height: 144–160px
border-radius: 16px
```

Saldo:

```text
32–36px
font-weight: 700
```

## Acciones

Mostrar:

```text
Transferir
Conciliar
```

En móvil:

```text
2 columnas
gap: 12px
```

Cuando el ancho sea insuficiente, apilar.

## Filtros

Utilizar segmented control:

```text
Hoy
Semana
Mes
```

Altura:

```text
44px
```

## Movimientos

Diferenciar:

```text
Ingreso
Gasto
Transferencia
Ajuste
Saldo inicial
```

Cada fila aproximadamente:

```text
64–72px
```

El saldo mostrado es independiente de la página visible de movimientos.

No crear tests.

## Commit

```text
style(billeteras): actualiza detalle de billetera
```

Detenerse.

---

# TAREA 59 — Actualizar pantalla Conciliación

## Objetivo

Actualizar la interfaz de conciliación de billetera.

Leer:

```text
docs/PANTALLAS.md
docs/GUIA_VISUAL.md
```

Inspeccionar únicamente los archivos relacionados con conciliación.

## Mostrar

```text
Billetera

Saldo calculado
Saldo real
Diferencia

Motivo
Observaciones
```

## Saldo calculado

Solo lectura.

## Saldo real

Editable.

## Diferencia

Debe ser el dato visual principal.

Referencia:

```text
30–32px
font-weight: 700
```

Diferencia negativa:

```text
rojo
```

Diferencia positiva:

```text
verde
```

## Acciones

Cuando exista diferencia:

```text
Registrar movimiento faltante
Ajustar diferencia
```

Mostrar ambas alternativas de manera clara.

En ancho suficiente:

```text
2 columnas
```

En pantallas pequeñas:

```text
1 columna
```

## Regla

Si:

```text
diferencia = 0
```

no generar ajuste financiero.

No modificar la regla de negocio.

No crear tests.

## Commit

```text
style(billeteras): actualiza pantalla de conciliacion
```

Detenerse.

---

# TAREA 60 — Actualizar pantalla Movimiento faltante

## Objetivo

Crear o actualizar la vista utilizada desde una conciliación para registrar una operación real omitida.

## Contexto

Mostrar un banner informativo.

Ejemplo:

```text
La billetera presenta una diferencia de $15.000.

Podés registrar el movimiento faltante para corregir el saldo.
```

El banner debe informar sin competir con el formulario.

## Permitir

Según el flujo existente:

```text
Registrar gasto
Registrar ingreso
```

La pantalla debe reutilizar los formularios y componentes existentes siempre que sea razonable.

## Mostrar impacto

Ejemplo:

```text
Saldo calculado:
$65.000

Movimiento:
-$15.000

Nuevo saldo esperado:
$50.000
```

## Regla

Si se registra:

```text
Gasto
```

debe utilizar el flujo real de gasto.

Si se registra:

```text
Ingreso
```

debe utilizar el flujo real de ingreso.

No crear también un ajuste.

No duplicar lógica financiera.

No crear tests.

## Commit

```text
style(billeteras): actualiza registro de movimiento faltante
```

Detenerse.

---

# TAREA 61 — Actualizar Actividades

## Objetivo

Actualizar visualmente:

```text
Ajustes → Actividades
```

Inspeccionar principalmente:

```text
src/modules/ajustes/catalogos/CatalogoActividades.tsx
```

y componentes directamente relacionados.

## Cabecera

Mostrar:

```text
Actividades
```

y:

```text
Nueva actividad
```

## Buscador

Referencia:

```text
height: 52–56px
```

## Tarjeta

Referencia:

```text
min-height: 84–92px
padding: 12px
border-radius: 16px
```

Mostrar:

```text
Icono
Nombre
Tipo
Estado
Color
```

Icono:

```text
48px
```

## Estados

Diferenciar:

```text
Activa
Finalizado
Archivado
Inactiva
```

mediante Chip y texto.

## Editor

Alinear:

```text
nombre
tipo
descripción
icono
color
fecha inicio
fecha fin
estado
```

con `GUIA_VISUAL.md`.

No modificar reglas funcionales.

No crear tests.

## Commit

```text
style(actividades): actualiza catalogo de actividades
```

Detenerse.

---

# TAREA 62 — Actualizar Categorías de gastos

## Objetivo

Actualizar:

```text
Ajustes → Categorías de gastos
```

Inspeccionar principalmente:

```text
src/modules/ajustes/catalogos/CatalogoCategoriasGasto.tsx
```

## Mantener mismo lenguaje de Actividades

No crear un sistema visual independiente.

## Tarjeta

Referencia:

```text
72–84px
```

Mostrar:

```text
Icono
Nombre
Descripción
Estado
```

Icono:

```text
44px
```

## Acciones

```text
Crear
Editar
Activar
Desactivar
```

Las categorías históricas inactivas deben continuar mostrándose correctamente en operaciones anteriores.

No crear tests.

## Commit

```text
style(categorias): actualiza catalogo de gastos
```

Detenerse.

---

# TAREA 63 — Actualizar Medios de pago

## Objetivo

Actualizar:

```text
Ajustes → Medios de pago
```

Inspeccionar principalmente:

```text
src/modules/ajustes/catalogos/CatalogoMediosPago.tsx
```

## Tarjeta

Referencia:

```text
88–96px
```

Mostrar:

```text
Icono
Nombre
Billetera predeterminada
Carga rápida
Activo
```

El Switch debe alinearse al extremo derecho cuando corresponda.

## Chip

Mostrar:

```text
Carga rápida
```

cuando:

```text
mostrar_en_carga_rapida = true
```

## Editor

Permitir visualizar claramente:

```text
nombre
icono
color
billetera predeterminada
carga rápida
orden
estado
```

## Regla

La interfaz debe dejar claro que:

```text
Billetera predeterminada
```

es una configuración para nuevas operaciones.

No modificar relaciones históricas.

No crear tests.

## Commit

```text
style(medios-pago): actualiza catalogo de medios
```

Detenerse.

---

# TAREA 64 — Actualizar Reportes

## Objetivo

Actualizar:

```text
PaginaReportes
```

Inspeccionar principalmente:

```text
src/modules/reportes/PaginaReportes.tsx
```

## Selector de período

Mostrar:

```text
Hoy
Semana
Mes
Año
```

Altura:

```text
44px
```

Mantener acceso a:

```text
Personalizado
```

cuando corresponda.

## Indicadores principales

Mostrar:

```text
Ingresos
Gastos
Ganancia neta
```

Semántica:

```text
Ingresos → verde
Gastos → rojo
Ganancia → primario
```

Cada tarjeta:

```text
min-height: 112–128px
```

No forzar tres columnas si el ancho no lo permite.

## Desgloses

Mostrar cuando corresponda:

```text
Por actividad
Por categoría
Por medio de pago
```

Cada elemento puede mostrar:

```text
Icono
Nombre
Importe
Porcentaje
Barra
```

Barra:

```text
height: 8px
border-radius: 999px
```

## Patrimonio

Mostrar en una sección visualmente separada.

No mezclar:

```text
Resultado
Patrimonio
Transferencias
Ajustes
```

No modificar cálculos financieros.

No crear tests.

## Commit

```text
style(reportes): actualiza visualizacion financiera
```

Detenerse.

---

# TAREA 65 — Actualizar Ajustes, Apariencia y catálogo de Billeteras

## Objetivo

Actualizar:

```text
PaginaAjustes
Apariencia
CatalogoBilleteras
```

siguiendo las pantallas definidas.

Inspeccionar principalmente:

```text
src/modules/ajustes/
src/app/theme/
```

solamente cuando sea necesario.

## Menú Ajustes

Agrupar:

```text
Configuración

Catálogos

Datos

Información
```

Ejemplo:

```text
Configuración
    Apariencia
    Preferencias

Catálogos
    Actividades
    Categorías de gastos
    Medios de pago
    Billeteras

Datos
    Respaldo

Información
    Versión
```

No utilizar una única card gigante para toda la pantalla.

## Filas

Referencia:

```text
min-height: 64px
```

Estructura:

```text
[icono] Título               >
        descripción
```

## Apariencia

Mostrar:

```text
Sistema
Claro
Oscuro
```

mediante controles visuales claros.

Cada selector:

```text
min-height: 104–120px
border-radius: 14–16px
```

Seleccionado:

```text
border: 2px solid primary
```

## Color principal

Si la funcionalidad ya está contemplada, utilizar selector visual.

Referencia:

```text
40 × 40px
```

por opción.

No introducir nuevas configuraciones funcionales que no existan sin necesidad.

## Vista previa

Mostrar:

```text
Claro
Oscuro
```

cuando esté soportado por la implementación.

## Catálogo de Billeteras

Alinear con los demás catálogos.

Mostrar:

```text
Icono
Nombre
Tipo
Moneda
Estado
```

No permitir modificar directamente el saldo.

Saldo inicial continúa utilizando su flujo específico.

## Regla

No duplicar la lógica de `ThemeProvider`.

No crear tests.

## Commit

```text
style(ajustes): actualiza ajustes y apariencia
```

Detenerse.

---

# TAREA 66 — Revisión visual final de pantallas

## Objetivo

Realizar una revisión global después de completar todas las modificaciones visuales.

No agregar nuevas funcionalidades.

Leer:

```text
docs/GUIA_VISUAL.md
docs/PANTALLAS.md
```

## Revisar

```text
Inicio

Nuevo ingreso
Ingresos

Nuevo gasto
Gastos

Transferencia

Billeteras
Detalle de billetera

Conciliación
Movimiento faltante

Actividades
Categorías
Medios de pago

Reportes

Ajustes
Apariencia
Billeteras en Ajustes
```

## Tamaños

Validar conceptualmente:

```text
320px
390px
430px
600px
768px
1024px
1440px
```

## Temas

Validar:

```text
Claro
Oscuro
Sistema
```

## Revisar especialmente

```text
tipografía
márgenes
padding
radios
sombras
iconos
inputs
botones
chips
touch targets
contraste
scroll
safe areas
responsive
estados vacíos
loading
errores
disabled
focus
```

## Consistencia

Confirmar:

```text
Ingreso
Gasto
```

comparten el mismo patrón visual.

Confirmar:

```text
Actividades
Categorías
Medios de pago
Billeteras
```

comparten lenguaje de catálogo.

Confirmar que:

```text
Ingreso
Gasto
Transferencia
Ajuste
```

se distinguen mediante más de una señal visual.

## Documentación

Actualizar si corresponde:

```text
docs/REVISION_VISUAL.md
```

No crear tests.

No ejecutar tests.

## Commit

```text
style(ui): completa revision visual de pantallas
```

Detenerse.

---

# Nueva fase visual — TAREAS 67–85

Estado: completado el 03/10/2026 por autorización expresa del usuario para ejecutar las TAREAS 067–085 con sus ramas, commits y merge a main. Revisión y límites: REVISION_VISUAL.md. Las TAREAS 00–66 ya estaban completadas; no repetirlas ni reescribir su historia.

El plan original definía trabajo futuro. La autorización posterior cubrió exclusivamente este bloque visual. La actualización del usuario asignó después el ajuste adicional de Inicio a la TAREA 86 y retiró las tareas numeradas de tests y release. No autoriza tests, push, tags ni release.

## Reglas del bloque

- Comparar primero la implementación vigente; conservar lo que ya cumple.
- Utilizar las imágenes como referencia de composición, jerarquía y densidad. Sus anotaciones no reemplazan AGENTS.md ni las reglas financieras.
- Mantener Material UI, español, arquitectura compartida y funcionamiento offline.
- Conservar UUID, billetera histórica obligatoria, moneda, atomicidad, idempotencia y datos existentes.
- No copiar cifras, porcentajes, fechas, logotipos comerciales ni registros de ejemplo como datos reales.
- No usar la billetera predeterminada para reinterpretar movimientos anteriores.
- No agregar eliminación física, modificar saldos directamente ni duplicar formularios o ThemeProvider.
- No crear ni ejecutar tests durante las TAREAS 67–85. Tipos, compilación, revisión manual y git diff --check siguen siendo comprobaciones permitidas.
- Al ejecutar posteriormente cada tarea: rama task_AA/NNN_descripcion, revisión de diff, commit propio y detenerse. Merge según la autorización vigente del usuario; nunca push automático.
- Referencia principal: 390 × 844 px. Revisar también 320, 430, 600, 768, 1024 y 1440 px, en Claro, Oscuro y Sistema. No reducir áreas táctiles para copiar una maqueta.

## Referencias proporcionadas

Identificarlas por nombre de archivo; no depender de una ruta personal de Downloads ni copiar los PNG al repositorio sin necesidad.

| Pantalla | Referencia |
| --- | --- |
| Sistema general | Sistema de diseño para app financiera.png |
| Inicio claro / oscuro | image-gen-1(7).png / image-gen-8.png |
| Nuevo ingreso / nuevo gasto | image-gen-9.png / image-gen-10.png |
| Transferencia | image-gen-4(1).png |
| Listado / detalle de billetera | image-gen-5(1).png / image-gen-3(1).png |
| Conciliación / movimiento faltante | image-gen-6(1).png / image-gen-2(1).png |
| Actividades / categorías / medios | image-gen-7.png / image-gen-1(8).png / image-gen-2(2).png |
| Reportes / Apariencia | image-gen-3(2).png / image-gen-4(2).png |
| Ajustes oscuro | Panel Ajustes de Sistema de diseño para app financiera.png |

## Límites de las referencias

Las láminas no son idénticas entre sí: cambian paletas, tamaños, flechas, navegación y algunos controles. La TAREA 67 debe fijar una interpretación común antes de programar. Mantener como base los tokens normativos actuales; no sustituirlos por cada hexadecimal de cada PNG.

La navegación móvil conserva Inicio, Ingresos, Gastos y Reportes; Ajustes continúa accesible desde la cabecera. Ingreso usa entrada/positivo, gasto salida/negativo y ajuste semántica violeta, aunque una lámina muestre otras flechas o un ajuste rojo.

Color de acento configurable, descripción persistida de categorías, variaciones contra otro período, cantidad total de movimientos, reordenamiento por arrastre, preferencias nuevas y notificaciones son ampliaciones funcionales. No incorporarlas de forma implícita en esta fase. Si no están soportadas, omitirlas limpiamente y registrar la diferencia; no mostrar botones sin acción ni inventar valores. Podrán planificarse por separado cuando el usuario lo solicite.

---

# TAREA 67 — Consolidar la especificación de las nuevas referencias

## Objetivo y alcance

Actualizar únicamente las secciones necesarias de GUIA_VISUAL.md y PANTALLAS.md con la composición elegida, sin modificar aún componentes.

## Cambios

- Contrastar el estado registrado en REVISION_VISUAL.md con las referencias y registrar qué ya cumple y qué realmente falta.
- Precisar cabeceras principales y secundarias, superficies suaves, filas compactas, iconos coloreados y acciones primarias.
- Resolver diferencias entre láminas y normativa: conservar paleta base, tamaños legibles, navegación de cuatro destinos y semántica financiera.
- Documentar variantes responsive y las funciones de las imágenes que quedan fuera del bloque.

## Criterio de finalización

Documentación coherente, sin instrucciones contradictorias ni cambios en src. Las tareas siguientes deben tener una referencia verificable.

## Leer e inspeccionar

AGENTS.md; GUIA_VISUAL.md y PANTALLAS.md, secciones relevantes; REVISION_VISUAL.md. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/067_consolidar_referencias_visuales` (2026 → `task_26/067_consolidar_referencias_visuales`).

Commit: `docs(ui): define composicion visual de referencia`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 68 — Ajustar componentes visuales compartidos

## Objetivo y alcance

Refinar src/app/theme y los componentes relacionados de src/shared/components según la especificación de la 67.

## Cambios

- Distinguir tarjeta de resumen, tarjeta de contenido y fila compacta; evitar usar un bloque azul saturado para todo dato principal.
- Permitir iconos de catálogo con su color configurado, contenedor suave y tamaño apropiado. Mantener alternativa para iconos desconocidos y colores legados, con contraste suficiente.
- Unificar buscador con lupa, chips suaves, separadores, botones con icono, campos y selección de período.
- Conservar tokens centralizados y estados de foco, loading, error y disabled. Preparar variantes sin cambiar indiscriminadamente todas las pantallas.

## Criterio de finalización

Componentes reutilizables, sin estilos financieros duplicados ni colores propios dispersos. Las variantes preservan accesibilidad y comportamiento.

## Leer e inspeccionar

theme; IconoCatalogo; TarjetaResumen; CampoImporte; CampoTextoCatalogo; SelectorCatalogo; SelectorColor. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/068_ajustar_componentes_visuales` (2026 → `task_26/068_ajustar_componentes_visuales`).

Commit: `style(ui): refina componentes visuales compartidos`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 69 — Integrar cabeceras y navegación de pantallas

## Objetivo y alcance

Ajustar EstructuraPrincipal, CabeceraPagina y la navegación necesaria para eliminar la doble cabecera en móvil.

## Cambios

- En pantallas principales mostrar identidad AppBilletera con icono y acceso a Ajustes.
- En formularios, detalles y subpantallas mostrar flecha de regreso y título en la misma barra; evitar otro título grande y un botón Volver en una fila adicional.
- Definir retorno explícito al origen existente, sin depender solo de history.back ni perder el contexto de conciliación.
- Conservar cuatro destinos inferiores y navegación lateral en escritorio. Evitar superposición de barras, teclado y áreas seguras; identificar el destino activo correctamente.

## Criterio de finalización

Una única cabecera útil por pantalla, retornos correctos y navegación consistente; las acciones secundarias no consumen espacio redundante.

## Leer e inspeccionar

EstructuraPrincipal; CabeceraPagina; navegación de aplicación; secciones generales de PANTALLAS.md. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/069_integrar_cabeceras_y_navegacion` (2026 → `task_26/069_integrar_cabeceras_y_navegacion`).

Commit: `style(navegacion): integra cabeceras de pantalla`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 70 — Refinar Inicio en claro y oscuro

## Objetivo y alcance

Ajustar PaginaInicio y sus variantes de resumen, sin cambiar consultas ni cálculos.

## Cambios

- Mostrar fecha actual localizada debajo de la cabecera, evitando un segundo título Inicio cuando resulte redundante.
- Usar una tarjeta de ganancia con superficie suave, cifra 32–36 px, icono de tendencia y franja interna de ingresos/gastos con signos y separador.
- Usar dos tarjetas compactas de acceso rápido con iconos semánticos y botones Agregar ingreso/gasto claramente primarios; apilar en 320 px cuando haga falta.
- Agrupar Mi dinero en una superficie; mostrar hasta tres billeteras en mini tarjetas si caben, con alternativa de filas y acceso Ver todas.
- Agrupar cuatro o cinco movimientos en una lista con iconos, fechas y signos; conservar acceso real a detalles. No inventar una pantalla global de movimientos para un enlace decorativo.

## Criterio de finalización

Mejor jerarquía y densidad que el estado previo; mismo resultado financiero y ausencia de desborde en móvil.

## Leer e inspeccionar

PaginaInicio; TarjetaResumen; presentacionMovimiento; referencias Inicio claro y oscuro. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/070_refinar_inicio` (2026 → `task_26/070_refinar_inicio`).

Commit: `style(inicio): aproxima composicion a las referencias`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 71 — Compactar Nuevo ingreso

## Objetivo y alcance

Refinar FormularioIngreso y FormularioOperacionRapida con la cabecera y componentes ya preparados.

## Cambios

- Agrupar actividad, fecha, descripción y observaciones en una tarjeta de formulario de lectura clara.
- Presentar actividad y fecha con iconos; conservar actividad precargada únicamente si sigue disponible.
- Convertir cada medio rápido en fila: icono/nombre e importe alineado a la derecha; mostrar la billetera real sugerida en una segunda línea editable y accesible.
- Conservar importe vacío como cero visual, detalles positivos únicamente, selección de billetera real y acceso a medios adicionales.
- Alinear total verde y acción Guardar ingreso con icono; evitar que un pie fijo o el teclado tape campos o mensajes.

## Criterio de finalización

Menos altura y desplazamiento innecesarios, sin ocultar la billetera real ni alterar validaciones o distribución monetaria.

## Leer e inspeccionar

FormularioIngreso; FormularioOperacionRapida; campos y selectores compartidos; referencia image-gen-9.png. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/071_compactar_nuevo_ingreso` (2026 → `task_26/071_compactar_nuevo_ingreso`).

Commit: `style(ingresos): compacta formulario de ingreso`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 72 — Compactar Nuevo gasto

## Objetivo y alcance

Aplicar el patrón compartido de la 71 a FormularioGasto.

## Cambios

- Mantener categoría, actividad opcional, fecha, descripción obligatoria y observaciones en ese orden.
- Mostrar selectores con iconos y conservar las preferencias de última categoría y actividad válida.
- Alinear medios de pago e importes reutilizando exactamente la variante de filas rápidas del ingreso.
- Mostrar total con semántica roja y Guardar gasto con icono; reducir texto introductorio repetido sin perder ayudas necesarias.

## Criterio de finalización

Ingreso y gasto mantienen posiciones, alturas y navegación coherentes; sus diferencias corresponden a campos y semántica.

## Leer e inspeccionar

FormularioGasto; FormularioOperacionRapida; referencia image-gen-10.png. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/072_compactar_nuevo_gasto` (2026 → `task_26/072_compactar_nuevo_gasto`).

Commit: `style(gastos): compacta formulario de gasto`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 73 — Alinear listados de Ingresos y Gastos

## Objetivo y alcance

Ajustar PantallaOperaciones y la presentación de PaginaIngresos/PaginaGastos como continuación del mismo sistema.

## Cambios

- Conservar filtros y paginación en un bloque compacto, sin desplegar todos los controles por defecto si perjudica el móvil; permitir reconocer el período activo.
- Usar filas de icono, actividad o categoría, descripción, fecha y monto firmado; preservar la resolución de catálogos históricos.
- Concentrar edición y eliminación en una acción secundaria accesible, evitando una fila de botones permanente por registro.
- Mantener confirmación explícita del borrado lógico, estados vacíos útiles y acceso directo a una nueva operación.

## Criterio de finalización

Listados compactos y legibles que conservan filtros, consulta, edición y borrado lógico existentes.

## Leer e inspeccionar

PantallaOperaciones; PaginaIngresos; PaginaGastos; guía general y patrón de movimientos. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/073_alinear_listados_operaciones` (2026 → `task_26/073_alinear_listados_operaciones`).

Commit: `style(operaciones): alinea listados de ingresos y gastos`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 74 — Refinar Transferencia y su vista previa

## Objetivo y alcance

Ajustar PaginaTransferencia y SelectorBilletera a image-gen-4(1).png.

## Cambios

- Mostrar origen y destino como selectores de icono, nombre y saldo, conservando la moneda y compatibilidad de destinos.
- Destacar el campo monto; mantener fecha y descripción en el formulario limitado a 600 px.
- Mostrar dos filas de impacto: salida negativa del origen y entrada positiva del destino, con saldos esperados después de la operación cuando puedan prepararse en dominio/aplicación.
- Reutilizar operaciones monetarias exactas del dominio para la vista previa; no implementar cálculos financieros en React ni guardar nuevas proyecciones de saldo.
- Conservar aviso de que no modifica ingresos, gastos o ganancia y acción Transferir con icono de intercambio.

## Criterio de finalización

Vista previa comprensible y fiel a los saldos consultados; no introduce otro flujo de persistencia ni mezcla monedas.

## Leer e inspeccionar

PaginaTransferencia; SelectorBilletera; servicios monetarios existentes; referencia de transferencia. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/074_refinar_transferencia` (2026 → `task_26/074_refinar_transferencia`).

Commit: `style(billeteras): refina transferencia e impacto`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 75 — Refinar el listado de Billeteras

## Objetivo y alcance

Ajustar PaginaBilleteras con la referencia de listado.

## Cambios

- Usar resumen Mi dinero sobre superficie suave, cifra destacada y moneda explícita, manteniendo totales separados por divisa.
- Agrupar Transferir y el acceso existente a saldos/movimientos sin añadir rutas ficticias.
- Usar filas de icono coloreado, nombre, saldo, última conciliación y chevron hacia detalle.
- Retirar botones repetidos de transferencia por fila si el acceso global y el detalle ya resuelven la misma acción.
- Omitir comparativas patrimoniales y cantidad de movimientos cuando el contrato actual no entregue esos datos.

## Criterio de finalización

Lista más compacta con acceso inequívoco a cada billetera; saldos actuales siguen proviniendo de persistencia.

## Leer e inspeccionar

PaginaBilleteras; contrato de consulta; referencia image-gen-5(1).png. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/075_refinar_listado_billeteras` (2026 → `task_26/075_refinar_listado_billeteras`).

Commit: `style(billeteras): compacta listado patrimonial`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 76 — Refinar Detalle de billetera

## Objetivo y alcance

Ajustar PaginaDetalleBilletera y ListaMovimiento siguiendo image-gen-3(1).png.

## Cambios

- Mostrar nombre e icono en la cabecera contextual.
- Usar tarjeta de saldo sobre superficie neutra/suave, cifra 32–36 px y última conciliación legible.
- Agregar iconos a Transferir y Conciliar; dos columnas si caben y apilado en móvil pequeño.
- Agrupar movimientos y filtros en una tarjeta; resaltar período seleccionado y mantener Todos y rango personalizado como alternativas accesibles.
- Mostrar filas compactas con icono sobre superficie semántica, tipo, descripción, fecha e importe; el filtro y la paginación no cambian el saldo actual.

## Criterio de finalización

Saldo y movimientos tienen jerarquía diferenciada. Ajustes mantienen violeta y texto explícito, aunque la lámina utilice rojo.

## Leer e inspeccionar

PaginaDetalleBilletera; ListaMovimiento; presentacionMovimiento; referencia de detalle. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/076_refinar_detalle_billetera` (2026 → `task_26/076_refinar_detalle_billetera`).

Commit: `style(billeteras): refina detalle y movimientos`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 77 — Refinar Conciliación

## Objetivo y alcance

Ajustar PaginaConciliacion al patrón de tarjetas y acciones de image-gen-6(1).png.

## Cambios

- Separar identificación de billetera, saldo calculado de solo lectura y saldo real editable, con iconos de cálculo y edición.
- Destacar diferencia mediante signo, texto, icono y semántica positiva/negativa; conservar estado neutral al coincidir.
- Alinear motivo y observaciones, sin convertir el motivo libre actual en un catálogo nuevo.
- Mostrar las dos alternativas como tarjetas de acción con icono, título, explicación corta y acceso claro.
- Conservar confirmación de coincidencia y la regla diferencia cero sin movimiento de ajuste; registrar una operación faltante sigue siendo un flujo independiente.

## Criterio de finalización

El usuario comprende la comparación y elige explícitamente entre una operación real y un ajuste; sin saldo editable ni ajuste automático.

## Leer e inspeccionar

PaginaConciliacion; calcularConciliacion; referencia de conciliación. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/077_refinar_conciliacion` (2026 → `task_26/077_refinar_conciliacion`).

Commit: `style(billeteras): refina comparacion de conciliacion`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 78 — Refinar Movimiento faltante

## Objetivo y alcance

Ajustar PaginaMovimientoFaltante reutilizando las variantes normales de ingreso y gasto.

## Cambios

- Reducir el banner a contexto de billetera y diferencia, con texto claro y sin desplazar excesivamente el formulario.
- Usar selector de tipo compacto con icono y etiquetas; conservar la elección del usuario y la sugerencia según diferencia.
- Mantener categoría/actividad y la billetera real dentro del formulario normal. No crear un formulario reducido que omita el medio de pago.
- Destacar saldo calculado, movimiento firmado y nuevo saldo esperado en una tarjeta de impacto.
- Adaptar el texto de guardar al contexto, si corresponde, conservando el servicio normal y el retorno a conciliación con saldo real declarado.

## Criterio de finalización

La vista muestra contexto e impacto sin duplicar lógica financiera ni crear además un ajuste.

## Leer e inspeccionar

PaginaMovimientoFaltante; FormularioOperacionRapida; calcularImpactoMovimientoFaltante; referencia de movimiento faltante. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/078_refinar_movimiento_faltante` (2026 → `task_26/078_refinar_movimiento_faltante`).

Commit: `style(billeteras): compacta movimiento faltante`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 79 — Compactar Actividades y su editor

## Objetivo y alcance

Ajustar CatalogoActividades y las variantes necesarias de EditorCatalogo.

## Cambios

- Buscador con lupa; filas de icono coloreado, nombre, tipo y chip de estado.
- Usar chevron o menú contextual para editar; retirar el botón Editar y el hexadecimal como texto permanente de cada fila.
- Distinguir estado de trabajo (activo/finalizado/archivado) y disponibilidad, sin chips contradictorios ni pérdida de acceso a inactivos.
- Ubicar Nueva actividad en un área alcanzable y consistente, sin solapar navegación ni teclado.
- Ordenar el editor y reutilizar selectores visuales de icono y color; conservar fechas y acciones existentes.

## Criterio de finalización

Lista compacta que conserva toda la administración y las identidades históricas; sin eliminación física.

## Leer e inspeccionar

CatalogoActividades; EditorCatalogo; referencia image-gen-7.png. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/079_compactar_actividades` (2026 → `task_26/079_compactar_actividades`).

Commit: `style(actividades): refina listado y editor`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 80 — Compactar Categorías de gastos

## Objetivo y alcance

Ajustar CatalogoCategoriasGasto al mismo lenguaje de Actividades.

## Cambios

- Usar icono y color configurados, nombre, chip de disponibilidad y acceso contextual a edición.
- Retirar textos repetidos como Sin descripción configurada si no aportan información; no inventar descripciones de los ejemplos.
- Conservar búsqueda por nombre y acciones Crear, Editar, Activar y Desactivar.
- Si una tarea funcional posterior agrega descripción, el diseño debe poder mostrarla como texto secundario; esta tarea no agrega campos ni migraciones.

## Criterio de finalización

Catálogo visualmente alineado con Actividades, sin modificar el modelo CategoriaGasto ni los gastos históricos.

## Leer e inspeccionar

CatalogoCategoriasGasto; EditorCatalogo; referencia image-gen-1(8).png. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/080_compactar_categorias` (2026 → `task_26/080_compactar_categorias`).

Commit: `style(categorias): refina listado y editor`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 81 — Compactar Medios de pago

## Objetivo y alcance

Ajustar CatalogoMediosPago y su editor con image-gen-2(2).png.

## Cambios

- Mostrar icono coloreado, nombre y billetera predeterminada como texto o chip de destino; conservar el nombre de destinos inactivos.
- Mostrar Carga rápida como chip semántico solo cuando corresponda.
- Definir etiquetas inequívocas para disponibilidad y carga rápida: un switch Activo no debe aparentar que controla mostrarEnCargaRapida.
- Concentrar edición, orden y configuración en el editor/menú; no agregar arrastre ni reutilizar un switch con dos significados.
- Conservar aclaración de que la billetera predeterminada solo sugiere nuevas operaciones; el historial usa la billetera real del detalle.

## Criterio de finalización

La lista distingue preferencia, disponibilidad y carga rápida; no cambia reglas históricas ni comportamiento del guardado.

## Leer e inspeccionar

CatalogoMediosPago; EditorCatalogo; referencia de medios de pago. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/081_compactar_medios_pago` (2026 → `task_26/081_compactar_medios_pago`).

Commit: `style(medios-pago): refina preferencias del catalogo`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 82 — Refinar Reportes y desgloses

## Objetivo y alcance

Ajustar PaginaReportes y ResumenPatrimonial con image-gen-3(2).png.

## Cambios

- Selector de período compacto y encabezado de rango localizado; mantener Personalizado accesible.
- Indicadores con iconos semánticos y cifras legibles; tres columnas solo si el contenido real cabe, sin reducir texto ni áreas táctiles.
- Separar desgloses por actividad, categoría y medio mediante pestañas o selector equivalente; cada fila muestra identidad, importe, porcentaje y barra.
- Usar iconos reales de catálogos cuando disponibles; presentar claramente qué importe y denominador expresa cada porcentaje y mantener agrupación por moneda.
- Mostrar patrimonio como lista de billeteras con acceso al detalle; transferencias y ajustes permanecen en un bloque separado.
- No mostrar variaciones del período anterior, ranking arbitrario o porcentajes de ejemplo sin datos y definición funcional aprobada.

## Criterio de finalización

Resultado, desgloses y patrimonio se entienden sin una pantalla excesivamente larga. Cálculos y agregaciones permanecen fuera de React.

## Leer e inspeccionar

PaginaReportes; ResumenPatrimonial; porcentajeReporte; contratos vigentes; referencia de Reportes. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/082_refinar_reportes` (2026 → `task_26/082_refinar_reportes`).

Commit: `style(reportes): refina resumen y desgloses`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 83 — Refinar Ajustes y catálogo de Billeteras

## Objetivo y alcance

Ajustar PaginaAjustes y CatalogoBilleteras siguiendo el panel Ajustes de la referencia general.

## Cambios

- Conservar grupos Configuración, Catálogos, Datos e Información con filas de icono, título, descripción y chevron.
- Aplicar superficies diferenciadas y espaciado compacto en oscuro, sin copiar un fondo negro puro ni degradados arbitrarios.
- Mostrar solo destinos funcionales; no agregar Preferencias o Notificaciones como accesos vacíos.
- Alinear el catálogo de Billeteras con los demás: icono coloreado, nombre, tipo, moneda, disponibilidad y editor contextual.
- Conservar saldo inicial como flujo trazable separado; no introducir edición directa del saldo en el catálogo.

## Criterio de finalización

Ajustes tiene grupos legibles y todos los accesos funcionan; el catálogo mantiene su alcance de configuración.

## Leer e inspeccionar

PaginaAjustes; CatalogoBilleteras; EditorCatalogo; panel Ajustes oscuro. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/083_refinar_ajustes` (2026 → `task_26/083_refinar_ajustes`).

Commit: `style(ajustes): refina grupos y accesos`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 84 — Refinar Apariencia y vistas previas

## Objetivo y alcance

Ajustar SelectorModoTema con image-gen-4(2).png usando el proveedor existente.

## Cambios

- Agrupar Sistema, Claro y Oscuro en un bloque de opciones compacto; tres columnas en móvil si son legibles, con alternativa para 320 px.
- Mantener icono, nombre, borde y check de selección; reducir explicaciones repetidas fuera de la opción.
- Mejorar las dos miniaturas con una representación de Inicio: cabecera, tarjeta de resumen, acción y navegación, usando datos de demostración claramente visuales y sin acceder a datos financieros reales.
- Conservar una sola preferencia de modo: no agregar un switch Usar ajuste del sistema que pueda contradecir la opción Sistema.
- Omitir selector de acento, fuente, colores dinámicos y navegación configurable mientras no haya una tarea funcional autorizada para esas preferencias.

## Criterio de finalización

Apariencia es fiel al patrón visual y muestra ambas paletas sin duplicar ThemeProvider ni presentar controles ficticios.

## Leer e inspeccionar

SelectorModoTema; ProveedorTema; tema/tokens; referencia de Apariencia. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/084_refinar_apariencia` (2026 → `task_26/084_refinar_apariencia`).

Commit: `style(tema): refina seleccion y vistas previas`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 85 — Revisar la nueva composición visual

## Objetivo y alcance

Revisar todas las pantallas modificadas y actualizar REVISION_VISUAL.md.

## Cambios

- Comparar cada pantalla con la interpretación normativa fijada en la 67; registrar diferencias deliberadas respecto de los PNG.
- Revisar 320, 390, 430, 600, 768, 1024 y 1440 px en Claro, Oscuro y Sistema, distinguiendo observación manual de revisión conceptual.
- Verificar jerarquía, densidad, colores de iconos, filas rápidas, retorno, estados vacíos/loading/error/disabled, foco, teclado, scroll y áreas seguras.
- Confirmar coherencia entre ingreso/gasto y entre los cuatro catálogos; no ocultar la billetera real ni confundir resultado y patrimonio.
- Corregir únicamente defectos visuales del bloque; no agregar funcionalidades ni datos de prueba para simular porcentajes o comparativas.

## Criterio de finalización

Documentación de lo efectivamente observado, límites explícitos y checks estáticos adecuados; no atribuir pruebas físicas o cobertura automática inexistentes.

## Leer e inspeccionar

GUIA_VISUAL.md; PANTALLAS.md; REVISION_VISUAL.md; componentes afectados. Leer solo las secciones relacionadas.

## Git y validación

Rama: `task_AA/085_revisar_composicion_visual` (2026 → `task_26/085_revisar_composicion_visual`).

Commit: `style(ui): verifica composicion visual de pantallas`.

Revisar diff y ejecutar `git diff --check`. No crear ni ejecutar tests. Ejecutar únicamente cuando el usuario lo autorice y detenerse al finalizar.

---

# TAREA 86 — Ajustar Inicio a la referencia visual

## Estado

Completada el 03/10/2026. Tipografía local, cabecera, resumen, accesos rápidos, billeteras y movimientos ajustados; comparación manual y límites registrados en REVISION_VISUAL.md. Corrección posterior autorizada: sustituir las tarjetas rápidas por Agregar ingreso y Agregar gasto, mostrando los totales únicamente en el resumen superior. Esta decisión prevalece sobre el punto 4 de la referencia original. Tipos y compilación correctos. Tests: no creados ni ejecutados.

## Objetivo y referencias

Acercar la composición de Inicio a la lámina «Pantalla 1 — Inicio (claro)», comparándola con la captura actual enviada por el usuario. Las tareas visuales anteriores permanecen completadas; esta revisión corrige diferencias observadas posteriormente.

Referencias de la conversación: `codex-clipboard-64592836-4b85-46aa-a66e-1dfaf909fa3c.png` (objetivo) y `codex-clipboard-e547d528-9252-4ab0-afe0-240e59787785.png` (estado actual). No depender de que sus rutas temporales sigan disponibles: las diferencias y criterios siguientes constituyen la especificación textual.

## Diferencias y cambios requeridos

1. **Tipografía e identidad.** Corregir la apariencia tipográfica respecto de la referencia: marca y títulos con mayor peso, cuerpo sans serif e importes de lectura inmediata. Revisar fuente realmente aplicada, carga y herencia antes de atribuirlo a un fallo. Respetar la familia normativa de GUIA_VISUAL.md; no imponer Roboto solo por el texto de la imagen. Alinear icono de billetera y marca en la cabecera, con Ajustes a la derecha. Evaluar el acceso redundante a Billeteras de la barra de Inicio, conservando su acceso en «Mi dinero».
2. **Espacio superior.** Reducir el hueco entre la cabecera y la fecha. Usar márgenes laterales de 16 px y espaciado basado en la retícula existente de 8 px. Conservar actualización accesible sin reservarle una franja alta. Comparar a igual ancho y escala; la captura actual tiene un ancho distinto al teléfono de la lámina.
3. **Ganancia de hoy.** Mantener fondo azul suave en claro y elevado en oscuro. Situar etiqueta y cifra principal a la izquierda, con el icono de tendencia a la derecha. Conservar cifra de 32–36 px según la guía. En la franja inferior, centrar cada columna, destacar importe verde/rojo con signo, colocar su etiqueta debajo y mantener un separador vertical discreto. La captura actual presenta estos importes demasiado pequeños y sin jerarquía semántica.
4. **Accesos rápidos.** Usar dos tarjetas de superficie neutra en claro: icono circular con fondo semántico a la izquierda y etiqueta/importe a su derecha; botón de ancho completo debajo. Evitar teñir toda la tarjeta de verde o rojo. Asegurar texto e icono legibles sobre los botones, incluido «Agregar ingreso». Reducir altura y relleno respecto de la captura, manteniendo áreas táctiles y foco. Apilar únicamente cuando el contenido no quepa.
5. **Mi dinero.** Compactar la sección y sus mini tarjetas, con nombre, icono configurado y saldo alineados. Mostrar hasta tres billeteras reales; adaptar el espacio con cero, una, dos o tres, sin columnas ficticias ni tarjetas vacías para imitar la imagen. Colocar «Transferir» y «Ver todas» en dos acciones inferiores de fondo suave, como la referencia, evitando el botón único delineado de ancho completo actual. Evitar duplicar innecesariamente «Ver todas» en encabezado y pie.
6. **Últimos movimientos.** Reducir el espacio acumulado de las secciones anteriores para que el encabezado y el comienzo del listado queden más próximos al primer pliegue. Usar filas compactas con icono circular, descripción y fecha a la izquierda e importe a la derecha. Conservar entradas, salidas, transferencias y ajustes diferenciados por texto, signo e icono; respetar el ajuste violeta normativo. Estado vacío breve cuando no existan movimientos.
7. **Navegación y adaptación.** Mantener los cuatro destinos inferiores, indicador de Inicio activo, fondo y borde discretos, espacio de seguridad y contenido final accesible al desplazarse. Conservar la navegación lateral en escritorio. No fijar alturas de pantalla ni recortar contenido para forzar que todo quepa.

## Alcance y restricciones

- Ajustar presentación de Inicio y variantes compartidas estrictamente necesarias; comprobar que estas no alteren otras pantallas que las reutilizan.
- Reutilizar tokens del tema, componentes e iconos Material existentes. Documentar en español las decisiones de composición no evidentes y las funciones propias modificadas.
- Preservar consultas, cálculos, monedas, formato monetario vigente, datos, rutas y acciones. No ocultar decimales ni inventar importes, billeteras, logos comerciales o movimientos para reproducir la muestra.
- Mantener Sistema, Claro y Oscuro, estados de carga/error/vacío y accesibilidad. No modificar persistencia ni introducir nuevas funcionalidades.

## Criterios de finalización

- Comparación antes/después de Inicio a 390 × 844 px, misma escala, tema y estado de datos; evaluar composición, no coincidencia de cifras de muestra.
- Verificar manualmente 320, 390, 430 y 600 px, más escritorio a 1024 px; comprobar ambos temas y seguimiento de Sistema. Registrar solo lo realmente observado.
- Confirmar jerarquía de resumen, columnas centradas, iconos circulares, tarjetas rápidas neutras, sección de billeteras compacta y acciones inferiores. Sin desbordamiento horizontal, importes cortados ni contenido tapado por navegación.
- Comprobar estados con datos existentes y estado vacío cuando estén disponibles. No alterar datos reales para obtener una captura; dejar explícitos los escenarios que no pudieron observarse.
- Registrar capturas comparables y diferencias deliberadas en REVISION_VISUAL.md, separando revisión visual, comprobación estática y limitaciones. No declarar que Inicio coincide completamente sin evidencia.

## Leer e inspeccionar

AGENTS.md; secciones de Inicio y composición de GUIA_VISUAL.md y PANTALLAS.md; revisión vigente de REVISION_VISUAL.md. Inspeccionar PaginaInicio.tsx, TarjetaResumen.tsx, ListaMovimiento.tsx, IconoCatalogo.tsx, EstructuraPrincipal.tsx y tokens de tipografía/tema únicamente según necesidad.

## Git y validación

Rama: `task_AA/086_ajustar_inicio_referencia` (2026 → `task_26/086_ajustar_inicio_referencia`). Parte de la planificación documental anterior y conserva los cambios del usuario; verificarla y continuar sin recrearla si ya existe.

Commit de implementación: `style(inicio): ajusta composicion a referencia visual`.

Revisar `git diff` y ejecutar `git diff --check`; realizar validación de tipos y compilación cuando corresponda. No crear ni ejecutar tests. Implementar únicamente cuando el usuario lo autorice; detenerse al terminar.

---

# TAREA 87 — Refinar Nuevo ingreso según la referencia visual

## Estado

Completada el 03/10/2026. Documentada antes de modificar código; revisión manual y límites en REVISION_VISUAL.md. Tipos y compilación correctos. Tests: no creados ni ejecutados.

## Objetivo y alcance

Ajustar el formulario Nuevo ingreso a la referencia codex-clipboard-823e9c5b-5a80-4eb6-8d29-b681a68e8a94.png. No rediseñar el listado de Ingresos ni cambiar el modelo financiero.

## Cambios previstos

Corrección posterior autorizada: compactar el formulario de ingreso. Fecha y Descripción compartirán fila desde 390 px, con fecha nativa sin icono duplicado; por debajo se apilarán. Reducir rellenos, separaciones y controles de cobro a 48 px sin ocultar la billetera real ni perder etiquetas accesibles. Simplificar la ayuda conservando instrucciones decimales. Conservar Gasto mediante propiedades optativas.

- Conservar cabecera contextual con regreso y título, actividad obligatoria y última actividad disponible precargada.
- Mostrar etiquetas por encima de los campos de actividad, fecha, descripción y observaciones; añadir iconos de apoyo y ejemplos en los textos opcionales. Reutilizar componentes mediante propiedades opcionales que no alteren los demás formularios.
- Compactar medios de cobro: icono y nombre a la izquierda, importe a la derecha, con placeholder cero y alineación numérica. Mantener siempre visible y editable la billetera real de cada distribución, aunque el PNG la omita. Conservar quitar/agregar medios y moneda accesible.
- Ubicar una ayuda breve sobre campos vacíos debajo de las filas; conservar instrucciones de formato decimal y validaciones.
- Total verde exacto de 24 px, resumen claro y acción Guardar ingreso azul con icono de guardado, como la referencia. Mantener estado pendiente, bloqueo y errores.
- Adaptar 320 y 390 px sin recortar contenido; preservar el formulario de gasto y sus colores mediante cambios optativos para ingreso.

## Restricciones y validación

Sin datos ficticios, logos comerciales, cambios de cálculos, preferencias, persistencia o migraciones. Descripción y observaciones siguen siendo opcionales. No ocultar decimales ni guardar operaciones para preparar capturas. Revisar visualmente el borrador disponible y el formulario compartido de gasto; registrar lo realmente observado y los límites en REVISION_VISUAL.md. No crear ni ejecutar tests. Comprobar tipos, revisar git diff y ejecutar git diff --check.

## Git

Rama: task_26/087_refinar_nuevo_ingreso.
Commit: style(ingresos): refina formulario de nuevo ingreso.
Sin push ni merge automático. Detenerse al finalizar.

### Referencia final del usuario — 03/10/2026

La nueva imagen codex-clipboard-1542c33c-2ae0-4297-87d5-2dabf41e7d6a.png sustituye la composición anterior del ingreso: lista única con separadores, icono/nombre y billetera real editable en texto debajo, importe a la derecha, subtítulo breve y bloque TOTAL INGRESO verde con icono de tendencia dentro de Medios de cobro. Fecha y Descripción siguen juntas cuando caben; Descripción sigue siendo opcional aunque su etiqueta se abrevie. Moneda, formato decimal y agregar/quitar medios quedan en opciones desplegables para despejar el formulario. No copiar importes, logos ni datos de la imagen; mantener selección de billetera accesible y errores. Implementar como corrección de la TAREA 87 en su rama existente, con commit adicional y sin tests, push ni merge.

---

# TAREA 88 — Refinar Nuevo gasto según la referencia

## Estado

Completada el 03/10/2026; documentada antes de modificar código. Tipos y compilación correctos; revisión y límites en REVISION_VISUAL.md. Tests: no creados ni ejecutados.

## Objetivo y cambios

Aplicar la columna Nuevo gasto de codex-clipboard-db9aec32-4512-47d1-82e6-def2f18d019d.png. Mantener cabecera y regreso. Mostrar etiquetas exteriores en Categoría obligatoria, Actividad opcional, Fecha obligatoria, Descripción obligatoria y Observaciones opcionales. Fecha y Descripción apiladas en Gasto como la referencia; no modificar la composición vigente de Ingreso.

Medios de pago: tarjetas compactas con icono/nombre e importe, billetera real editable en texto debajo; subtotal exacto TOTAL GASTO rojo con flecha de salida; Guardar gasto rojo. Accesos visibles más y Agregar otro medio de pago abren opciones de medios reales disponibles, con quitar y moneda accesibles. No inventar medios, importes, logos o billeteras ni ocultar campos financieros necesarios.

## Restricciones y validación

Conservar última categoría/actividad disponibles, distribución histórica, moneda, dinero exacto, campos vacíos como cero, validaciones, errores y bloqueo pendiente. Sin cambios de servicios o persistencia. Documentar comentarios en español. Revisión manual de borradores a 320/390 px y comprobación de Ingreso por componente compartido, sin guardar operaciones. Registrar límites; tipos y compilación cuando corresponda, git diff y git diff --check. No crear ni ejecutar tests, tags o push.

## Git

Rama task_26/088_refinar_nuevo_gasto. Commit style(gastos): refina formulario de nuevo gasto. Verificar e integrar la tarea previa antes de crear rama; detenerse tras el commit de esta tarea.

### Corrección autorizada de TAREA 88

Fecha y Descripción compartirán fila desde 390 px y se apilarán en anchos menores. Los medios de pago de Gasto usarán la misma lista unificada con separadores de Ingreso: icono, nombre y billetera real editable a la izquierda e importe a la derecha. Sustituye las tarjetas separadas y el apilado de campos de la referencia anterior. Conservar total rojo, botones, opciones y validaciones. Commit adicional en la rama de TAREA 88; sin tests ni push.

---

# TAREA 89 — Refinar listas de Ingresos y Gastos

## Estado

Completada el 03/10/2026. TAREA 88 integrada en main por fast-forward; planificación documentada antes del código. Tipos y compilación correctos. Revisión visual y límites en REVISION_VISUAL.md. Tests: no creados ni ejecutados.

## Alcance y referencia

Aplicar la referencia codex-clipboard-75969ae4-6f51-424a-84d5-ca27b12c4a92.png: título y Agregar en una fila, verde para Ingresos y rojo para Gastos; filtros Todos, Este mes, Mes anterior y Personalizar; resumen semántico del período; búsqueda y acceso a filtros; grupos mensuales con subtotal; tarjetas con icono del catálogo, nombre, fecha, descripción, importe a la derecha y distribuciones históricas por medio/billetera. Mantener acciones de edición y eliminación lógica confirmada.

Los filtros y la búsqueda deben operar antes de paginar. Los totales mensuales y generales incluirán todas las coincidencias, separados por moneda, sin cargar la historia completa en memoria. Mostrar Todos los períodos cuando Todos esté activo: la imagen mezcla Todos con Octubre y no debe copiarse esa ambigüedad. Buscar descripción y nombres de actividad/categoría; filtros de actividad y categoría según operación. Detalles monetarios solo para la página visible, con billetera histórica y etiqueta de legado si falta. No inferir billeteras desde preferencias actuales.

## Restricciones y validación

Sin datos ficticios, migraciones, cambios de escrituras, formatos monetarios, formularios o navegación. Reutilizar tokens, radios explícitos de 16 px y componentes existentes; comentarios y JSDoc en español. Preservar carga, vacío, error y paginación. Revisar visualmente a 320/390 px y escritorio cuando sea posible, sin guardar operaciones; registrar límites. Comprobar tipos y compilación, revisar git diff y git diff --check. No crear ni ejecutar tests, push o tags.

## Git

Rama: task_26/089_refinar_listas_ingresos_gastos.
Commit: style(operaciones): refina listas de ingresos y gastos.
Detenerse tras el commit, sin merge automático de esta tarea.

---

# TAREA 90 — Refinar Reportes según la referencia

## Estado

Completada el 04/10/2026. TAREA 89 integrada en main por fast-forward; documentada antes del código. Tipos y compilación correctos; revisión y límites en REVISION_VISUAL.md. Tests: no creados ni ejecutados.

## Alcance

Referencias d6807e48-81e0-4fff-9e71-47c713e91c07 (sistema visual) y fe93adbb-fa14-41f7-bd98-15481b37e615 (Reportes). Cabecera con período accesible, pestañas Resumen, Ingresos, Gastos, Actividades y Billeteras. Conservar Hoy, Semana, Mes, Año y Personalizado, agregando selección de otro mes. Resumen: ingresos/gastos en dos tarjetas, ganancia en tarjeta ancha, patrimonio actual y movimientos internos separados; evolución mensual combinada y movimientos recientes. Ingresos: barras por actividad, evolución y distribución por medio de cobro. Gastos: barras por categoría, evolución y distribución por medio de pago. Actividades mantiene rentabilidad con gastos asociados y sin actividad separados; Billeteras conserva patrimonio actual y transferencias/ajustes del período.

## Reglas

Gráficos basados en agregaciones reales, separados por moneda, con etiquetas y valores exactos accesibles. Evolución: seis meses de calendario hasta el mes del fin seleccionado, claramente identificados; no representa automáticamente el rango personalizado. Comparaciones: mes anterior para Mes, año anterior para Año, período inmediatamente anterior de igual duración para otros rangos; mostrar ausencia de base comparable si el importe anterior es cero o negativo. Las comparativas antes excluidas quedan autorizadas exclusivamente dentro de esta tarea. No inventar porcentajes, logos o cifras de las imágenes. Mantener flechas semánticas vigentes, centavos, radios de 16 px, paleta normativa y contrastes.

Transferencias y ajustes no se suman a resultado; el bloque interno muestra transferencias, ajustes positivos y negativos por separado, sin un total combinado ambiguo. Patrimonio es actual, independiente del período. Movimientos recientes identificados como tales, sin presentarlos como exclusivamente del período; conservar accesos reales. Consultas agregadas en servicios/repositorios, sin cargar la historia en React ni modificar escrituras o migraciones. Comentarios/JSDoc en español.

## Validación y Git

Revisión manual a 320/390 px y escritorio según disponibilidad, sin modificar datos; registrar diferencias y límites. Tipos, compilación, revisión de git diff y git diff --check. No crear ni ejecutar tests, push, tags o release.
Rama task_26/090_refinar_reportes. Commit style(reportes): refina panel y desgloses financieros. Detenerse tras commit; sin merge automático de TAREA 90.


### Corrección visual de Reportes — 04/10/2026

Continuación de TAREA 90 en su misma rama: acercar la composición a la referencia c880b95b. Cabecera móvil única con título y mes; tarjetas y accesos patrimoniales compactos; comparación con indicador semántico; eje monetario graduado; anillo y leyenda contiguos cuando el ancho lo permita. Mantener centavos, datos reales, fechas accesibles, alternativas textuales y separación de transferencias/ajustes. No crear opciones de gráfico ficticias. Validar visualmente y compilar, sin tests ni merge automático.


# TAREA 91 — Refinar Ajustes y Actividades

Estado: completada el 04/10/2026. Referencia 6ccf4b0b del usuario. Rama task_26/091_refinar_ajustes_actividades.

Alcance: menú con Catálogos primero, Preferencias y Respaldo; iconos semánticos, descripciones y superficies agrupadas. Actividades con cabecera Agregar, búsqueda, filtros Todas/Activas/Inactivas/Archivadas aplicados antes de paginar, tarjetas compactas con tipo y fechas. Editor en página con campos exteriores, color/icono plegables en dos columnas, fechas en fila, estado y disponibilidad independientes, Guardar cambios verde y Cancelar. Mantener tipos personalizados existentes. Desactivar conserva historia: no inventar eliminación física. No agregar notificaciones o moneda configurable inexistentes ni controles decorativos sin acción. Exportar/importar permanecen en el flujo validado de respaldo. Comentarios en español.

Validación: compilación, revisión manual sin escribir datos, git diff y git diff --check. Tests: no ejecutados. Commit style(ajustes): refina menú y edición de actividades. Sin push ni merge automático.
