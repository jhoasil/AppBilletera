# AppBilletera — Reglas permanentes para Codex

Este archivo contiene reglas permanentes para trabajar sobre AppBilletera.

Antes de realizar cualquier tarea, Codex debe leer este archivo y respetarlo durante toda la ejecución.

Las instrucciones específicas de cada fase se encuentran en:

```text
docs/TAREAS_CODEX.md
```

---

# 1. Objetivo

AppBilletera es una aplicación personal multiplataforma para administrar:

- actividades y trabajos;
- ingresos;
- gastos;
- categorías de gastos;
- medios de pago;
- billeteras;
- transferencias entre billeteras;
- ajustes y conciliaciones;
- rentabilidad;
- reportes;
- respaldos.

La aplicación debe priorizar:

- integridad financiera;
- preservación de datos;
- trazabilidad;
- rapidez de carga;
- funcionamiento offline;
- simplicidad;
- uso desde celular;
- rendimiento;
- consistencia visual;
- escalabilidad futura.

---

# 2. Plataformas objetivo

AppBilletera debe funcionar desde una única base de código en:

```text
Web
PWA
Android
iOS
iPadOS
```

No crear aplicaciones funcionalmente separadas por plataforma.

La lógica de negocio y las pantallas deben ser compartidas.

Las diferencias específicas de plataforma deben encapsularse detrás de adaptadores.

---

# 3. Stack

Utilizar:

```text
React
TypeScript
Vite
Material UI
Material Icons
Capacitor
pnpm
```

Persistencia:

```text
Web / PWA
→ IndexedDB

Android
→ SQLite

iOS / iPadOS
→ SQLite
```

No implementar backend obligatorio en la primera versión.

---

# 4. Package manager

Utilizar exclusivamente:

```text
pnpm
```

Mantener:

```text
pnpm-lock.yaml
```

No generar:

```text
package-lock.json
yarn.lock
```

`package.json` debe declarar el package manager seleccionado.

Ejemplo:

```json
{
  "packageManager": "pnpm@..."
}
```

No utilizar `npm install` ni `yarn install` dentro del proyecto.

---

# 5. Idioma del proyecto

Todo concepto propio de AppBilletera debe mantenerse en español.

Esto incluye:

- módulos funcionales;
- archivos funcionales;
- componentes propios;
- interfaces;
- tipos;
- clases;
- servicios;
- repositorios propios;
- funciones;
- variables;
- parámetros;
- propiedades;
- entidades;
- mensajes;
- documentación;
- nombres de tablas;
- nombres de columnas;
- comentarios.

Ejemplos:

```ts
Actividad
Ingreso
Gasto
Billetera
MedioPago
CategoriaGasto

ServicioIngresos
RepositorioBilleteras

crearIngreso()
transferirEntreBilleteras()
conciliarBilletera()
calcularRentabilidad()
```

---

# 6. Excepciones de idioma

Las carpetas de arquitectura técnica utilizan inglés convencional.

Raíz de `src`:

```text
app
core
database
modules
shared
```

Dentro de `app`:

```text
data
navigation
preferences
theme
```

Dentro de `core`:

```text
entities
money
repositories
services
```

Dentro de `database`:

```text
adapters
contracts
data
migrations
repositories
web
```

Dentro de `shared`:

```text
components
dates
money
```

Los módulos funcionales permanecen en español:

```text
ajustes
billeteras
gastos
ingresos
inicio
reportes
catalogos
```

Esta excepción afecta únicamente a estructura técnica.

No autoriza traducir al inglés funcionalidades propias del proyecto.

---

# 7. APIs y convenciones externas

No traducir nombres pertenecientes a tecnologías externas.

Mantener cuando corresponda:

```text
React
TypeScript
Material UI
Capacitor
IndexedDB
SQLite

useState
useEffect
useMemo
useCallback
useContext

localStorage
sessionStorage
fetch
Promise
JSON
Map
Set
Date

onClick
onChange
onSubmit
aria-label
```

También pueden mantenerse términos técnicos cuando traducirlos reduzca claridad:

```text
hook
provider
adapter
plugin
API
UUID
SQL
PWA
JSON
```

---

# 8. Nomenclatura TypeScript

Componentes React:

```text
PaginaInicio
PaginaIngresos
PaginaGastos
PaginaBilleteras
FormularioIngreso
FormularioGasto
SelectorIcono
SelectorBilletera
```

Funciones:

```text
crearIngreso()
actualizarIngreso()
crearGasto()
transferirEntreBilleteras()
ajustarSaldo()
obtenerSaldoBilletera()
calcularResumenPeriodo()
```

Variables:

```text
actividadSeleccionada
categoriaSeleccionada
billeteraOrigen
billeteraDestino
importeTotal
fechaMovimiento
```

Hooks propios:

```text
useIngresos
useGastos
useBilleteras
useActividades
```

El prefijo `use` se conserva por ser una convención de React.

---

# 9. Nomenclatura SQL

Toda la base de datos propia utiliza:

```text
español
snake_case
```

Ejemplos:

```text
actividades
ingresos
gastos
medios_pago
categorias_gasto
billeteras
ingresos_medios_pago
gastos_medios_pago
transferencias_billeteras
movimientos_billetera
ajustes_billetera
```

---

# 10. Claves primarias

Todas las tablas utilizan:

```text
id
```

como clave primaria.

Ejemplos:

```text
actividades.id
ingresos.id
gastos.id
billeteras.id
categorias_gasto.id
```

No utilizar:

```text
id_actividad
id_ingreso
id_gasto
```

como claves primarias.

---

# 11. UUID

El campo:

```text
id
```

de las entidades principales contiene directamente un UUID generado localmente.

No utilizar IDs autoincrementales como identidad principal.

No crear simultáneamente:

```text
id
uuid
```

El UUID es directamente:

```text
id
```

Utilizar cuando sea compatible:

```ts
crypto.randomUUID()
```

La identidad debe poder generarse completamente offline y conservarse posteriormente en:

```text
IndexedDB
SQLite
futuras APIs
futura base cloud
```

---

# 12. Claves foráneas

Las FK utilizan:

```text
<entidad>_id
```

Ejemplos:

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

No utilizar convenciones como:

```text
id_actividad
id_billetera
```

---

# 13. Auditoría temporal

Utilizar cuando corresponda:

```text
creado_en
actualizado_en
eliminado_en
```

Los instantes de auditoría deben manejarse consistentemente.

Preferir:

```text
ISO 8601 UTC
```

cuando representan un instante.

Las fechas de negocio sin hora pueden utilizar:

```text
AAAA-MM-DD
```

---

# 14. Borrado lógico

No eliminar físicamente registros utilizados históricamente.

Utilizar:

```text
eliminado_en
```

y/o:

```text
activo
```

según corresponda.

Una entidad desactivada no debe aparecer para nuevas operaciones cuando corresponda.

Debe continuar resolviendo correctamente operaciones históricas.

Aplica especialmente a:

```text
Actividades
Categorías
Medios de pago
Billeteras
```

---

# 15. Dinero

Nunca persistir dinero utilizando `float`.

Guardar importes como enteros en unidades monetarias menores.

Campo habitual:

```text
importe_centavos
```

Ejemplo:

```text
$1.500,25
```

se almacena como:

```text
150025
```

Moneda inicial:

```text
ARS
```

La arquitectura no debe impedir agregar nuevas monedas posteriormente.

---

# 16. Arquitectura

Mantener separación clara:

```text
Presentación
      ↓
Aplicación / Servicios
      ↓
Dominio
      ↓
Contratos de repositorios
      ↓
Infraestructura
      ↓
IndexedDB / SQLite
```

La UI nunca debe:

```text
ejecutar SQL
acceder directamente a IndexedDB
acceder directamente a SQLite
```

La lógica financiera no debe implementarse dentro de componentes React.

Consultar:

```text
docs/ARQUITECTURA.md
```

---

# 17. Persistencia multiplataforma

Las capas superiores no deben saber qué motor está utilizando la aplicación.

Conceptualmente:

```text
RepositorioIngresos
       │
       ├── Web → IndexedDB
       │
       └── Nativo → SQLite
```

Lo mismo aplica a:

```text
gastos
actividades
billeteras
catálogos
transferencias
reportes
```

---

# 18. Local-first

La aplicación debe funcionar completamente offline para sus funciones principales.

El usuario debe poder:

```text
crear
editar
consultar
transferir
conciliar
generar reportes
administrar catálogos
```

sin conexión.

La conectividad no debe ser requisito para registrar operaciones financieras.

---

# 19. Futuro cloud

La arquitectura puede evolucionar posteriormente hacia:

```text
App
 ↓
Base local
 ↓
Servicio de sincronización
 ↓
API
 ↓
Base cloud
```

No implementar sincronización cloud en V1.

No sobreingenierizar anticipadamente.

Los UUID y las reglas de idempotencia deben facilitar esa evolución.

---

# 20. Actividades

Una actividad representa una fuente de generación de ingresos, trabajo, servicio o proyecto.

Ejemplos:

```text
DiDi
Uber
Fotografía
Programación
Ventas
Pintura
Trabajo temporal
Trabajo fijo
Servicio
```

Campos principales:

```text
id
nombre
tipo
descripcion
icono
color
fecha_inicio
fecha_fin
estado
activo
creado_en
actualizado_en
eliminado_en
```

---

# 21. Trabajos temporales

Una actividad puede representar un trabajo temporal.

Ejemplo:

```text
Pintura departamento
```

Puede tener:

```text
fecha_inicio
fecha_fin
múltiples ingresos
múltiples gastos
rentabilidad propia
```

Estados iniciales:

```text
activo
finalizado
archivado
```

No crear otra entidad si `Actividad` resuelve correctamente el concepto.

---

# 22. Iconos

Las entidades configurables pueden utilizar:

```text
icono
color
```

cuando corresponda.

Utilizar Material Icons.

No guardar SVG completos en la base.

Guardar un identificador estable del icono.

Los selectores visuales deben reutilizar componentes compartidos.

---

# 23. Catálogos

Los catálogos se administran desde:

```text
Ajustes
```

ABM principales:

```text
Actividades
Categorías de gastos
Medios de pago
Billeteras
```

Los formularios de ingreso y gasto consumen estos catálogos.

No deben convertirse en pantallas de administración de catálogos.

---

# 24. Medios de pago

Ejemplos iniciales:

```text
Efectivo
Transferencia
Tarjeta
```

Son registros normales.

No hardcodearlos como lógica de negocio.

Cada medio puede tener:

```text
id
nombre
icono
color
mostrar_en_carga_rapida
orden
billetera_predeterminada_id
activo
creado_en
actualizado_en
eliminado_en
```

---

# 25. Medio de pago y billetera

No confundir:

```text
Medio de pago
```

con:

```text
Billetera
```

Un medio de pago responde:

```text
¿Cómo se pagó o cobró?
```

Una billetera responde:

```text
¿Dónde está o de dónde salió el dinero?
```

Ejemplo:

```text
Medio:
Transferencia

Billetera:
Banco Galicia
```

---

# 26. Billetera predeterminada

El campo:

```text
medios_pago.billetera_predeterminada_id
```

es exclusivamente una preferencia para agilizar nuevas operaciones.

Puede utilizarse para precargar una billetera.

No representa la billetera histórica de las operaciones.

Modificar:

```text
billetera_predeterminada_id
```

no debe modificar ni reinterpretar registros anteriores.

---

# 27. Billetera histórica obligatoria

Cada detalle monetario persistido debe conservar la billetera realmente utilizada.

Ingresos:

```text
ingresos_medios_pago.billetera_id
```

Gastos:

```text
gastos_medios_pago.billetera_id
```

En el modelo financiero vigente:

```text
billetera_id
```

es obligatorio para todo detalle positivo persistido.

Todo dinero que entra debe ingresar a una billetera.

Todo dinero que sale debe salir de una billetera.

Nunca reconstruir posteriormente la billetera histórica mediante:

```text
medios_pago.billetera_predeterminada_id
```

---

# 28. Carga rápida

La prioridad principal de UX es cargar operaciones habituales con la menor cantidad razonable de pasos.

Los medios configurados como:

```text
mostrar_en_carga_rapida = true
```

deben aparecer inmediatamente.

Ejemplo:

```text
Efectivo        $ [        ]
Transferencia   $ [        ]
Tarjeta         $ [        ]
```

La billetera puede venir sugerida.

Debe poder utilizarse la billetera real correspondiente.

---

# 29. Campos vacíos

En formularios rápidos, un importe vacío se considera:

```text
0
```

para el cálculo visual.

Ejemplo:

```text
Efectivo        35000
Transferencia
Tarjeta         15000
```

No crear un detalle persistido por una línea vacía.

Persistir solamente detalles con:

```text
importe_centavos > 0
```

No permitir guardar un ingreso o gasto cuyo total final sea cero.

---

# 30. Integridad de totales

Para ingresos:

```text
SUM(ingresos_medios_pago.importe_centavos)
=
ingresos.importe_total_centavos
```

Para gastos:

```text
SUM(gastos_medios_pago.importe_centavos)
=
gastos.importe_total_centavos
```

o su equivalente según los nombres definitivos del modelo.

No permitir inconsistencias entre cabecera y detalles.

---

# 31. Recordar últimos valores

Para agilizar la carga puede recordarse localmente:

```text
ultima_actividad_ingreso
ultima_actividad_gasto
ultima_categoria_gasto
```

y otras preferencias de interfaz aprobadas.

Puede utilizarse:

```text
localStorage
```

para preferencias de UI.

No guardar datos financieros reales en `localStorage`.

---

# 32. Nuevo ingreso

Debe permitir:

```text
Actividad
Fecha
Descripción opcional
Observaciones opcionales
Medios de cobro
Billetera real por detalle
```

Ejemplo:

```text
Actividad: DiDi

Efectivo
Billetera: Efectivo
$35.000

Transferencia
Billetera: Banco Galicia
$20.000

TOTAL
$55.000
```

---

# 33. Nuevo gasto

Debe permitir:

```text
Categoría
Actividad opcional
Fecha
Descripción
Observaciones opcionales
Medios de pago
Billetera real por detalle
```

Ejemplo:

```text
Categoría: Combustible
Actividad: DiDi

Efectivo
Billetera: Efectivo
$20.000

Tarjeta
Billetera: Ualá
$30.000

TOTAL
$50.000
```

---

# 34. Ingresos

No crear columnas:

```text
efectivo
transferencia
tarjeta
```

en la tabla principal de ingresos.

Utilizar:

```text
ingresos
ingresos_medios_pago
```

Un ingreso puede contener múltiples detalles.

Cada detalle positivo conserva:

```text
medio_pago_id
billetera_id
importe_centavos
```

---

# 35. Gastos

Utilizar:

```text
gastos
gastos_medios_pago
```

Un gasto puede contener múltiples detalles.

Puede asociarse opcionalmente a una actividad.

Cada detalle positivo conserva:

```text
medio_pago_id
billetera_id
importe_centavos
```

---

# 36. Billeteras

Las billeteras representan dónde está el dinero.

Ejemplos:

```text
Efectivo
Mercado Pago
Banco Galicia
Cuenta DNI
Ualá
```

Campos principales:

```text
id
nombre
tipo
icono
color
moneda
activo
creado_en
actualizado_en
eliminado_en
```

El saldo no debe editarse directamente desde el ABM.

---

# 37. Compatibilidad de moneda

Una operación financiera solo puede afectar billeteras compatibles con la moneda de la operación.

Ejemplo válido:

```text
Ingreso ARS
→ Billetera ARS
```

Una transferencia normal requiere billeteras de la misma moneda.

Ejemplo no permitido como transferencia normal:

```text
Billetera ARS
→ Billetera USD
```

Una futura conversión monetaria debe modelarse como una operación específica.

---

# 38. Saldo inicial

Al crear una billetera puede definirse:

```text
saldo inicial
fecha
```

No guardar el saldo solamente como atributo mutable.

Crear un movimiento:

```text
SALDO_INICIAL
```

El saldo inicial aumenta patrimonio.

No representa ingreso ni rentabilidad.

---

# 39. Movimientos de billetera

La fuente de verdad del saldo es:

```text
movimientos_billetera
```

Campos conceptuales:

```text
id
billetera_id
tipo
referencia_tipo
referencia_id
importe_centavos
fecha
descripcion
creado_en
```

Importes:

```text
positivo → entrada
negativo → salida
```

Tipos iniciales:

```text
SALDO_INICIAL
INGRESO
GASTO
TRANSFERENCIA_ENTRADA
TRANSFERENCIA_SALIDA
AJUSTE_POSITIVO
AJUSTE_NEGATIVO
```

---

# 40. Referencias de movimientos de ingresos

Un movimiento derivado de un ingreso debe referenciar preferentemente el detalle específico que produjo el impacto.

Utilizar:

```text
referencia_tipo = INGRESO_MEDIO_PAGO
referencia_id   = ingresos_medios_pago.id
```

Esto permite conocer exactamente:

```text
medio de pago
billetera
importe
```

que originaron el movimiento.

No utilizar solamente la cabecera de ingreso cuando existe un detalle individual identificable.

---

# 41. Referencias de movimientos de gastos

Un movimiento derivado de un gasto debe referenciar el detalle que produjo el impacto.

Utilizar:

```text
referencia_tipo = GASTO_MEDIO_PAGO
referencia_id   = gastos_medios_pago.id
```

Esto debe preservar la relación histórica entre:

```text
Gasto
Detalle
Billetera
Movimiento
```

---

# 42. Transferencias entre billeteras

Una transferencia no es:

```text
Ingreso
Gasto
```

Ejemplo:

```text
Efectivo
→ Banco Galicia

$100.000
```

Debe generar:

```text
Efectivo       -100000
Banco Galicia  +100000
```

Tipos:

```text
TRANSFERENCIA_SALIDA
TRANSFERENCIA_ENTRADA
```

Ambos movimientos referencian:

```text
referencia_tipo = TRANSFERENCIA
referencia_id   = transferencia.id
```

El patrimonio total no cambia.

---

# 43. Tabla de transferencias

Utilizar conceptualmente:

```text
transferencias_billeteras
```

con:

```text
id
billetera_origen_id
billetera_destino_id
importe_centavos
fecha
descripcion
creado_en
actualizado_en
eliminado_en
```

No permitir:

```text
billetera_origen_id = billetera_destino_id
```

---

# 44. Atomicidad financiera

Las estructuras relacionadas con una operación financiera forman una única operación lógica.

Ingreso:

```text
ingreso
+
detalles
+
movimientos
```

Gasto:

```text
gasto
+
detalles
+
movimientos
```

Transferencia:

```text
transferencia
+
movimiento salida
+
movimiento entrada
```

Ajuste:

```text
ajuste
+
movimiento
```

Cuando el motor lo permita deben escribirse dentro de una única transacción.

Si una parte falla, no dejar una operación parcialmente confirmada.

---

# 45. Idempotencia

Una operación repetida accidentalmente no debe generar un segundo impacto financiero.

Especialmente:

```text
Ingreso
Gasto
Transferencia
Ajuste
Saldo inicial
```

deben contar con una estrategia para reconocer efectos ya persistidos.

Para movimientos derivados, la identidad lógica debe considerar conceptualmente:

```text
referencia_tipo
referencia_id
tipo
```

o un mecanismo equivalente que proporcione la misma garantía.

Ejemplo incorrecto:

```text
Movimiento +35000
Movimiento +35000
```

por reintentar una misma línea de ingreso.

---

# 46. Edición de operaciones

Editar un ingreso o gasto no debe dejar movimientos correspondientes a un estado anterior inválido.

La operación debe mantener consistencia entre:

```text
cabecera
detalles
movimientos
```

Debe conservar trazabilidad.

No duplicar efectos durante una edición.

---

# 47. Conciliación de billetera

No permitir editar directamente:

```text
saldo = ...
```

La conciliación compara:

```text
Saldo calculado
Saldo real
Diferencia
```

Cálculo:

```text
Diferencia =
Saldo real - Saldo calculado
```

Si:

```text
Diferencia = 0
```

no generar ajuste financiero.

---

# 48. Movimiento faltante

Si el usuario identifica la causa real de una diferencia, preferir registrar la operación real.

Ejemplos:

```text
Ingreso faltante
Gasto faltante
```

La operación debe pasar por el flujo normal de ingreso o gasto.

No crear adicionalmente un ajuste para la misma diferencia.

---

# 49. Ajustes

Cuando la diferencia no pueda atribuirse a una operación real, utilizar:

```text
AJUSTE_POSITIVO
AJUSTE_NEGATIVO
```

Los ajustes modifican patrimonio.

No se consideran automáticamente:

```text
Ingreso
Gasto
```

Deben permanecer separados del resultado financiero.

Referencia:

```text
referencia_tipo = AJUSTE
referencia_id   = ajuste.id
```

---

# 50. Última conciliación

Guardar cuando corresponda:

```text
conciliado_en
```

o registro equivalente.

Mostrar la última conciliación cuando sea útil en la interfaz.

---

# 51. Saldo de billeteras

No calcular saldos cargando todos los movimientos en JavaScript.

No utilizar como estrategia principal:

```ts
obtenerTodosLosMovimientos()
  .filter(...)
  .reduce(...)
```

Las agregaciones deben resolverse en la capa de persistencia.

Los filtros visuales de una lista de movimientos no modifican el saldo actual de la billetera.

---

# 52. Índices

Crear índices apropiados para las consultas reales.

Especialmente:

```text
movimientos_billetera(billetera_id, fecha)

movimientos_billetera(referencia_tipo, referencia_id)

ingresos(fecha)

gastos(fecha)

ingresos(actividad_id, fecha)

gastos(actividad_id, fecha)

gastos(categoria_id, fecha)
```

Agregar índices adicionales cuando exista una necesidad concreta.

No crear índices arbitrariamente.

---

# 53. Caché de saldo

Actualmente:

```text
movimientos_billetera
```

es la única fuente de verdad del saldo.

No agregar:

```text
saldo_actual_centavos
```

como estado persistido duplicado mientras no exista una medición que justifique hacerlo.

Si en el futuro se incorpora un cache:

- debe ser reconstruible;
- nunca debe reemplazar los movimientos como fuente de verdad;
- debe existir una estrategia completa de invalidación;
- debe incorporarse mediante una migración.

Consultar:

```text
docs/SALDOS_HISTORICOS.md
```

---

# 54. Saldos históricos

Para obtener un saldo histórico se deben considerar solamente movimientos hasta el corte solicitado.

Conceptualmente:

```text
fecha <= hasta
```

No materializar cierres periódicos en V1 sin una necesidad medida.

Puede evaluarse en el futuro:

```text
saldos_billetera_periodo
```

como proyección reconstruible.

Nunca como nueva fuente de verdad.

---

# 55. Reportes

Separar conceptualmente:

## Resultado

```text
Ingresos
Gastos
Ganancia neta
```

## Patrimonio

```text
Saldos de billeteras
Total disponible
```

## Movimientos internos

```text
Transferencias
Ajustes
```

No mezclar estos conceptos.

Las transferencias internas no afectan ganancia.

Los ajustes no se consideran automáticamente ingresos ni gastos.

---

# 56. Rentabilidad por actividad

Para cada actividad calcular:

```text
Ingresos
Gastos asociados
Ganancia neta
```

Ejemplo:

```text
DiDi

Ingresos $520.000
Gastos   $190.000
Neto     $330.000
```

No atribuir a una actividad gastos que no tengan una asociación válida.

---

# 57. Pantalla Inicio

La pantalla principal debe priorizar:

```text
Ganancia de hoy
Ingresos
Gastos
Mi dinero
Últimos movimientos
```

Ingresos y Gastos deben tener acceso directo a:

```text
+ Agregar ingreso
+ Agregar gasto
```

No obligar al usuario a abrir un menú intermedio para operaciones frecuentes.

Consultar:

```text
docs/PANTALLAS.md
docs/GUIA_VISUAL.md
```

---

# 58. Inicio — Billeteras

Mostrar un resumen breve.

Ejemplo:

```text
Mi dinero

Efectivo       $250.000
Mercado Pago   $120.000
Galicia        $320.000
```

Acciones:

```text
Transferir
Ver todas
```

---

# 59. Últimos movimientos

La pantalla principal puede mostrar:

```text
Ingreso DiDi           +$35.000
Gasto Combustible      -$20.000
Efectivo → Galicia      $100.000
Ajuste caja            -$15.000
```

Diferenciar visualmente los tipos mediante:

```text
texto
signo
icono
color
```

No utilizar el color como única señal.

---

# 60. Navegación móvil

Navegación inferior principal:

```text
Inicio
Ingresos
Gastos
Reportes
```

Ajustes mediante:

```text
AppBar
menú
icono de configuración
```

Billeteras deben ser accesibles rápidamente desde Inicio.

---

# 61. Navegación desktop

En pantallas amplias adaptar mediante:

```text
NavigationRail
Drawer
Sidebar
```

o equivalente.

No duplicar pantallas.

No crear otra implementación funcional por plataforma.

---

# 62. Material UI

Utilizar Material UI como sistema visual principal.

Utilizar cuando corresponda:

```text
Card
AppBar
BottomNavigation
Dialog
Drawer
TextField
Select
Chip
Snackbar
Tabs
Switch
IconButton
Skeleton
```

Antes de crear un nuevo componente revisar:

```text
src/shared/components/
```

Reutilizar componentes existentes cuando realmente resuelvan el mismo problema.

---

# 63. Sistema visual

El sistema visual normativo está documentado en:

```text
docs/GUIA_VISUAL.md
```

No crear valores visuales arbitrarios por pantalla cuando ya existe una regla compartida.

Centralizar:

```text
colores
tipografía
espaciado
radios
sombras
breakpoints
estados
```

en el theme o componentes compartidos.

---

# 64. Pantallas

La estructura y comportamiento de cada pantalla se documentan en:

```text
docs/PANTALLAS.md
```

Este documento define:

```text
qué muestra
qué acción permite
qué navegación produce
qué datos utiliza
qué reglas financieras debe respetar
```

Antes de modificar una pantalla, consultar las secciones relacionadas de:

```text
docs/PANTALLAS.md
docs/GUIA_VISUAL.md
```

No leer ambos documentos completos si la tarea solo necesita una pantalla concreta.

---

# 65. Modo oscuro

REQUISITO OBLIGATORIO.

AppBilletera debe soportar:

```text
Sistema
Claro
Oscuro
```

Predeterminado:

```text
Sistema
```

Guardar la preferencia mediante:

```text
localStorage
```

Utilizar el ThemeProvider.

No hardcodear colores directamente en componentes.

Todos los componentes deben funcionar correctamente en modo claro y oscuro.

---

# 66. Tema oscuro

No utilizar negro puro como fondo general.

Mantener:

```text
fondo general
superficies diferenciadas
contraste apropiado
texto principal
texto secundario
estados positivos
estados negativos
color primario
```

Consultar los tokens exactos en:

```text
docs/GUIA_VISUAL.md
```

---

# 67. Diseño mobile-first

Diseñar primero para celular.

Referencia principal:

```text
390 × 844 px
```

Debe funcionar correctamente aproximadamente desde:

```text
320 px
```

de ancho.

Después adaptar a tablet y desktop.

No sacrificar funcionalidad en pantallas pequeñas.

---

# 68. Accesibilidad

Utilizar:

```text
labels
aria cuando corresponda
contraste adecuado
foco visible
tamaños táctiles apropiados
mensajes de error comprensibles
```

Las áreas táctiles deben respetar las reglas de `GUIA_VISUAL.md`.

Los colores semánticos no deben ser la única forma de transmitir información.

---

# 69. PWA

La Web debe funcionar también como PWA instalable.

Debe existir:

```text
manifest
iconos
metadatos
service worker
soporte de instalación
```

No impedir el uso como Web tradicional.

El service worker no reemplaza la persistencia de información financiera.

---

# 70. Capacitor

Capacitor utiliza el mismo frontend React.

No duplicar:

```text
pantallas
servicios
dominio
reglas financieras
```

por plataforma.

Las diferencias nativas deben permanecer en infraestructura o adaptadores.

Consultar:

```text
docs/CAPACITOR.md
```

---

# 71. Android

Android utiliza SQLite nativo.

No commitear:

```text
local.properties
keystores privados
credenciales
APK generados
builds temporales
```

Consultar:

```text
docs/ANDROID.md
```

para requisitos y procedimiento de compilación.

No asumir que una compilación histórica garantiza que el entorno actual esté correctamente configurado.

---

# 72. iOS / iPadOS

iOS e iPadOS utilizan el mismo frontend y SQLite nativo.

No crear una UI financiera separada.

No asumir disponibilidad de macOS o Xcode.

Consultar:

```text
docs/IOS.md
```

---

# 73. Respaldo

Implementar:

```text
Exportar respaldo
Importar respaldo
```

Formato:

```text
JSON versionado
```

Campos mínimos conceptuales:

```text
version_formato
version_aplicacion
exportado_en
datos
```

---

# 74. Importación

Antes de importar:

```text
validar formato
validar versión
validar integridad
validar referencias
```

La importación debe ser transaccional.

Si falla:

```text
ROLLBACK
```

o mecanismo equivalente.

No dejar información parcialmente importada.

No sobrescribir silenciosamente historia incompatible.

---

# 75. Migraciones

La base debe tener versionado de esquema.

Ejemplo:

```text
v1
v2
v3
```

Nunca depender de borrar la aplicación para actualizar la base.

Una migración ya distribuida no debe modificarse de forma incompatible.

Los cambios posteriores deben incorporarse mediante nuevas migraciones.

Las migraciones deben proteger los datos existentes.

---

# 76. Comentarios obligatorios

Todas las funciones propias deben tener JSDoc en español.

Debe explicar como mínimo:

```text
qué hace
para qué sirve
```

Ejemplo:

```ts
/**
 * Registra un ingreso asociado a una actividad.
 *
 * Genera además los movimientos correspondientes sobre las billeteras
 * utilizadas en cada medio de cobro.
 */
async function crearIngreso(...) {
}
```

---

# 77. Comentarios adicionales

Documentar especialmente:

```text
reglas financieras
transacciones
idempotencia
conciliaciones
saldos
movimientos
borrado lógico
migraciones
caches
reglas históricas
decisiones no evidentes
```

No llenar el código de comentarios redundantes línea por línea.

---

# 78. Comentarios de tablas

Cada tabla debe tener documentación en el archivo de migración explicando:

```text
qué almacena
para qué sirve
relaciones principales
```

Ejemplo:

```ts
/**
 * Tabla: movimientos_billetera
 *
 * Registra las entradas y salidas que afectan el saldo
 * y constituye la fuente de verdad para reconstruirlo.
 */
```

---

# 79. Campos especiales

Documentar cuando su función no sea evidente:

```text
importe_centavos
eliminado_en
referencia_tipo
referencia_id
billetera_predeterminada_id
billetera_id histórico
conciliado_en
```

No documentar:

```text
saldo_actual_centavos
```

como campo vigente si no existe en el modelo.

---

# 80. Documentación y fuente de verdad

Antes de implementar una funcionalidad consultar solamente la documentación relevante.

Referencias principales:

```text
AGENTS.md
→ reglas permanentes

docs/PRODUCTO.md
→ comportamiento del producto

docs/ARQUITECTURA.md
→ arquitectura y responsabilidades

docs/MODELO_DATOS.md
→ persistencia e integridad financiera

docs/DECISIONES.md
→ decisiones vigentes y motivos

docs/GUIA_VISUAL.md
→ sistema visual

docs/PANTALLAS.md
→ contenido y comportamiento de pantallas

docs/TAREAS_CODEX.md
→ orden de trabajo

docs/VERSIONADO.md
→ versiones y releases

docs/SALDOS_HISTORICOS.md
→ estrategia de saldos
```

No repetir reglas contradictorias entre documentos.

Si se detecta una contradicción relevante:

```text
detener el cambio afectado
informarla
corregir la documentación correspondiente dentro de la tarea si está autorizado
```

No inventar silenciosamente una nueva regla.

---

# 81. Lectura eficiente de documentación

Codex no debe leer todo el repositorio ni todos los documentos en cada tarea.

Proceso:

```text
1. Leer AGENTS.md.
2. Leer la tarea actual en TAREAS_CODEX.md.
3. Leer únicamente los documentos relacionados.
4. Inspeccionar únicamente archivos potencialmente afectados.
5. Modificar lo estrictamente necesario.
```

Durante las tareas visuales:

```text
TAREAS 52–86
```

leer únicamente:

```text
principios generales relevantes
tokens necesarios
sección de la pantalla actual
componentes compartidos relacionados
```

de:

```text
GUIA_VISUAL.md
PANTALLAS.md
```

No cargar ambos documentos completos sin necesidad.

---

# 82. TAREA 51 — Alineación financiera

La TAREA 51 existe para verificar que la implementación construida durante las tareas históricas 00–50 esté alineada con el modelo financiero vigente.

Debe revisar especialmente:

```text
billetera histórica obligatoria por detalle

INGRESO_MEDIO_PAGO
GASTO_MEDIO_PAGO

referencia_tipo
referencia_id

idempotencia

atomicidad

compatibilidad de moneda

migraciones compatibles

preservación de datos existentes
```

Si la implementación ya cumple:

```text
no modificar código innecesariamente
```

Si existe una diferencia real:

```text
corregirla dentro del alcance de la tarea
```

No convertir esta tarea en un refactor general.

---

# 83. Fase visual

Las tareas:

```text
52–86
```

actualizan la interfaz siguiendo:

```text
docs/GUIA_VISUAL.md
docs/PANTALLAS.md
```

Durante esta fase:

```text
NO crear tests
NO ejecutar tests
```

salvo que el usuario modifique explícitamente el plan.

No cambiar reglas financieras únicamente para facilitar un diseño visual.

---

# 84. Git

Cada tarea debe comenzar en su propia rama antes de modificar archivos y terminar con su propio commit.

Formato obligatorio:

```text
task_AA/NNN_descripcion_de_la_tarea
```

Donde:

```text
AA
```

son los dos últimos dígitos del año de inicio.

Ejemplo:

```text
2026
→ 26
```

`NNN` utiliza tres dígitos.

Ejemplos:

```text
TAREA 00
→ task_26/000_crear_repositorio_y_documentacion

TAREA 10
→ task_26/010_disenar_base_de_datos_v1

TAREA 51
→ task_26/051_verificar_alineacion_modelo_financiero

TAREA 86
→ task_26/086_ajustar_inicio_referencia
```

Antes de modificar archivos:

```bash
git status
git branch --show-current
```

Crear rama cuando corresponda:

```bash
git switch -c task_AA/NNN_descripcion_de_la_tarea
```

Si ya existe por una ejecución anterior de la misma tarea:

```text
verificar que corresponde
continuar sobre ella
no eliminarla
no recrearla
```

No realizar tareas directamente en:

```text
main
master
```

No mezclar tareas diferentes.

---

# 85. Continúa con la siguiente tarea

Cuando el usuario indique:

```text
continúa con la siguiente tarea
```

o una expresión equivalente, esa instrucción autoriza:

```text
1. comprobar la tarea anterior;
2. verificar que sus cambios estén commiteados;
3. fusionarla a main cuando corresponda;
4. preferir fast-forward;
5. crear la rama de la siguiente tarea;
6. ejecutar únicamente esa tarea;
7. realizar su commit;
8. informar el resultado;
9. detenerse.
```

Esta instrucción no autoriza:

```text
git push
crear tests fuera de la tarea autorizada
ejecutar tests
crear tags
preparar release
realizar una segunda tarea adicional
```

---

# 86. Revisión Git antes del commit

Antes de cada commit revisar:

```bash
git status
git diff
git diff --check
```

No commitear cambios ajenos a la tarea.

No descartar cambios preexistentes del usuario.

No realizar `git reset --hard` sobre trabajo que no pertenece a la tarea.

---

# 87. Conventional Commits

Formato:

```text
tipo(alcance): descripción en español
```

Ejemplos:

```text
feat(actividades): agrega ABM de actividades

feat(billeteras): implementa transferencias

fix(gastos): corrige calculo del total

style(tema): mejora contraste oscuro

docs(base-datos): documenta movimientos de billetera

test(proyecto): agrega cobertura inicial
```

El tipo y el alcance siguen la convención habitual.

La descripción se escribe en español.

---

# 88. Archivos que nunca deben incluirse

No commitear:

```text
node_modules
dist
.env
.env.local
credenciales
tokens
keystores
builds temporales
archivos privados
APK
IPA
```

No exponer secretos en documentación, código, logs ni commits.

---

# 89. Push

No ejecutar automáticamente:

```bash
git push
git push --tags
```

La publicación remota requiere autorización explícita del usuario.

Completar una tarea o fusionarla localmente no implica autorización para publicar.

---

# 90. Versionado

Utilizar Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

No incrementar versión después de cada commit.

Consultar:

```text
docs/VERSIONADO.md
```

No crear tags automáticamente.

---

# 91. Preparación de release

La preparación de release queda fuera del plan visual vigente y requiere una tarea específica autorizada.

No realizarla automáticamente.

Cuando el usuario solicite explícitamente preparar una versión, seguir:

```text
docs/TAREAS_CODEX.md
docs/VERSIONADO.md
```

Antes de modificar la versión informar:

```text
Versión actual
Versión propuesta
Motivo
```

No crear tag ni hacer push sin autorización correspondiente.

---

# 92. Tests

Durante las tareas visuales, incluida la TAREA 86:

```text
NO crear tests
NO ejecutar tests
```

La creación y ejecución de tests requieren tareas específicas y autorización explícita. La TAREA 86 vigente ajusta Inicio; no autoriza tests.

---

# 93. No ejecutar tests automáticamente

No ejecutar:

```text
pnpm test
vitest
playwright
npm test
```

ni equivalentes solamente porque:

```text
se creó código
se creó un test
se completó una tarea
el usuario dijo "continúa"
```

Solo ejecutar tests cuando el usuario escriba explícitamente algo equivalente a:

```text
Ejecuta los tests.
```

y exista una tarea autorizada o una instrucción explícita que modifique el plan.

---

# 94. Tests — orden de ejecución

Cuando se autorice una tarea de ejecución de tests, ejecutar progresivamente:

```text
1. unitarios
2. componentes
3. persistencia
4. E2E
```

Si una etapa falla:

```text
detener progresión
analizar causa
corregir el problema real
repetir solamente lo necesario
```

No desactivar tests válidos para conseguir artificialmente una suite verde.

---

# 95. Uso eficiente de contexto

Codex debe:

```text
1. leer AGENTS.md;
2. leer solamente la documentación relacionada;
3. inspeccionar únicamente los archivos necesarios;
4. evitar recorrer todo el repositorio;
5. evitar mostrar archivos completos al finalizar;
6. no repetir especificaciones conocidas;
7. realizar una sola tarea;
8. revisar el diff;
9. hacer el commit;
10. entregar un resumen corto;
11. detenerse.
```

No utilizar contexto innecesario.

---

# 96. No sobreingeniería

No incorporar anticipadamente:

```text
microservicios
CQRS completo
event sourcing completo
colas cloud
servicios distribuidos
sincronización multiusuario
caches financieros complejos
```

sin una necesidad real.

`movimientos_billetera` funciona como libro de movimientos para trazabilidad financiera local.

Esto no implica adoptar una arquitectura completa de event sourcing.

---

# 97. Principio de trazabilidad

Toda variación patrimonial debe poder responder:

```text
¿Qué ocurrió?
¿Cuándo?
¿Cuánto?
¿En qué billetera?
¿Qué operación lo originó?
¿Qué detalle lo originó?
```

Por eso:

```text
movimientos_billetera
```

mantiene:

```text
referencia_tipo
referencia_id
```

Las relaciones históricas nunca deben reconstruirse mediante configuraciones actuales.

---

# 98. Principio de consistencia

Una operación financiera puede modificar varias estructuras.

Ejemplo:

```text
Ingreso
   ↓
ingresos
   ↓
ingresos_medios_pago
   ↓
movimientos_billetera
```

Todas esas escrituras forman una única operación lógica.

El sistema debe evitar estados donde solo una parte haya sido confirmada.

---

# 99. Principio de preservación histórica

Una modificación de configuración actual no debe cambiar el significado de una operación histórica.

Ejemplos:

```text
cambiar billetera predeterminada
renombrar categoría
desactivar actividad
desactivar medio
desactivar billetera
cambiar icono
cambiar color
```

Los registros históricos deben continuar siendo interpretables.

---

# 100. Principio de simplicidad de UI

Reducir pasos cuando no comprometa:

```text
integridad financiera
trazabilidad
selección de billetera real
validaciones
comprensión de la operación
```

No esconder una decisión financiera necesaria únicamente para conseguir menos toques.

---

# 101. Prioridad de reglas

Cuando existan varias fuentes de documentación, utilizar este criterio:

```text
1. Instrucción explícita actual del usuario
2. AGENTS.md
3. DECISIONES.md
4. MODELO_DATOS.md para reglas de persistencia
5. ARQUITECTURA.md para responsabilidades técnicas
6. PRODUCTO.md para comportamiento funcional
7. PANTALLAS.md para estructura de vistas
8. GUIA_VISUAL.md para reglas visuales
9. TAREAS_CODEX.md para alcance y orden de trabajo
10. documentos históricos de auditoría
```

Una tarea no debe utilizar un documento histórico para reemplazar una decisión vigente.

Si una contradicción material impide actuar correctamente, informarla.

---

# 102. Documentos de auditoría

Los documentos:

```text
AUDITORIA_ARQUITECTURA.md
NOMENCLATURA.md
DOCUMENTACION_CODIGO.md
REVISION_VISUAL.md
```

registran auditorías realizadas.

No deben considerarse automáticamente especificaciones superiores a los documentos normativos.

`REVISION_VISUAL.md` puede conservar información histórica de la TAREA 045 hasta que una revisión posterior lo actualice.

---

# 103. Alcance de una tarea

No aprovechar una tarea para corregir asuntos no relacionados.

Ejemplo:

una tarea visual no debe convertirse en:

```text
refactor de arquitectura
rediseño de base de datos
cambio general de nomenclatura
implementación de funcionalidades nuevas
```

salvo que el alcance de la tarea lo autorice expresamente.

Si aparece un problema fuera del alcance:

```text
informarlo
no mezclarlo silenciosamente
```

---

# 104. No modificar comportamiento innecesariamente

Durante:

```text
auditorías
documentación
ajustes visuales
refactors
```

preservar el comportamiento existente salvo que:

```text
el objetivo de la tarea requiera cambiarlo
o exista un defecto claro dentro del alcance
```

---

# 105. Validación estática

Cuando una tarea no autorice ejecutar tests, todavía pueden realizarse comprobaciones estáticas permitidas por su alcance.

Siempre revisar:

```bash
git diff
git diff --check
```

No interpretar una validación estática como autorización para ejecutar una suite de tests.

---

# 106. Final de cada tarea

Al finalizar informar:

```text
Tarea completada:
Cambios principales:
Archivos principales:
Rama:
Commit:
Hash:
Tests: no ejecutados.
```

Si los tests fueron ejecutados con autorización explícita, informar el resultado real en lugar de:

```text
Tests: no ejecutados.
```

Después detenerse.

No ejecutar automáticamente la siguiente tarea.

---

# 107. Estado actual del plan

El estado vigente del proyecto es:

```text
TAREAS 00–66
→ completadas

TAREAS 67–85
→ nueva composición visual según referencias; completadas el 03/10/2026
→ revisión y límites en docs/REVISION_VISUAL.md

TAREA 86
→ ajuste adicional de Inicio a la referencia visual; completada el 03/10/2026
→ comparación, comprobaciones y límites en docs/REVISION_VISUAL.md
→ sustituye la planificación anterior de la TAREA 89 por decisión del usuario

TAREA 87
→ refinamiento visual de Nuevo ingreso autorizado y completado el 03/10/2026
→ alcance y límites en docs/TAREAS_CODEX.md y docs/REVISION_VISUAL.md
```

La actualización del usuario del 03/10/2026 asigna la TAREA 86 al ajuste de Inicio y retira las tareas numeradas de tests y release del plan vigente. Su eventual incorporación requiere planificación y autorización específicas.

El detalle de cada tarea se encuentra en:

```text
docs/TAREAS_CODEX.md
```

No asumir que una tarea futura está autorizada solamente porque la tarea anterior terminó.
