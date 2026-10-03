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

# Regla de lectura para TAREAS 52–66

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

# TAREA 67 — Generar tests

ESTA ES LA PRIMERA TAREA EN LA QUE SE PUEDEN CREAR TESTS.

Crear tests para:

```text
dinero
UUID
actividades
categorías
medios
billeteras
ingresos
gastos
transferencias
ajustes
conciliación
saldos
repositorios
migraciones
backup
reportes
modo oscuro
```

Agregar componentes cuando aporte valor.

Agregar E2E para flujos principales.

IMPORTANTE:

NO EJECUTARLOS.

No ejecutar:

```text
pnpm test
vitest
playwright
npm test
```

## Commit

```text
test(proyecto): agrega cobertura inicial
```

Al finalizar escribir:

```text
Los tests fueron creados pero no ejecutados.
```

Detenerse.

---

# TAREA 68 — Ejecutar tests

NO REALIZAR AUTOMÁTICAMENTE.

Esperar instrucción explícita:

```text
Ejecuta los tests.
```

Cuando se autorice ejecutar progresivamente:

1. unitarios;
2. componentes;
3. persistencia;
4. E2E.

No ejecutar todo junto inicialmente.

Corregir fallos reales mediante commits separados.

---

# TAREA 69 — Preparar release

NO REALIZAR AUTOMÁTICAMENTE.

Cuando el usuario solicite preparar versión:

mostrar primero:

```text
Versión actual
Versión propuesta
Motivo
```

Después actualizar:

```text
package.json
CHANGELOG.md
Android
iOS
```

Commit:

```text
chore(release): prepara version X.Y.Z
```

Tag:

```text
vX.Y.Z
```

Solo después de autorización.