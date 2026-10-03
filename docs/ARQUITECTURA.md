# Arquitectura

Este documento describe la arquitectura vigente de AppBilletera y las reglas que deben respetarse al incorporar nuevas funcionalidades.

AppBilletera utiliza una arquitectura local-first, multiplataforma y orientada a mantener separadas:

- presentación;
- composición de aplicación;
- lógica de negocio;
- dominio;
- contratos;
- persistencia;
- detalles específicos de plataforma.

La aplicación debe poder funcionar completamente offline y compartir la mayor cantidad posible de código entre Web, PWA, Android, iOS e iPadOS.

---

# 1. Principio general

La dirección principal de dependencias es:

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

Las capas superiores no deben conocer detalles internos del motor de persistencia.

La interfaz no debe acceder directamente a:

```text
IndexedDB
SQLite
SQL
```

La lógica financiera tampoco debe implementarse dentro de componentes React.

---

# 2. Tecnologías

La aplicación utiliza:

```text
React
TypeScript
Vite
Material UI
Material Icons
Capacitor
pnpm
```

Persistencia prevista:

```text
Web / PWA
→ IndexedDB

Android
→ SQLite

iOS / iPadOS
→ SQLite
```

El backend cloud no forma parte de la primera versión.

La arquitectura debe permitir incorporarlo posteriormente sin reemplazar el dominio local.

---

# 3. Estructura principal

Las carpetas arquitectónicas utilizan nombres técnicos convencionales en inglés.

La funcionalidad propia y el dominio permanecen en español.

Estructura principal:

```text
src/
├── app/
├── core/
├── database/
├── modules/
├── shared/
└── principal.tsx
```

Responsabilidades:

```text
app
→ composición de aplicación, navegación, tema,
  preferencias y exposición de dependencias.

core
→ dominio, contratos, lógica financiera y servicios.

database
→ infraestructura de persistencia, migraciones,
  adaptadores y repositorios físicos.

modules
→ pantallas organizadas por funcionalidad.

shared
→ componentes y utilidades reutilizables.
```

Esta convención permite que un desarrollador externo reconozca rápidamente la arquitectura sin perder la nomenclatura funcional en español.

---

# 4. Convención de idioma

Las carpetas técnicas pueden mantenerse en inglés.

Ejemplos:

```text
app
core
database
modules
shared

data
navigation
preferences
theme

entities
money
repositories
services

adapters
contracts
migrations
web

components
dates
```

Los conceptos propios del negocio permanecen en español.

Ejemplos:

```text
Actividad
Ingreso
Gasto
Billetera
CategoriaGasto
MedioPago
MovimientoBilletera
TransferenciaBilletera

ServicioIngresos
RepositorioBilleteras

PaginaInicio
FormularioIngreso

crearIngreso()
obtenerSaldoBilletera()
```

Ejemplo correcto:

```text
src/
└── modules/
    └── billeteras/
        ├── PaginaBilleteras.tsx
        ├── PaginaDetalleBilletera.tsx
        └── PaginaTransferencia.tsx
```

---

# 5. Capa `app`

La carpeta:

```text
src/app/
```

contiene la composición global de la aplicación.

Actualmente se organiza conceptualmente en:

```text
app/
├── Aplicacion.tsx
├── data/
├── navigation/
├── preferences/
└── theme/
```

Esta capa puede conocer:

- servicios;
- repositorios;
- proveedores React;
- configuración global;
- navegación;
- preferencias de interfaz.

No debe concentrar lógica financiera que pertenezca al dominio.

---

# 6. Composición de dependencias

La carpeta:

```text
src/app/data/
```

sirve principalmente para:

- construir servicios;
- seleccionar implementaciones de repositorios;
- inyectar dependencias;
- exponerlas a React;
- adaptar resultados para la aplicación cuando sea necesario.

Ejemplo conceptual:

```text
RepositorioIngresosWeb
        ↓
ServicioIngresos
        ↓
ProveedorDatos
        ↓
PaginaIngresos
```

La lógica de negocio no debe duplicarse entre:

```text
src/app/data/
```

y:

```text
src/core/services/
```

Una función como:

```text
servicioIngresos.ts
```

dentro de `app/data` puede encargarse de obtener o construir la instancia correcta.

La lógica real de ingreso debe permanecer en:

```text
core/services/ServicioIngresos.ts
```

o en otros elementos apropiados del dominio.

---

# 7. `ProveedorDatos`

`ProveedorDatos.tsx` puede actuar como punto de exposición de dependencias para React.

Su responsabilidad debe limitarse principalmente a:

- composición;
- inyección;
- disponibilidad de servicios;
- ciclo de vida de dependencias.

No debe transformarse en un objeto que contenga simultáneamente:

- todas las consultas;
- todas las mutaciones;
- toda la lógica financiera;
- toda la persistencia;
- todo el estado de aplicación.

Cuando una responsabilidad pueda vivir en un servicio específico, debe permanecer en ese servicio.

---

# 8. Capa `core`

La carpeta:

```text
src/core/
```

contiene el núcleo funcional de AppBilletera.

Estructura conceptual:

```text
core/
├── entities/
├── money/
├── repositories/
└── services/
```

No debe depender de React.

No debe acceder directamente a IndexedDB.

No debe acceder directamente a SQLite.

No debe depender de componentes visuales.

---

# 9. Entidades

Las entidades viven en:

```text
src/core/entities/
```

Ejemplos:

```text
Actividad
AjusteBilletera
Billetera
CategoriaGasto
DetalleGastoMedioPago
DetalleIngresoMedioPago
Gasto
Ingreso
MedioPago
MovimientoBilletera
TransferenciaBilletera
```

Las entidades representan conceptos del dominio.

Deben conservar las reglas estructurales necesarias para que los servicios puedan trabajar sin conocer el motor de persistencia.

---

# 10. Dominio monetario

La lógica relacionada con dinero vive principalmente en:

```text
src/core/money/
```

Ejemplos:

```text
Importe.ts
interpretarImporte.ts
calcularCargaRapida.ts
```

Esta capa debe centralizar:

- conversión segura;
- validaciones monetarias;
- interpretación de importes;
- suma de carga rápida;
- prevención de errores de precisión.

Nunca utilizar `float` como representación persistente del dinero.

La unidad persistida es:

```text
centavos
```

mediante enteros.

---

# 11. Contratos de repositorios

Los contratos viven en:

```text
src/core/repositories/
```

Ejemplos:

```text
RepositorioActividades
RepositorioBilleteras
RepositorioCategoriasGasto
RepositorioGastos
RepositorioIngresos
RepositorioMediosPago
RepositorioMovimientosBilletera
RepositorioSaldoInicial
RepositorioTransferencias
```

Los contratos deben:

- ser independientes de React;
- ser independientes de IndexedDB;
- ser independientes de SQLite;
- exponer comportamiento funcional;
- utilizar tipos del dominio.

Los servicios deben programar contra estos contratos y no contra implementaciones concretas.

---

# 12. Servicios

La lógica de aplicación y negocio vive principalmente en:

```text
src/core/services/
```

Ejemplos:

```text
ServicioIngresos
ServicioGastos
ServicioTransferencias
ServicioSaldoInicial
ServicioConsultaBilleteras
ServicioDetalleBilletera
ServicioCatalogo
```

Los servicios coordinan:

- validaciones;
- repositorios;
- transacciones lógicas;
- reglas financieras;
- generación de movimientos;
- consistencia entre entidades.

Los componentes React deben delegar estas responsabilidades.

---

# 13. Presentación

Los módulos funcionales viven en:

```text
src/modules/
```

Ejemplo:

```text
modules/
├── ajustes/
├── billeteras/
├── gastos/
├── ingresos/
├── inicio/
└── reportes/
```

La presentación puede:

- capturar eventos;
- administrar estado temporal de formularios;
- mostrar validaciones;
- invocar servicios;
- mostrar resultados;
- controlar navegación.

No debe:

- ejecutar consultas IndexedDB;
- ejecutar SQL;
- reconstruir saldos completos;
- crear movimientos financieros directamente;
- decidir reglas de negocio complejas.

---

# 14. Componentes compartidos

Los componentes reutilizables viven en:

```text
src/shared/components/
```

Ejemplos actuales:

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

Estos componentes deben:

- recibir información mediante props;
- emitir eventos;
- utilizar el tema;
- ser reutilizables;
- mantenerse independientes de la persistencia.

No deben conocer IndexedDB ni SQLite.

---

# 15. Sistema visual

Material UI es el sistema visual principal.

La configuración global vive en:

```text
src/app/theme/
```

Ejemplos:

```text
colores.ts
componentes.ts
ContextoTema.ts
ProveedorTema.tsx
SelectorModoTema.tsx
tema.ts
tipografia.ts
useTema.ts
```

Centralizar aquí, cuando corresponda:

- paletas;
- colores semánticos;
- tipografía;
- radios;
- sombras;
- overrides de Material UI;
- comportamiento claro/oscuro.

No hardcodear colores repetidamente dentro de componentes.

---

# 16. Modo claro y oscuro

La aplicación soporta:

```text
Sistema
Claro
Oscuro
```

El valor predeterminado es:

```text
Sistema
```

La preferencia puede mantenerse en:

```text
localStorage
```

porque es una preferencia de interfaz y no un dato financiero.

La aplicación debe utilizar:

```text
ThemeProvider
```

de Material UI.

Todos los componentes deben funcionar correctamente tanto en claro como oscuro.

---

# 17. Documentación visual

Las tareas relacionadas con UI deben utilizar como referencia:

```text
docs/GUIA_VISUAL.md
docs/PANTALLAS.md
```

`GUIA_VISUAL.md` define:

- dimensiones;
- espaciados;
- radios;
- sombras;
- colores;
- tipografía;
- responsive;
- tema claro;
- tema oscuro.

`PANTALLAS.md` define:

- contenido;
- jerarquía;
- relaciones;
- acciones;
- comportamiento de cada pantalla.

La arquitectura visual debe reutilizar tokens y componentes compartidos en lugar de crear estilos aislados pantalla por pantalla.

---

# 18. Navegación

La navegación vive en:

```text
src/app/navigation/
```

Actualmente puede incluir elementos como:

```text
EstructuraPrincipal.tsx
usePaginaActual.ts
useParametroRuta.ts
```

La navegación debe adaptarse al tamaño disponible.

En móvil:

```text
BottomNavigation
```

o navegación equivalente.

En pantallas amplias:

```text
Drawer
Sidebar
```

No crear una aplicación diferente para desktop.

Las mismas pantallas deben adaptarse mediante responsive design.

---

# 19. Preferencias de interfaz

Las preferencias UI viven conceptualmente en:

```text
src/app/preferences/
```

Ejemplo:

```text
ServicioPreferenciasUI.ts
```

Pueden almacenarse en:

```text
localStorage
```

preferencias como:

```text
modo de tema
ultima_actividad_ingreso
ultima_actividad_gasto
ultima_categoria_gasto
```

No guardar allí:

- ingresos;
- gastos;
- movimientos;
- saldos;
- transferencias;
- datos financieros.

---

# 20. Persistencia

La infraestructura vive en:

```text
src/database/
```

Conceptualmente:

```text
database/
├── adapters/
├── contracts/
├── data/
├── migrations/
└── web/
```

Su responsabilidad es:

- abrir la base;
- aplicar migraciones;
- manejar transacciones;
- implementar repositorios;
- resolver consultas eficientes;
- mantener integridad física;
- adaptar cada plataforma.

---

# 21. Base local

La coordinación general se realiza mediante:

```text
src/database/BaseLocal.ts
```

y el contrato:

```text
src/database/contracts/AdaptadorBaseLocal.ts
```

La aplicación no debe depender de la implementación concreta.

Conceptualmente:

```text
BaseLocal
   │
   ├── Web
   │    ↓
   │ IndexedDB
   │
   └── Nativo
        ↓
      SQLite
```

La interfaz debe recibir servicios ya configurados y nunca seleccionar motores de base directamente.

---

# 22. Persistencia Web

La implementación Web utiliza IndexedDB.

Los elementos específicos viven principalmente en:

```text
src/database/web/
```

Ejemplos:

```text
AdaptadorIndexedDB.ts
baseWeb.ts
consultasSaldoWeb.ts
consultasWeb.ts
ContextoWeb.ts
invalidarRegistros.ts
RepositorioCatalogoWeb.ts
RepositorioConsultaBilleterasWeb.ts
RepositorioDetalleBilleteraWeb.ts
RepositorioGastosWeb.ts
RepositorioIngresosWeb.ts
RepositorioSaldoInicialWeb.ts
RepositorioTransferenciasWeb.ts
```

Los repositorios Web deben respetar los contratos de `core`.

---

# 23. Transacciones Web

Las operaciones financieras relacionadas deben ejecutarse dentro de una misma operación atómica de IndexedDB cuando corresponda.

Ejemplo:

```text
Ingreso
+
Detalles
+
Movimientos
```

deben confirmarse juntos.

No debe quedar:

```text
Ingreso guardado
+
Movimiento faltante
```

ni:

```text
Movimiento guardado
+
Ingreso inexistente
```

Las transacciones deben resolver solamente después de su confirmación efectiva.

---

# 24. Persistencia nativa

La arquitectura contempla SQLite para:

```text
Android
iOS
iPadOS
```

Las diferencias específicas deben permanecer encapsuladas detrás de los contratos y adaptadores de base local.

Las capas:

```text
modules
app
core
```

no deben saber si los datos provienen de IndexedDB o SQLite.

La implementación nativa debe mantener las mismas reglas funcionales e invariantes que la implementación Web.

---

# 25. Igualdad funcional entre motores

IndexedDB y SQLite pueden requerir implementaciones técnicas distintas.

Sin embargo, deben ofrecer el mismo comportamiento funcional.

Ejemplo:

si una operación inválida es rechazada en SQLite, no debe permitirse silenciosamente en IndexedDB si viola una regla del dominio.

Las reglas principales deben protegerse primero en:

```text
core/services
```

y reforzarse en persistencia cuando sea posible.

---

# 26. Migraciones

Las migraciones viven en:

```text
src/database/migrations/
```

Ejemplos:

```text
EsquemaBaseDatos.ts
v1.ts
indicesV1.ts
```

La base debe evolucionar mediante versiones:

```text
v1
v2
v3
...
```

No depender de borrar la base o reinstalar la aplicación para actualizar.

Una migración ya distribuida no debe modificarse de forma incompatible.

Los cambios posteriores deben agregarse mediante nuevas migraciones.

---

# 27. Datos iniciales

Los datos sugeridos viven conceptualmente en:

```text
src/database/data/
```

Ejemplos:

```text
datosIniciales.ts
prepararDatosIniciales.ts
```

Los datos iniciales deben insertarse solamente cuando corresponda.

No deben reaparecer automáticamente si el usuario:

- los renombra;
- los desactiva;
- los modifica.

Los seeds son sugerencias iniciales, no lógica hardcodeada permanente.

---

# 28. Catálogos

Los principales catálogos son:

```text
Actividades
Categorías de gastos
Medios de pago
Billeteras
```

Se administran desde:

```text
Ajustes
```

Los formularios de ingreso y gasto solamente los consumen.

No deben crear catálogos silenciosamente.

Los registros desactivados conservan su participación histórica.

---

# 29. Actividades

`Actividad` representa una fuente de ingreso, trabajo o proyecto.

Puede representar:

```text
DiDi
Uber
Fotografía
Programación
Pintura departamento
Trabajo temporal
Servicio
```

Los trabajos temporales utilizan la misma entidad.

No crear una segunda estructura si `Actividad` ya representa correctamente el concepto.

---

# 30. Medios de pago y billeteras

Mantener siempre la separación:

```text
Medio de pago
→ cómo se realizó la operación.
```

```text
Billetera
→ dónde está o salió el dinero.
```

Ejemplo:

```text
Medio:
Transferencia

Billetera:
Banco Galicia
```

No tratarlos como el mismo concepto.

---

# 31. Billetera predeterminada

Un medio puede definir:

```text
billetera_predeterminada_id
```

Su finalidad es únicamente ayudar a precargar nuevas operaciones.

Ejemplo:

```text
Transferencia
→ Banco Galicia
```

Esto significa:

```text
Sugerir Banco Galicia
```

al registrar una nueva transferencia/cobro/pago compatible.

No significa que todos los registros históricos que utilicen ese medio pertenezcan a esa billetera.

---

# 32. Billetera histórica

Todo detalle monetario de ingreso o gasto debe guardar la billetera realmente utilizada.

Conceptualmente:

```text
ingresos_medios_pago
├── ingreso_id
├── medio_pago_id
├── billetera_id
└── importe_centavos
```

y:

```text
gastos_medios_pago
├── gasto_id
├── medio_pago_id
├── billetera_id
└── importe_centavos
```

La relación histórica:

```text
detalle.billetera_id
```

tiene prioridad sobre:

```text
medio_pago.billetera_predeterminada_id
```

para interpretar una operación ya realizada.

Cambiar una configuración futura nunca debe reinterpretar el historial.

---

# 33. Carga rápida

La interfaz de ingresos y gastos prioriza la velocidad.

Los medios con:

```text
mostrar_en_carga_rapida = true
```

aparecen directamente.

Ejemplo:

```text
Efectivo        $ [        ]
Transferencia   $ [        ]
Tarjeta         $ [        ]
```

Los campos vacíos se interpretan como:

```text
0
```

para cálculos de interfaz.

No se persisten detalles de importe cero.

No se puede guardar una operación cuyo total sea cero.

---

# 34. Ingreso

Un ingreso contiene:

```text
cabecera
+
1..N detalles
```

Cada detalle define:

```text
medio de pago
billetera real
importe
```

Ejemplo:

```text
Ingreso DiDi
$55.000
```

Distribución:

```text
Efectivo
Billetera Efectivo
$35.000
```

```text
Transferencia
Banco Galicia
$20.000
```

Cada detalle válido genera su correspondiente impacto patrimonial.

---

# 35. Gasto

Un gasto contiene:

```text
cabecera
+
1..N detalles
```

Además posee:

```text
categoria_id
```

y opcionalmente:

```text
actividad_id
```

Cada detalle registra:

```text
medio de pago
billetera real
importe
```

y genera un movimiento negativo sobre la billetera correspondiente.

---

# 36. Movimientos de billetera

La fuente de verdad del saldo es:

```text
movimientos_billetera
```

Tipos principales:

```text
SALDO_INICIAL
INGRESO
GASTO
TRANSFERENCIA_ENTRADA
TRANSFERENCIA_SALIDA
AJUSTE_POSITIVO
AJUSTE_NEGATIVO
```

Convención:

```text
positivo
→ entrada

negativo
→ salida
```

No modificar directamente un saldo histórico para corregir diferencias.

---

# 37. Referencia de movimientos

Cada movimiento derivado debe poder explicar qué registro lo originó.

Para ingresos:

```text
referencia_tipo = INGRESO_MEDIO_PAGO
referencia_id   = detalle de ingreso
```

Para gastos:

```text
referencia_tipo = GASTO_MEDIO_PAGO
referencia_id   = detalle de gasto
```

Para transferencias:

```text
referencia_tipo = TRANSFERENCIA
referencia_id   = transferencia
```

Para ajustes:

```text
referencia_tipo = AJUSTE
referencia_id   = ajuste
```

Esto permite mantener trazabilidad precisa.

---

# 38. Idempotencia

Una operación financiera no debe producir dos veces el mismo impacto por un reintento accidental.

Ejemplo incorrecto:

```text
Detalle ingreso:
$35.000
```

genera:

```text
Movimiento +35.000
Movimiento +35.000
```

La persistencia debe impedirlo.

Identidad lógica recomendada:

```text
referencia_tipo
+
referencia_id
+
tipo
```

Conceptualmente:

```text
UNIQUE(
    referencia_tipo,
    referencia_id,
    tipo
)
```

cuando el motor permita implementar esta restricción directamente.

En otros casos, el repositorio debe mantener comportamiento equivalente.

---

# 39. Edición de operaciones

Editar una operación debe conservar:

```text
id de la cabecera
creado_en
```

cuando representa la misma operación lógica.

Los detalles pueden cambiar.

Cuando la estrategia actual invalida detalles anteriores y crea nuevos:

- los anteriores deben quedar históricamente invalidados;
- los movimientos derivados anteriores también;
- los nuevos detalles reciben nuevos UUID;
- los nuevos movimientos deben apuntar a los nuevos detalles.

Todo debe realizarse de forma atómica.

---

# 40. Borrado lógico de operaciones

Eliminar un ingreso o gasto no debe borrar físicamente su historia.

La operación y todos sus efectos deben invalidarse de forma consistente.

No permitir:

```text
Ingreso eliminado
+
Movimiento todavía activo
```

ni:

```text
Movimiento eliminado
+
Ingreso todavía activo
```

La operación lógica debe conservar coherencia.

---

# 41. Transferencias

Una transferencia mueve dinero entre dos billeteras.

Ejemplo:

```text
Efectivo
→ Banco Galicia

$100.000
```

Genera:

```text
TRANSFERENCIA_SALIDA
Efectivo
-100000
```

y:

```text
TRANSFERENCIA_ENTRADA
Banco Galicia
+100000
```

No crea:

```text
Ingreso
Gasto
```

El patrimonio total permanece igual.

---

# 42. Moneda en transferencias

Las billeteras de una transferencia deben utilizar la misma moneda.

No implementar conversión de divisas como una transferencia simple.

Ejemplo válido:

```text
ARS → ARS
```

Una futura operación:

```text
ARS → USD
```

debe modelarse como una conversión específica con su propia lógica y tasa.

---

# 43. Saldos negativos

La arquitectura puede permitir saldos negativos.

No implementar una regla global de:

```text
fondos suficientes
```

si el dominio no la exige.

Esto permite representar situaciones reales como:

- descubierto;
- deuda;
- correcciones;
- movimientos registrados fuera de orden cronológico.

---

# 44. Saldo inicial

Crear una billetera puede incluir un saldo inicial.

Ese valor se representa mediante:

```text
SALDO_INICIAL
```

en `movimientos_billetera`.

No se almacena como una propiedad histórica editable de la billetera.

Conceptualmente:

```text
Billetera Efectivo
Saldo inicial $100.000
```

produce:

```text
Movimiento
SALDO_INICIAL
+100000
```

No constituye ingreso ni rentabilidad.

---

# 45. Conciliación

La conciliación compara:

```text
saldo calculado
```

con:

```text
saldo real
```

Ejemplo:

```text
Saldo calculado: $65.000
Saldo real:      $50.000
Diferencia:     -$15.000
```

La aplicación debe ofrecer:

```text
Registrar movimiento faltante
```

o:

```text
Ajustar diferencia
```

Si existe un movimiento real omitido, se debe preferir registrar la operación real.

Solo cuando corresponda se crea un:

```text
AJUSTE_POSITIVO
```

o:

```text
AJUSTE_NEGATIVO
```

---

# 46. Ajustes

Un ajuste modifica patrimonio.

No se considera automáticamente:

```text
Ingreso
Gasto
```

Por lo tanto no debe modificar automáticamente la rentabilidad.

Ejemplo:

```text
Ajuste caja
-15.000
```

modifica el saldo de la billetera.

Debe aparecer como ajuste en reportes y movimientos.

---

# 47. Fuente de verdad del saldo

El saldo se obtiene conceptualmente mediante:

```text
SUM(
    movimientos_billetera.importe_centavos
)
```

sobre movimientos válidos de una billetera.

No utilizar como estrategia principal:

```ts
obtenerTodosLosMovimientos()
    .filter(...)
    .reduce(...)
```

en JavaScript.

Las agregaciones deben resolverse en persistencia.

---

# 48. Consultas de patrimonio

Las consultas de patrimonio deben resolverse mediante repositorios especializados.

Actualmente existen conceptos como:

```text
RepositorioConsultaBilleteras
RepositorioDetalleBilletera
```

y sus implementaciones Web.

Estas consultas pueden combinar:

- billetera;
- saldo;
- movimientos;
- filtros;
- paginación;

sin exponer al componente cómo se resolvió la agregación.

---

# 49. Detalle de billetera

La pantalla de detalle no debe calcular el saldo sumando los elementos visibles.

El saldo mostrado y la página de movimientos son conceptos diferentes.

Ejemplo:

```text
Saldo actual:
$250.000
```

y debajo:

```text
últimos 20 movimientos
```

El saldo corresponde a la consulta de persistencia completa.

Los 20 movimientos son solamente una página de visualización.

---

# 50. Paginación

Los listados potencialmente grandes deben paginarse.

Esto aplica especialmente a:

- ingresos;
- gastos;
- movimientos;
- historiales.

No cargar toda la historia financiera para mostrar una pantalla.

Las consultas deben permitir, según corresponda:

```text
limite
desplazamiento
cursor
rango de fechas
```

La implementación exacta depende del repositorio y motor.

---

# 51. Índices

Las consultas deben aprovechar índices definidos en las migraciones.

Índices financieros importantes:

```text
movimientos_billetera(billetera_id, fecha)
movimientos_billetera(referencia_tipo, referencia_id)

ingresos(fecha)
gastos(fecha)

ingresos(actividad_id, fecha)
gastos(actividad_id, fecha)
gastos(categoria_id, fecha)
```

Cuando la implementación lo justifique también pueden existir índices sobre:

```text
ingresos_medios_pago
gastos_medios_pago
```

No agregar índices sin una necesidad real.

---

# 52. Cache de saldo

La arquitectura permite incorporar:

```text
saldo_actual_centavos
```

como cache si existe una necesidad de rendimiento comprobada.

Si se incorpora:

```text
movimientos_billetera
```

continúa siendo la fuente de verdad.

El cache debe:

- poder reconstruirse;
- actualizarse atómicamente;
- no ser la única copia del saldo.

No incorporar duplicación de estado sin necesidad.

---

# 53. Saldos históricos

La estrategia de saldos históricos se documenta en:

```text
docs/SALDOS_HISTORICOS.md
```

La arquitectura puede incorporar en el futuro:

```text
saldos_billetera_periodo
```

para acelerar consultas históricas cuando el volumen lo justifique.

No implementar cierres periódicos anticipadamente si las consultas indexadas actuales son suficientes.

---

# 54. Reportes

Los reportes deben mantener tres conceptos separados.

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

Nunca calcular:

```text
transferencia
=
ingreso o gasto
```

---

# 55. Rentabilidad por actividad

La rentabilidad de una actividad se calcula mediante:

```text
Ingresos de la actividad
-
Gastos asociados a la actividad
=
Resultado neto
```

Los gastos sin actividad asociada no deben atribuirse automáticamente a otra actividad.

Las consultas deben realizar la agregación en persistencia cuando el volumen lo requiera.

---

# 56. Datos iniciales

Los datos sugeridos pueden incluir:

```text
Actividades
Categorías
Medios de pago
Billeteras
```

Los valores iniciales son datos normales.

No escribir lógica como:

```ts
if (medio === 'Efectivo') {
   ...
}
```

cuando el comportamiento puede resolverse mediante configuración almacenada.

Ejemplo:

```text
mostrar_en_carga_rapida
billetera_predeterminada_id
orden
```

---

# 57. Local-first

Toda funcionalidad principal de V1 debe funcionar sin conexión.

El usuario debe poder:

- registrar ingresos;
- registrar gastos;
- gestionar catálogos;
- consultar billeteras;
- transferir;
- conciliar;
- consultar reportes;

sin depender de internet.

La conectividad futura debe agregar sincronización, no reemplazar la base local como concepto fundamental.

---

# 58. Futuro cloud

La evolución futura puede seguir:

```text
Aplicación
    ↓
Base local
    ↓
Cola / servicio de sincronización
    ↓
API
    ↓
Base cloud
```

Los UUID locales permiten conservar la identidad entre dispositivos y servidor.

No implementar sincronización cloud mientras no forme parte explícita del alcance.

---

# 59. Preparación para sincronización

Aunque la sincronización todavía no sea implementada, la arquitectura debe evitar decisiones que la vuelvan innecesariamente difícil.

Mantener:

- UUID estables;
- auditoría;
- borrado lógico;
- referencias explícitas;
- movimientos trazables;
- operaciones idempotentes.

No agregar campos o infraestructura de sincronización especulativa si todavía no son necesarios.

---

# 60. Backup

El respaldo debe operar sobre la capa de datos y no sobre componentes React.

Formato previsto:

```text
JSON versionado
```

con:

```text
version_formato
version_aplicacion
exportado_en
datos
```

La importación debe:

- validar formato;
- validar versión;
- validar relaciones;
- ejecutarse de forma transaccional.

No dejar importaciones parciales.

---

# 61. PWA y Capacitor

Web y PWA comparten la misma aplicación React.

Capacitor empaqueta esa misma aplicación para plataformas nativas.

No duplicar:

```text
src/
```

para Android o iOS.

Las carpetas nativas son contenedores/plataformas, no una segunda implementación del producto.

La lógica del negocio permanece compartida.

---

# 62. Diferencias por plataforma

Una diferencia específica de plataforma debe encapsularse.

Ejemplos:

```text
AdaptadorIndexedDB
AdaptadorSQLite
```

La presentación no debe contener condicionales financieros como:

```ts
if (esAndroid) {
   guardarDeUnaForma()
} else {
   guardarDeOtraForma()
}
```

La selección corresponde a composición/adaptadores.

---

# 63. Manejo de errores

Los errores deben propagarse mediante mecanismos controlados.

La infraestructura puede lanzar/rechazar errores.

Los servicios pueden transformarlos cuando corresponda en errores de dominio o aplicación.

La UI debe:

- informar el problema;
- conservar los datos ingresados cuando sea razonable;
- evitar estados parcialmente confirmados.

No utilizar silenciosamente valores inventados cuando una operación financiera falla.

---

# 64. Concurrencia

La aplicación debe contemplar que Web puede ejecutarse en más de una pestaña o contexto.

Las operaciones financieras críticas deben protegerse mediante:

- transacciones;
- comprobación del estado actual;
- idempotencia;
- referencias estables.

Cuando corresponda, una edición puede validar:

```text
actualizado_en
```

esperado para detectar modificaciones concurrentes.

No sobrescribir silenciosamente cambios más recientes.

---

# 65. Fechas

Distinguir entre:

```text
fecha de calendario
```

y:

```text
instante de auditoría
```

Las fechas de negocio pueden representarse conceptualmente como:

```text
AAAA-MM-DD
```

cuando no requieren hora.

Los instantes de auditoría deben almacenarse de forma consistente, preferentemente ISO 8601 UTC.

La presentación convierte a la zona horaria del usuario cuando corresponde.

---

# 66. Borrado lógico

Los registros históricos utilizan borrado lógico cuando corresponda.

Campos:

```text
activo
eliminado_en
```

permiten distinguir:

```text
Disponible para nuevas operaciones
```

de:

```text
Necesario para conservar historia
```

No borrar físicamente una entidad referenciada por operaciones financieras salvo que exista una estrategia de integridad explícita.

---

# 67. Componentes de formulario

Los formularios de ingreso y gasto deben compartir comportamiento cuando sea posible.

Ejemplo:

```text
FormularioOperacionRapida
CampoImporte
SelectorCatalogo
```

La reutilización no debe forzar abstracciones difíciles de entender.

Una abstracción compartida tiene sentido cuando reduce duplicación real sin ocultar reglas del dominio.

---

# 68. Principio de simplicidad

No sobreingenierizar V1.

Evitar incorporar anticipadamente:

- microservicios;
- colas cloud;
- CQRS completo;
- event sourcing;
- caches complejas;
- servicios distribuidos;
- sincronización multiusuario;

si no son necesarios.

La tabla:

```text
movimientos_billetera
```

es un libro de movimientos para trazabilidad financiera local, pero esto no implica adoptar una arquitectura completa de event sourcing.

---

# 69. Principio de trazabilidad

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

Las relaciones históricas no deben reconstruirse utilizando configuraciones actuales.

---

# 70. Principio de idempotencia

Una operación repetida accidentalmente no debe producir doble impacto financiero.

Especialmente:

```text
Ingreso
Gasto
Transferencia
Ajuste
Saldo inicial
```

deben contar con mecanismos que permitan identificar efectos ya persistidos.

Esta regla será también fundamental para una futura sincronización cloud.

---

# 71. Principio de consistencia

Una operación puede modificar varias estructuras.

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

Estas escrituras forman una única operación lógica.

El sistema debe evitar estados donde solo una parte haya sido confirmada.

---

# 72. Principio de preservación histórica

Cambiar configuraciones actuales no debe modificar el significado de operaciones pasadas.

Ejemplos:

- cambiar billetera predeterminada;
- cambiar icono;
- cambiar color;
- desactivar medio de pago;
- desactivar billetera;
- finalizar actividad;
- renombrar categoría.

Los registros históricos deben seguir resolviéndose correctamente.

---

# 73. Relación conceptual completa

```text
ACTIVIDAD
   │
   ├──────────────┐
   │              │
   ▼              ▼
INGRESO         GASTO
   │              │
   │              ├──────── CATEGORÍA
   │              │
   ▼              ▼
DETALLE         DETALLE
INGRESO         GASTO
   │              │
   ├── MEDIO      ├── MEDIO
   │   DE PAGO    │   DE PAGO
   │              │
   ├── BILLETERA  ├── BILLETERA
   │              │
   ▼              ▼
MOVIMIENTO      MOVIMIENTO
BILLETERA       BILLETERA
```

Las transferencias siguen otro flujo:

```text
BILLETERA ORIGEN
       │
       ▼
 TRANSFERENCIA
       │
   ┌───┴───┐
   ▼       ▼
 SALIDA   ENTRADA
   │       │
   ▼       ▼
ORIGEN   DESTINO
```

La conciliación:

```text
SALDO CALCULADO
       │
       ▼
COMPARACIÓN
       │
       ▼
SALDO REAL
       │
   ┌───┴──────────────┐
   ▼                  ▼
MOVIMIENTO        AJUSTE
FALTANTE
```

---

# 74. Flujo de dependencias

Ejemplo de creación de ingreso:

```text
FormularioIngreso
       ↓
ServicioIngresos
       ↓
RepositorioIngresos
RepositorioMovimientosBilletera
       ↓
Implementación Web / Nativa
       ↓
IndexedDB / SQLite
```

El componente no conoce:

```text
transacciones físicas
índices
stores
SQL
```

---

# 75. Flujo de consulta

Ejemplo de billeteras:

```text
PaginaBilleteras
       ↓
ServicioConsultaBilleteras
       ↓
RepositorioConsultaBilleteras
       ↓
RepositorioConsultaBilleterasWeb / Nativo
       ↓
Persistencia
```

La UI recibe:

```text
nombre
saldo
moneda
icono
estado
```

sin reconstruir el saldo.

---

# 76. Dependencias prohibidas

Evitar:

```text
modules
→ IndexedDB directo
```

```text
modules
→ SQLite directo
```

```text
shared/components
→ repositories
```

```text
entities
→ React
```

```text
core
→ Material UI
```

```text
core
→ window.localStorage
```

cuando se trate de datos financieros o preferencias que deben entrar mediante una abstracción apropiada.

---

# 77. Responsabilidad de `shared`

`shared` contiene elementos verdaderamente reutilizables.

No convertir `shared` en una carpeta donde se coloca cualquier archivo difícil de clasificar.

Un elemento debe ir allí si:

- no pertenece a un módulo específico;
- es reutilizado;
- su responsabilidad es genérica dentro de AppBilletera.

---

# 78. Responsabilidad de `modules`

Cada módulo debe agrupar funcionalidad relacionada.

Ejemplo:

```text
modules/billeteras/
```

puede contener:

```text
PaginaBilleteras
PaginaDetalleBilletera
PaginaTransferencia
PaginaConciliacionBilletera
```

cuando esas pantallas existan.

No mover reglas financieras desde `core` al módulo únicamente porque una pantalla las utiliza.

---

# 79. Documentación relacionada

Consultar según la tarea:

```text
docs/PRODUCTO.md
```

para alcance funcional.

```text
docs/MODELO_DATOS.md
```

para esquema e integridad.

```text
docs/SALDOS_HISTORICOS.md
```

para estrategia histórica de saldos.

```text
docs/GUIA_VISUAL.md
```

para estilos y dimensiones.

```text
docs/PANTALLAS.md
```

para definición funcional de pantallas.

```text
docs/VERSIONADO.md
```

para releases.

```text
docs/TAREAS_CODEX.md
```

para orden de implementación.

`AGENTS.md` continúa siendo la referencia principal de reglas permanentes.

---

# 80. Regla final

La arquitectura debe priorizar, en este orden:

```text
1. Integridad financiera
2. Preservación de datos
3. Trazabilidad
4. Separación de responsabilidades
5. Funcionamiento offline
6. Consistencia entre plataformas
7. Rendimiento
8. Simplicidad
9. Experiencia de usuario
```

Una optimización o simplificación no debe comprometer la integridad financiera.

Una decisión visual no debe introducir lógica de negocio en presentación.

Una diferencia de plataforma no debe filtrarse innecesariamente hacia el dominio.

Una configuración actual no debe reinterpretar el historial.

La arquitectura debe seguir siendo comprensible, mantenible y preparada para evolucionar sin sobreingenierizar la primera versión.