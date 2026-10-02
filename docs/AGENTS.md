# AppBilletera — Reglas permanentes para Codex

## 1. Objetivo

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

- rapidez de carga;
- funcionamiento offline;
- trazabilidad;
- simplicidad;
- uso desde celular;
- escalabilidad futura.

---

# 2. Plataformas objetivo

AppBilletera debe funcionar desde una única base de código en:

- Web;
- PWA;
- Android;
- iOS;
- iPadOS.

No crear aplicaciones separadas por plataforma.

La lógica de negocio y las pantallas deben ser compartidas.

Las diferencias específicas de plataforma deben encapsularse detrás de adaptadores.

---

# 3. Stack

Utilizar:

- React;
- TypeScript;
- Vite;
- Material UI;
- Material Icons;
- Capacitor;
- pnpm.

Persistencia:

Web:
- IndexedDB.

Android:
- SQLite.

iOS/iPadOS:
- SQLite.

No implementar backend en la primera versión.

---

# 4. Package manager

Utilizar exclusivamente:

pnpm

Mantener:

pnpm-lock.yaml

No generar:

package-lock.json
yarn.lock

Agregar en package.json:

```json
{
  "packageManager": "pnpm@..."
}
```

usando la versión estable seleccionada para el proyecto.

---

# 5. Idioma obligatorio

Todo lo desarrollado específicamente para AppBilletera debe estar en español.

Esto incluye:

- carpetas;
- archivos;
- componentes;
- interfaces;
- tipos;
- clases;
- servicios;
- repositorios;
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

No traducir nombres que pertenecen a tecnologías externas.

Mantener:

```ts
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

También se pueden mantener términos técnicos cuando traducirlos reduzca claridad:

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

# 7. Nomenclatura TypeScript

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

El prefijo `use` se mantiene porque pertenece a la convención de React.

---

# 8. Nomenclatura SQL

Toda la base de datos propia utiliza:

- español;
- snake_case.

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

# 9. Claves primarias

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

---

# 10. UUID

El campo:

```text
id
```

de las entidades principales contiene un UUID generado localmente.

No utilizar IDs autoincrementales como identidad principal.

No crear simultáneamente:

```text
id
uuid
```

El UUID es directamente el `id`.

Utilizar cuando sea compatible:

```ts
crypto.randomUUID()
```

La finalidad es que un registro pueda crearse offline y conservar exactamente la misma identidad cuando posteriormente se sincronice con cloud.

---

# 11. Claves foráneas

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

Ejemplo:

```text
actividades.id
      ↑
ingresos.actividad_id
```

---

# 12. Auditoría temporal

Utilizar cuando corresponda:

```text
creado_en
actualizado_en
eliminado_en
```

Las fechas deben tener un formato consistente y documentado.

---

# 13. Borrado lógico

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

Ejemplo:

una categoría eliminada no debe aparecer para crear nuevos gastos, pero debe seguir mostrándose correctamente en gastos históricos.

---

# 14. Dinero

Nunca persistir dinero utilizando float.

Guardar importes como enteros en unidades monetarias menores.

Ejemplo:

```text
importe_centavos
```

Para:

```text
$1.500,25
```

guardar:

```text
150025
```

Moneda inicial:

```text
ARS
```

La arquitectura no debe impedir agregar otras monedas posteriormente.

---

# 15. Arquitectura

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

- ejecutar SQL;
- acceder directamente a IndexedDB;
- acceder directamente a SQLite.

---

# 16. Persistencia multiplataforma

Las capas superiores no deben saber qué motor está utilizando la aplicación.

Conceptualmente:

```text
RepositorioIngresos
       │
       ├── Web → IndexedDB
       │
       └── Nativo → SQLite
```

Lo mismo para:

- gastos;
- actividades;
- billeteras;
- catálogos;
- reportes.

---

# 17. Local-first

La primera versión funciona completamente offline.

El usuario debe poder:

- crear;
- editar;
- consultar;
- transferir;
- conciliar;
- generar reportes;

sin conexión.

Preparar el modelo para futura sincronización cloud, pero no implementar sincronización todavía.

---

# 18. Futuro cloud

En el futuro la arquitectura podrá ser:

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

No sobreingenierizar V1.

Los UUID ya dejan preparado el modelo.

---

# 19. Actividades

Una actividad representa una fuente de generación de ingresos.

Ejemplos:

- DiDi;
- Uber;
- fotografía;
- programación;
- ventas;
- pintura;
- trabajo temporal;
- trabajo fijo;
- servicio.

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

# 20. Trabajos temporales

Una actividad puede representar un trabajo temporal.

Ejemplo:

```text
Pintura departamento
```

Puede tener:

- fecha_inicio;
- fecha_fin;
- múltiples ingresos;
- múltiples gastos;
- rentabilidad propia.

Estados iniciales:

```text
activo
finalizado
archivado
```

---

# 21. Iconos

Cada actividad puede tener:

```text
icono
color
```

Utilizar Material Icons.

No guardar SVG completos en la base.

Guardar solamente un identificador del icono.

Debe existir un selector visual con:

- búsqueda;
- vista previa;
- selección;
- cambio de icono.

---

# 22. Catálogos

Los catálogos se administran exclusivamente desde:

```text
Ajustes
```

ABM requeridos:

- Actividades.
- Categorías de gastos.
- Medios de pago.
- Billeteras.

Los formularios de ingreso/gasto no deben crear ni editar estos catálogos.

Solamente deben consumirlos.

---

# 23. Medios de pago

Ejemplos iniciales:

```text
Efectivo
Transferencia
Tarjeta
```

Son registros normales.

No hardcodearlos como lógica de negocio.

Cada medio podrá tener:

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

# 24. Carga rápida de ingresos y gastos

La prioridad principal de UX es cargar movimientos con la menor cantidad posible de pasos.

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

No obligar al usuario a agregar cada medio manualmente.

---

# 25. Campos vacíos

Si un campo rápido queda vacío:

```text
Efectivo        35000
Transferencia
Tarjeta         15000
```

la UI debe tratar el vacío como:

```text
0
```

para el cálculo.

Sin embargo, no crear necesariamente un detalle persistido con importe 0.

Persistir solamente detalles con:

```text
importe_centavos > 0
```

salvo que exista una razón funcional documentada.

No permitir guardar un ingreso o gasto cuyo total final sea 0.

---

# 26. Recordar últimos valores utilizados

Para agilizar la carga, recordar localmente:

```text
ultima_actividad_ingreso
ultima_actividad_gasto
ultima_categoria_gasto
```

y cualquier otra preferencia útil aprobada.

Puede utilizarse:

```text
localStorage
```

para preferencias de interfaz.

No confundir estas preferencias con datos financieros.

---

# 27. Nuevo ingreso

Debe permitir:

```text
Actividad
Fecha
Descripción opcional
Observaciones opcionales
```

y medios de cobro visibles.

Ejemplo:

```text
Actividad: DiDi

Efectivo       $35.000
Transferencia  $20.000
Tarjeta        $0

TOTAL          $55.000
```

La última actividad utilizada debe venir precargada.

---

# 28. Nuevo gasto

Debe permitir:

```text
Categoría
Actividad opcional
Fecha
Descripción
Observaciones opcionales
```

y medios de pago visibles.

Ejemplo:

```text
Categoría: Combustible
Actividad: DiDi

Efectivo       $20.000
Transferencia  $0
Tarjeta        $30.000

TOTAL          $50.000
```

Precargar:

- última categoría utilizada;
- última actividad utilizada.

---

# 29. Ingresos

No crear columnas:

```text
efectivo
transferencia
tarjeta
```

en la tabla ingresos.

Utilizar:

```text
ingresos
ingresos_medios_pago
```

Un ingreso puede tener múltiples detalles.

---

# 30. Gastos

Utilizar:

```text
gastos
gastos_medios_pago
```

Un gasto puede tener múltiples medios de pago.

Un gasto puede asociarse opcionalmente a una actividad.

---

# 31. Billeteras

Las billeteras representan dónde está el dinero.

Ejemplos:

```text
Efectivo
Mercado Pago
Banco Galicia
Cuenta DNI
Ualá
```

No confundir:

```text
Medio de pago
```

con:

```text
Billetera
```

Ejemplo:

```text
Medio: Transferencia
Billetera: Banco Galicia
```

---

# 32. Modelo de billetera

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

El saldo no debe poder editarse directamente desde el ABM.

---

# 33. Saldo inicial

Al crear una billetera debe poder definirse:

```text
saldo inicial
fecha del saldo inicial
```

No guardar simplemente el número como saldo histórico.

Crear un movimiento de tipo:

```text
SALDO_INICIAL
```

---

# 34. Movimientos de billetera

La fuente de verdad del saldo será:

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

# 35. Impacto de ingresos y gastos

Un ingreso genera movimientos positivos sobre las billeteras correspondientes.

Un gasto genera movimientos negativos.

Ejemplo:

```text
Ingreso DiDi:

Efectivo       +35000
Galicia        +20000
```

---

# 36. Transferencias entre billeteras

Una transferencia no es:

- ingreso;
- gasto.

Ejemplo:

```text
Efectivo → Banco Galicia
$100.000
```

Debe generar:

```text
Efectivo       -100000
Banco Galicia  +100000
```

El patrimonio total no cambia.

---

# 37. Tabla de transferencias

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

---

# 38. Conciliación de billetera

No permitir editar directamente:

```text
saldo = ...
```

Debe existir la acción:

```text
Conciliar / Ajustar saldo
```

Ejemplo:

```text
Saldo calculado: $65.000
Saldo real:      $50.000
Diferencia:     -$15.000
```

La aplicación debe ofrecer:

```text
Registrar gasto faltante
Ajustar diferencia
```

---

# 39. Ajustes

Si se confirma una diferencia, generar un movimiento:

```text
AJUSTE_POSITIVO
```

o:

```text
AJUSTE_NEGATIVO
```

Los ajustes no se consideran automáticamente ingresos ni gastos.

Deben mostrarse por separado en reportes cuando corresponda.

---

# 40. Última conciliación

Guardar cuando sea útil:

```text
conciliado_en
```

o registro equivalente.

Mostrar:

```text
Última conciliación
02/10/2026 18:32
```

---

# 41. Saldo de billeteras

No calcular saldos cargando todos los registros en JavaScript.

Prohibido utilizar como estrategia principal:

```ts
obtenerTodosLosMovimientos()
  .filter(...)
  .reduce(...)
```

Las agregaciones deben resolverse en la capa de persistencia.

---

# 42. Índices mínimos

Crear índices apropiados.

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

Agregar otros índices solamente si existe una necesidad comprobable.

---

# 43. Saldo actual

Se puede mantener:

```text
saldo_actual_centavos
```

como cache optimizada si la arquitectura lo justifica.

La fuente de verdad debe continuar siendo:

```text
movimientos_billetera
```

Cualquier cache debe poder reconstruirse.

---

# 44. Saldos históricos

La arquitectura debe permitir consultar saldos históricos sin recorrer toda la historia innecesariamente.

Diseñar la posibilidad de:

```text
saldos_billetera_periodo
```

para cierres periódicos.

No sobreimplementar si todavía no es necesario.

Documentar la estrategia desde V1.

---

# 45. Reportes

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

Las transferencias internas no afectan ganancia.

---

# 46. Rentabilidad por actividad

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

---

# 47. Pantalla Inicio

La pantalla principal debe priorizar:

```text
Ganancia de hoy
Ingresos
Gastos
Billeteras
Últimos movimientos
```

Ingresos y Gastos deben tener cada uno su botón:

```text
+ Agregar ingreso
+ Agregar gasto
```

No obligar al usuario a abrir un menú intermedio.

---

# 48. Inicio — Billeteras

Mostrar resumen breve:

```text
Mi dinero

Efectivo       $250.000
Mercado Pago   $120.000
Galicia        $320.000
```

Agregar acciones:

```text
Transferir
Ver todas
```

---

# 49. Últimos movimientos

La pantalla principal puede mostrar:

```text
Ingreso DiDi           +$35.000
Gasto Combustible      -$20.000
Efectivo → Galicia    $100.000
Ajuste caja            -$15.000
```

Diferenciar visualmente tipos de movimiento.

---

# 50. Navegación móvil

Navegación inferior principal:

```text
Inicio
Ingresos
Gastos
Reportes
```

Ajustes desde:

- AppBar;
- menú.

Billeteras pueden ser accesibles desde Inicio y/o Ajustes según UX final.

---

# 51. Navegación desktop

En pantallas amplias adaptar a:

- Navigation Drawer;
- sidebar;
- navegación equivalente.

No duplicar pantallas.

---

# 52. Material UI

Utilizar Material UI como sistema visual principal.

Buscar una estética moderna inspirada en Android.

Utilizar:

- cards;
- AppBar;
- BottomNavigation;
- Dialog;
- Drawer;
- TextField;
- Select;
- Chip;
- Snackbar;
- Tabs;
- Switch;
- IconButton;
- Skeleton;
- botones grandes;
- superficies diferenciadas.

---

# 53. Modo oscuro

REQUISITO OBLIGATORIO.

AppBilletera debe soportar desde el inicio:

```text
Sistema
Claro
Oscuro
```

Predeterminado:

```text
Sistema
```

Guardar preferencia con:

```text
localStorage
```

Utilizar ThemeProvider de Material UI.

No hardcodear colores directamente en componentes.

Todos los componentes deben funcionar correctamente tanto en claro como oscuro.

---

# 54. Tema oscuro

No utilizar simplemente negro puro para todo.

Definir:

- fondo general oscuro;
- superficies diferenciadas;
- cards con elevación visual;
- contraste apropiado;
- estados positivos;
- estados negativos;
- color primario;
- texto principal;
- texto secundario.

Mantener accesibilidad.

---

# 55. Diseño mobile-first

Diseñar primero para celular.

Priorizar:

- pocos toques;
- botones grandes;
- formularios rápidos;
- inputs numéricos cómodos;
- acciones claras;
- información resumida.

Después adaptar a tablet y desktop.

---

# 56. Accesibilidad

Utilizar:

- labels;
- aria cuando corresponda;
- buen contraste;
- foco visible;
- tamaños táctiles adecuados;
- mensajes de error comprensibles.

---

# 57. PWA

La versión Web debe funcionar también como PWA instalable.

Debe existir:

- manifest;
- iconos;
- metadatos;
- soporte de instalación.

No impedir uso como Web tradicional.

---

# 58. Respaldo

Implementar:

- Exportar respaldo.
- Importar respaldo.

Formato JSON versionado.

Campos mínimos:

```text
version_formato
version_aplicacion
exportado_en
datos
```

---

# 59. Importación

Antes de importar:

- validar formato;
- validar versión;
- validar integridad.

La importación debe ser transaccional.

Si falla:

```text
ROLLBACK
```

No dejar datos parcialmente importados.

---

# 60. Migraciones

La base debe tener versionado de schema.

Ejemplo:

```text
v1
v2
v3
```

Nunca depender de borrar la aplicación para actualizar la base.

---

# 61. Comentarios obligatorios

Todas las funciones propias deben tener JSDoc en español.

Debe explicar como mínimo:

- qué hace;
- para qué sirve.

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

# 62. Comentarios adicionales

Documentar especialmente:

- reglas financieras;
- transacciones;
- conciliaciones;
- saldos;
- movimientos;
- soft delete;
- migraciones;
- caches;
- decisiones no evidentes.

No llenar el código de comentarios redundantes línea por línea.

---

# 63. Comentarios de tablas

Cada tabla debe tener un comentario en el archivo de migración explicando:

- qué almacena;
- para qué sirve;
- relaciones principales.

Ejemplo:

```ts
/**
 * Tabla: movimientos_billetera
 *
 * Registra todas las entradas y salidas que modifican el saldo
 * de una billetera y constituye la fuente de verdad para reconstruir saldos.
 */
```

---

# 64. Comentarios de campos especiales

Documentar campos como:

```text
importe_centavos
eliminado_en
saldo_actual_centavos
referencia_tipo
referencia_id
```

cuando su función no sea evidente.

---

# 65. Git

Cada tarea debe comenzar en su propia rama antes de modificar archivos y terminar con su propio commit.

Nombre obligatorio: `NNN_descripcion_de_la_tarea`, donde `NNN` es el número de tarea con tres dígitos y ceros a la izquierda. La descripción resume el título de la tarea en español, en minúsculas, sin tildes ni espacios y con palabras separadas por guiones bajos. No agregar el prefijo `codex/`.

Ejemplos: TAREA 00 → `000_crear_repositorio_y_documentacion`; TAREA 01 (001) → `001_crear_react_typescript_y_vite`; TAREA 10 → `010_disenar_base_de_datos_v1`.

Después de leer las reglas y la documentación relacionada, revisar `git status` y crear la rama con `git switch -c NNN_descripcion_de_la_tarea`. Verificar la rama activa antes de modificar archivos. Si ya existe por una ejecución anterior de la misma tarea, comprobar su correspondencia y continuar en ella sin borrarla ni recrearla.

No realizar tareas directamente en `main` o `master`. No mezclar cambios de otras tareas ni fusionar ramas automáticamente. Crear la rama de la tarea siguiente solamente cuando el usuario autorice esa tarea.

Antes:

```bash
git status
git diff
```

No mezclar tareas diferentes.

---

# 66. Conventional Commits

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
```

---

# 67. Archivos que nunca deben incluirse

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
```

---

# 68. Versionado

Utilizar Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

No incrementar versión después de cada commit.

Consultar `docs/VERSIONADO.md`.

---

# 69. Tests

IMPORTANTE.

Durante el desarrollo funcional inicial:

- NO crear tests.
- NO ejecutar tests.

Los tests se crearán solamente en la fase final indicada en el plan.

Incluso una vez generados:

NO EJECUTARLOS sin autorización explícita del usuario.

---

# 70. No ejecutar tests automáticamente

No ejecutar:

```text
pnpm test
vitest
playwright
npm test
```

ni equivalentes.

Solo hacerlo cuando el usuario escriba explícitamente algo equivalente a:

```text
Ejecuta los tests.
```

---

# 71. Uso eficiente de tokens

Codex debe:

1. leer AGENTS.md;
2. leer solamente documentación relacionada con la tarea;
3. inspeccionar únicamente los archivos necesarios;
4. evitar recorrer todo el repositorio;
5. evitar mostrar archivos completos al finalizar;
6. no repetir especificaciones conocidas;
7. realizar una sola tarea;
8. hacer el commit;
9. entregar resumen corto;
10. detenerse.

---

# 72. Final de cada tarea

Informar:

```text
Tarea completada:
Cambios principales:
Archivos principales:
Rama:
Commit:
Hash:
Tests: no ejecutados.
```

Después detenerse.

No ejecutar automáticamente la siguiente tarea.