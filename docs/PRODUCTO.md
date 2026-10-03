# Producto

AppBilletera es una aplicación personal de gestión financiera orientada a registrar, organizar y analizar el dinero del usuario de forma rápida, clara y completamente utilizable sin conexión.

Su objetivo principal es permitir responder fácilmente:

```text
¿Cuánto ingresé?
¿Cuánto gasté?
¿Cuánto gané realmente?
¿Dónde está mi dinero?
¿De qué actividad provino?
¿En qué se gastó?
¿Qué actividad o trabajo fue rentable?
```

La aplicación permite administrar tanto finanzas personales generales como ingresos y gastos relacionados con actividades, trabajos, servicios y proyectos temporales.

---

# 1. Objetivos del producto

AppBilletera debe permitir:

- registrar ingresos rápidamente;
- registrar gastos rápidamente;
- organizar ingresos por actividad;
- clasificar gastos mediante categorías;
- distribuir operaciones entre distintos medios de pago;
- identificar en qué billetera entró o salió el dinero;
- conocer el saldo de cada billetera;
- mover dinero entre billeteras;
- conciliar saldos reales con los registrados;
- registrar diferencias de forma trazable;
- analizar ingresos, gastos y ganancia;
- medir rentabilidad por actividad;
- consultar patrimonio;
- conservar historial;
- realizar respaldos;
- funcionar completamente offline.

La experiencia debe estar especialmente optimizada para celular.

---

# 2. Plataformas

AppBilletera debe ofrecer la misma experiencia funcional en:

```text
Web
PWA
Android
iOS
iPadOS
```

Las plataformas comparten:

- lógica de negocio;
- modelo financiero;
- pantallas;
- reglas;
- experiencia visual.

No se consideran productos independientes.

---

# 3. Enfoque local-first

La aplicación debe ser plenamente funcional sin conexión a internet.

El usuario debe poder sin conexión:

- registrar ingresos;
- registrar gastos;
- administrar actividades;
- administrar categorías;
- administrar medios de pago;
- administrar billeteras;
- consultar saldos;
- realizar transferencias;
- conciliar billeteras;
- consultar reportes;
- exportar respaldos.

La conectividad no debe ser un requisito para las funciones principales.

---

# 4. Actividades

Una actividad representa una fuente de ingresos, trabajo, proyecto o servicio.

Ejemplos:

```text
DiDi
Uber
Fotografía
Programación
Venta
Pintura
Trabajo temporal
Servicio
```

Una actividad puede tener:

- ingresos;
- gastos relacionados;
- fecha de inicio;
- fecha de finalización;
- estado;
- icono;
- color.

Esto permite conocer su rentabilidad.

---

# 5. Trabajos temporales

No se utiliza un concepto separado de proyecto temporal cuando una actividad puede representarlo correctamente.

Ejemplo:

```text
Pintura departamento
```

puede tener:

```text
Fecha inicio
Fecha fin
Ingresos
Gastos
Resultado
```

Estados iniciales:

```text
Activo
Finalizado
Archivado
```

---

# 6. Catálogos

Los principales catálogos configurables son:

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

El usuario puede configurar estos elementos sin depender de valores fijos definidos por la aplicación.

Los formularios cotidianos de ingreso y gasto utilizan esos catálogos, pero no deben convertirse en pantallas de administración de catálogos.

---

# 7. Categorías de gastos

Las categorías permiten responder:

```text
¿En qué gasté el dinero?
```

Ejemplos:

```text
Combustible
Comida
Peajes
Mantenimiento
Ocio
Otros
```

Las categorías pueden tener:

```text
Nombre
Icono
Color
Estado
```

Una categoría desactivada deja de estar disponible para nuevas operaciones, pero continúa apareciendo correctamente en operaciones históricas.

---

# 8. Medios de pago

Un medio de pago representa:

```text
cómo se pagó o cobró
```

Ejemplos:

```text
Efectivo
Transferencia
Tarjeta
```

Cada medio puede configurar:

- nombre;
- icono;
- color;
- orden;
- disponibilidad en carga rápida;
- billetera predeterminada;
- estado.

Los medios de pago son editables.

No deben formar parte fija de la estructura de un ingreso o gasto.

---

# 9. Billeteras

Una billetera representa:

```text
dónde está el dinero
```

o:

```text
de dónde salió
```

Ejemplos:

```text
Efectivo
Mercado Pago
Banco Galicia
Cuenta DNI
Ualá
```

Por lo tanto:

```text
Medio de pago
```

y:

```text
Billetera
```

son conceptos diferentes.

Ejemplo:

```text
Medio de pago:
Transferencia

Billetera:
Banco Galicia
```

---

# 10. Billetera predeterminada

Un medio de pago puede tener una billetera predeterminada para acelerar la carga.

Ejemplo:

```text
Transferencia
→ Banco Galicia
```

Esto significa:

```text
sugerir Banco Galicia en una nueva operación
```

No significa que todas las operaciones con transferencia pertenezcan permanentemente a esa billetera.

El usuario debe poder seleccionar otra billetera cuando corresponda.

---

# 11. Preservación histórica de la billetera

Cada importe registrado conserva la billetera realmente utilizada.

Ejemplo:

```text
1 de octubre

Transferencia
Banco Galicia
$50.000
```

Si posteriormente el usuario configura:

```text
Transferencia
→ Mercado Pago
```

el movimiento anterior debe continuar perteneciendo a:

```text
Banco Galicia
```

Las configuraciones actuales no deben reinterpretar operaciones históricas.

---

# 12. Ingresos

Un ingreso registra una entrada de dinero.

Debe permitir indicar:

```text
Actividad
Fecha
Descripción
Observaciones
Medios de cobro
Billeteras utilizadas
```

Un único ingreso puede distribuirse entre varios medios.

Ejemplo:

```text
Actividad:
DiDi

Efectivo
Billetera Efectivo
$35.000

Transferencia
Banco Galicia
$20.000

TOTAL
$55.000
```

---

# 13. Carga rápida de ingresos

Registrar un ingreso debe requerir la menor cantidad razonable de pasos.

Al abrir el formulario se puede precargar:

```text
última actividad utilizada
fecha actual
medios rápidos
billeteras predeterminadas
```

Los medios configurados como carga rápida aparecen directamente.

Ejemplo:

```text
Efectivo          $ [        ]
Transferencia     $ [        ]
Tarjeta           $ [        ]
```

Los campos vacíos se consideran cero para calcular la interfaz.

Solo se guardan líneas con importe mayor a cero.

No se puede guardar un ingreso cuyo total sea cero.

---

# 14. Gastos

Un gasto registra una salida de dinero.

Debe permitir indicar:

```text
Categoría
Actividad opcional
Fecha
Descripción
Observaciones
Medios de pago
Billeteras utilizadas
```

Ejemplo:

```text
Categoría:
Combustible

Actividad:
DiDi

Efectivo
Billetera Efectivo
$20.000

Tarjeta
Billetera Ualá
$30.000

TOTAL
$50.000
```

---

# 15. Carga rápida de gastos

Debe utilizar el mismo patrón general que los ingresos.

Precargar cuando corresponda:

```text
última categoría utilizada
última actividad utilizada
fecha actual
medios rápidos
billeteras predeterminadas
```

Los campos vacíos equivalen a cero para el cálculo.

Solo se persisten líneas con importe mayor a cero.

No se permite guardar un gasto cuyo total sea cero.

---

# 16. Asociación de gastos con actividades

Un gasto puede asociarse opcionalmente a una actividad.

Ejemplo:

```text
Combustible
→ DiDi
```

Esto permite calcular posteriormente:

```text
Ingresos DiDi
-
Gastos DiDi
=
Ganancia DiDi
```

Un gasto que no pertenece a una actividad puede quedar sin asociación.

No debe asignarse artificialmente a otra actividad.

---

# 17. Saldos de billeteras

Cada billetera tiene un saldo calculado a partir de sus movimientos.

El usuario no modifica directamente ese saldo.

Los cambios deben provenir de operaciones identificables como:

```text
Saldo inicial
Ingreso
Gasto
Transferencia
Ajuste
```

Esto permite conocer por qué una billetera tiene determinado saldo.

---

# 18. Saldo inicial

Al crear una billetera se puede indicar un saldo inicial.

Ejemplo:

```text
Efectivo

Saldo inicial:
$100.000
```

Ese importe debe quedar registrado como:

```text
SALDO_INICIAL
```

y no como ingreso.

Por lo tanto:

```text
Saldo inicial
```

aumenta el patrimonio registrado, pero no la ganancia.

---

# 19. Transferencias entre billeteras

El usuario puede mover dinero entre billeteras.

Ejemplo:

```text
Efectivo
→ Banco Galicia

$100.000
```

Resultado:

```text
Efectivo
-$100.000

Banco Galicia
+$100.000
```

Una transferencia:

- no es un ingreso;
- no es un gasto;
- no genera ganancia;
- no genera pérdida;
- no modifica el patrimonio total.

Solo cambia dónde está el dinero.

---

# 20. Conciliación

AppBilletera permite comparar:

```text
Saldo calculado
```

con:

```text
Saldo real
```

Ejemplo:

```text
Saldo calculado:
$65.000

Saldo real:
$50.000

Diferencia:
-$15.000
```

Cuando existe una diferencia, el usuario puede:

```text
Registrar movimiento faltante
```

o:

```text
Ajustar diferencia
```

---

# 21. Movimiento faltante

Cuando el usuario reconoce qué operación produjo una diferencia, debe poder registrar la operación real.

Ejemplo:

```text
Falta registrar:

Combustible
$15.000
```

Se registra como gasto real.

No se debe crear adicionalmente un ajuste por la misma diferencia.

Registrar la causa real tiene prioridad frente a utilizar un ajuste genérico.

---

# 22. Ajustes

Cuando no sea posible identificar una operación concreta, puede registrarse un ajuste.

Tipos:

```text
AJUSTE_POSITIVO
AJUSTE_NEGATIVO
```

Los ajustes modifican el patrimonio registrado.

No se consideran automáticamente:

```text
Ingreso
Gasto
```

y deben presentarse separadamente en los reportes.

---

# 23. Pantalla Inicio

Inicio debe responder rápidamente:

```text
¿Cuánto gané hoy?
¿Cuánto ingresé hoy?
¿Cuánto gasté hoy?
¿Cuánto dinero tengo?
¿Qué movimientos hice recientemente?
```

Debe mostrar principalmente:

```text
Ganancia de hoy

Ingresos
+ Agregar ingreso

Gastos
+ Agregar gasto

Mi dinero

Últimos movimientos
```

Las acciones frecuentes deben ser visibles sin navegar por menús innecesarios.

---

# 24. Mi dinero

Inicio debe ofrecer un resumen de las principales billeteras.

Ejemplo:

```text
Mi dinero

Efectivo          $250.000
Mercado Pago      $120.000
Banco Galicia     $320.000
```

Acciones:

```text
Transferir
Ver todas
```

El listado completo de billeteras permite consultar el patrimonio con mayor detalle.

---

# 25. Detalle de billetera

Cada billetera debe permitir consultar:

```text
Nombre
Saldo actual
Última conciliación
Movimientos
```

Acciones principales:

```text
Transferir
Conciliar
```

Los movimientos pueden filtrarse o paginarse según corresponda.

---

# 26. Últimos movimientos

Los movimientos recientes deben diferenciar claramente:

```text
Ingreso
Gasto
Transferencia
Ajuste
Saldo inicial
```

Ejemplo:

```text
Ingreso DiDi           +$35.000
Gasto Combustible      -$20.000
Efectivo → Galicia     $100.000
Ajuste caja            -$15.000
```

La diferencia visual no debe depender exclusivamente del color.

---

# 27. Reportes

Los reportes deben separar tres conceptos principales.

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

Estas categorías no deben mezclarse.

---

# 28. Períodos de reportes

Períodos principales:

```text
Hoy
Semana
Mes
Año
Personalizado
```

La aplicación debe permitir analizar los datos dentro del período seleccionado.

---

# 29. Rentabilidad por actividad

Para cada actividad debe ser posible conocer:

```text
Ingresos
Gastos asociados
Ganancia neta
```

Ejemplo:

```text
DiDi

Ingresos
$520.000

Gastos
$190.000

Ganancia
$330.000
```

Esto también aplica a trabajos temporales y proyectos.

---

# 30. Reportes por categoría

El usuario debe poder conocer en qué está gastando.

Ejemplo:

```text
Combustible
$180.000

Comida
$90.000

Peajes
$45.000
```

La presentación puede utilizar:

- importes;
- porcentajes;
- barras;
- agrupaciones visuales.

Los gráficos deben aportar información real y no ser solamente decorativos.

---

# 31. Reportes por medio de pago

Debe ser posible conocer cómo se distribuyeron las operaciones entre medios.

Ejemplo:

```text
Efectivo
Transferencia
Tarjeta
```

Este concepto no debe confundirse con el patrimonio por billetera.

---

# 32. Reporte patrimonial

Debe ser posible conocer dónde se encuentra el dinero.

Ejemplo:

```text
Efectivo          $250.000
Mercado Pago      $120.000
Banco Galicia     $320.000

TOTAL             $690.000
```

Este total representa patrimonio.

No representa ganancia.

---

# 33. Respaldo

La aplicación permite:

```text
Exportar respaldo
Importar respaldo
```

El respaldo debe contener la información necesaria para reconstruir el estado local de AppBilletera.

El formato es:

```text
JSON versionado
```

La importación debe validar los datos antes de reemplazar o incorporar información.

Una importación fallida no debe dejar información parcialmente restaurada.

---

# 34. Apariencia

AppBilletera soporta:

```text
Sistema
Claro
Oscuro
```

Predeterminado:

```text
Sistema
```

En modo Sistema se respeta la apariencia seleccionada por el dispositivo cuando sea técnicamente posible.

La preferencia debe mantenerse entre sesiones.

---

# 35. Diseño visual

AppBilletera utiliza Material UI como base visual.

El producto debe sentirse:

- moderno;
- limpio;
- compacto;
- fácil de leer;
- consistente;
- rápido;
- orientado a interacción táctil.

La especificación visual detallada se encuentra en:

```text
docs/GUIA_VISUAL.md
```

La estructura funcional de cada pantalla se encuentra en:

```text
docs/PANTALLAS.md
```

---

# 36. Mobile-first

El celular es el escenario principal de diseño.

Se priorizan:

- pocos toques;
- botones grandes;
- inputs cómodos;
- acciones frecuentes visibles;
- información financiera clara;
- navegación simple.

La misma aplicación se adapta posteriormente a:

```text
Tablet
Desktop
```

sin crear productos separados.

---

# 37. Accesibilidad

La interfaz debe contemplar:

- contraste suficiente;
- labels;
- foco visible;
- áreas táctiles apropiadas;
- información no dependiente únicamente del color;
- mensajes de error comprensibles;
- navegación responsive.

---

# 38. Historial

Cambiar una configuración actual no debe modificar el significado de operaciones antiguas.

Ejemplos:

```text
Cambiar billetera predeterminada
Renombrar categoría
Desactivar actividad
Cambiar icono
Cambiar color
Desactivar medio de pago
Desactivar billetera
```

El historial debe continuar siendo comprensible y consistente.

---

# 39. Trazabilidad

La aplicación debe poder explicar cualquier variación de una billetera.

Conceptualmente debe ser posible responder:

```text
¿Qué ocurrió?
¿Cuándo ocurrió?
¿Cuánto dinero fue?
¿En qué billetera?
¿Cómo se pagó o cobró?
¿Qué operación originó el movimiento?
```

La trazabilidad tiene prioridad sobre simplificaciones que hagan imposible explicar el historial.

---

# 40. Prevención de duplicados

Una operación repetida accidentalmente no debe generar dos veces el mismo efecto financiero.

Ejemplo:

registrar una vez:

```text
Ingreso
$35.000
```

no debe terminar produciendo:

```text
+$35.000
+$35.000
```

por un reintento de la aplicación.

Esta regla es importante tanto para el funcionamiento local como para una futura sincronización.

---

# 41. Estado offline

La aplicación debe mostrar y permitir utilizar los datos locales aunque no exista conectividad.

La ausencia de internet no debe impedir:

```text
consultar
crear
editar
transferir
conciliar
reportar
```

las operaciones soportadas localmente.

---

# 42. Evolución futura

La arquitectura del producto debe permitir incorporar posteriormente:

- sincronización cloud;
- múltiples dispositivos;
- múltiples monedas;
- nuevos tipos de actividades;
- nuevos reportes;
- nuevas integraciones;
- nuevas plataformas compatibles.

Estas posibilidades no justifican agregar complejidad innecesaria antes de que exista una necesidad concreta.

---

# 43. Fuera de alcance inicial

No forman parte obligatoria del alcance actual:

```text
Backend cloud obligatorio
Sincronización multiusuario
Red social
Marketplace
Contabilidad empresarial completa
Facturación electrónica
Conexión bancaria automática
Conversión automática de monedas
Event sourcing completo
Microservicios
```

Pueden evaluarse posteriormente si el producto lo requiere.

---

# 44. Prioridades del producto

Ante decisiones de producto, priorizar:

```text
1. Integridad financiera
2. Preservación de los datos
3. Trazabilidad
4. Rapidez de carga
5. Facilidad de uso
6. Funcionamiento offline
7. Consistencia entre plataformas
8. Rendimiento
9. Consistencia visual
10. Capacidad de evolución
```

Una mejora visual no debe comprometer integridad financiera.

Una optimización no debe destruir historial.

Una reducción de pasos no debe ocultar información necesaria para registrar correctamente una operación.

---

# 45. Criterio de éxito

AppBilletera cumple su objetivo cuando el usuario puede registrar una operación cotidiana en pocos segundos y posteriormente responder con confianza:

```text
cuánto ganó
cuánto gastó
cuánto dinero tiene
dónde está ese dinero
qué actividades son rentables
qué movimientos explican cada saldo
```

sin depender de conexión a internet y sin perder trazabilidad del historial.