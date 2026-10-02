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
src/app/tema/
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

# TAREA 51 — Generar tests

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

# TAREA 52 — Ejecutar tests

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

# TAREA 53 — Preparar release

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
