# AppBilletera — Pantallas

Este documento define las pantallas principales de AppBilletera, su contenido, relaciones, acciones y comportamiento esperado.

Debe utilizarse junto con:

```text
AGENTS.md
docs/ARQUITECTURA.md
docs/MODELO_DATOS.md
docs/GUIA_VISUAL.md
```

`GUIA_VISUAL.md` define dimensiones, colores, radios, sombras y comportamiento responsive.

Este documento define:

- qué información muestra cada pantalla;
- qué entidades utiliza;
- qué acciones permite;
- qué navegación produce;
- qué estados debe contemplar;
- qué reglas financieras debe respetar.

---

# 1. Principios generales

Todas las pantallas deben respetar:

- mobile-first;
- modo claro;
- modo oscuro;
- Material UI;
- componentes compartidos;
- carga local-first;
- soporte offline;
- accesibilidad;
- consistencia visual;
- reglas financieras del dominio.

Las pantallas no deben acceder directamente a:

```text
IndexedDB
SQLite
SQL
```

Deben utilizar servicios y repositorios mediante las capas definidas en la arquitectura.

---

# 2. Navegación principal

En móvil, la navegación principal utiliza:

```text
Inicio
Ingresos
Gastos
Reportes
```

Ajustes se accede mediante:

- AppBar;
- menú;
- icono de configuración.

Billeteras deben ser accesibles rápidamente desde Inicio.

En tablet y desktop puede reemplazarse la navegación inferior por:

```text
Drawer
Sidebar
NavigationRail
```

sin duplicar pantallas.

---

# 3. Mapa funcional

Las pantallas principales son:

```text
Inicio

Nuevo ingreso
Ingresos

Nuevo gasto
Gastos

Billeteras
Detalle de billetera
Transferencia entre billeteras
Conciliación
Registrar movimiento faltante

Actividades
Categorías de gastos
Medios de pago

Reportes

Ajustes
Apariencia
```

El modo claro y oscuro no representan pantallas funcionales diferentes.

Son variantes visuales del mismo contenido.

---

# 4. Pantalla Inicio

## Objetivo

Dar una visión inmediata del estado financiero actual y permitir registrar rápidamente las operaciones más frecuentes.

Debe responder rápidamente:

```text
¿Cuánto gané hoy?
¿Cuánto ingresó?
¿Cuánto gasté?
¿Cuánto dinero tengo?
¿Qué movimientos hice recientemente?
```

---

## Contenido

### Cabecera

Mostrar:

```text
AppBilletera
```

Puede incluir:

- acceso a Ajustes;
- avatar/icono de aplicación;
- fecha actual si aporta valor.

No sobrecargar la cabecera.

---

## Ganancia de hoy

Elemento principal.

Mostrar:

```text
Ganancia de hoy
$90.000
```

Cálculo:

```text
ingresos del día
-
gastos del día
```

No incluir:

- transferencias;
- ajustes.

---

## Ingresos del día

Mostrar:

```text
Ingresos

$132.000

+ Agregar ingreso
```

Acción:

```text
Agregar ingreso
→ Nuevo ingreso
```

---

## Gastos del día

Mostrar:

```text
Gastos

$42.000

+ Agregar gasto
```

Acción:

```text
Agregar gasto
→ Nuevo gasto
```

---

## Mi dinero

Mostrar resumen patrimonial.

Ejemplo:

```text
Mi dinero

Efectivo          $250.000
Mercado Pago      $120.000
Banco Galicia     $320.000
```

Mostrar inicialmente aproximadamente:

```text
3 billeteras
```

Acciones:

```text
Transferir
Ver todas
```

`Transferir` abre:

```text
Transferencia entre billeteras
```

`Ver todas` abre:

```text
Billeteras
```

---

## Últimos movimientos

Mostrar aproximadamente:

```text
4–5 movimientos
```

Ejemplo:

```text
Ingreso DiDi             +$35.000

Gasto Combustible        -$20.000

Efectivo → Galicia       $100.000

Ajuste caja              -$15.000
```

Orden:

```text
más reciente primero
```

Los movimientos pueden provenir de:

```text
INGRESO
GASTO
TRANSFERENCIA_ENTRADA
TRANSFERENCIA_SALIDA
AJUSTE_POSITIVO
AJUSTE_NEGATIVO
SALDO_INICIAL
```

---

## Relaciones

Consulta principalmente:

```text
ingresos
gastos
billeteras
movimientos_billetera
```

Puede utilizar:

```text
ServicioConsultaBilleteras
```

y servicios de resumen.

---

## Reglas

La tarjeta:

```text
Ganancia
```

no debe utilizar saldos de billetera para calcular el resultado.

Debe calcularse exclusivamente mediante:

```text
Ingresos - Gastos
```

El patrimonio debe calcularse desde:

```text
movimientos_billetera
```

---

## Estilo

Consultar:

```text
GUIA_VISUAL.md
```

Especialmente:

```text
Inicio — resumen principal
Inicio — ingresos y gastos
Inicio — billeteras
Inicio — últimos movimientos
```

---

# 5. Pantalla Nuevo ingreso

## Objetivo

Registrar un ingreso con la menor cantidad razonable de interacciones.

---

## Campos

### Actividad

Obligatoria.

Origen:

```text
actividades
```

Solo mostrar actividades disponibles para nuevas operaciones.

Precargar cuando corresponda:

```text
ultima_actividad_ingreso
```

---

## Fecha

Valor predeterminado:

```text
fecha actual
```

Editable.

---

## Descripción

Opcional.

Ejemplo:

```text
Jornada tarde
```

---

## Observaciones

Opcionales.

---

## Medios de cobro

Mostrar directamente los medios con:

```text
mostrar_en_carga_rapida = true
```

Ejemplo:

```text
Efectivo              $35.000
Transferencia         $20.000
Tarjeta                    $0
```

Cada línea representa conceptualmente:

```text
medio_pago_id
billetera_id
importe_centavos
```

La billetera puede venir precargada desde:

```text
medio_pago.billetera_predeterminada_id
```

pero debe almacenarse la billetera realmente utilizada.

---

## Total

Calcular automáticamente:

```text
SUM(detalles)
```

Ejemplo:

```text
TOTAL

$55.000
```

---

## Acción principal

```text
Guardar ingreso
```

---

## Persistencia

Debe generar:

```text
ingresos
```

más:

```text
ingresos_medios_pago
```

más los movimientos correspondientes:

```text
movimientos_billetera
```

---

## Relaciones

```text
ingresos.actividad_id
→ actividades.id
```

```text
ingresos_medios_pago.ingreso_id
→ ingresos.id
```

```text
ingresos_medios_pago.medio_pago_id
→ medios_pago.id
```

```text
ingresos_medios_pago.billetera_id
→ billeteras.id
```

---

## Movimientos

Cada detalle produce:

```text
tipo = INGRESO
```

con:

```text
importe positivo
```

Referencia:

```text
referencia_tipo = INGRESO_MEDIO_PAGO
referencia_id = detalle.id
```

---

## Validaciones

No permitir:

```text
total = 0
```

No persistir detalles:

```text
importe_centavos = 0
```

Validar:

- actividad válida;
- billetera válida;
- medio válido;
- moneda compatible;
- importes válidos.

---

## Estado posterior

Al guardar correctamente:

- actualizar preferencias de carga;
- invalidar consultas necesarias;
- actualizar Inicio;
- actualizar billeteras;
- actualizar reportes.

---

# 6. Pantalla Ingresos

## Objetivo

Consultar y administrar ingresos existentes.

---

## Cabecera

Mostrar:

```text
Ingresos
```

Acción:

```text
+ Nuevo ingreso
```

---

## Listado

Cada registro puede mostrar:

```text
Actividad
Descripción
Fecha
Total
```

Ejemplo:

```text
DiDi
Jornada tarde

02/10/2026

+$55.000
```

---

## Filtros

Puede permitir:

```text
Hoy
Semana
Mes
Personalizado
```

y cuando sea necesario:

```text
Actividad
```

---

## Acciones

Según la implementación vigente:

- ver;
- editar;
- eliminar lógicamente.

---

## Reglas

El listado debe paginarse cuando el volumen lo justifique.

No cargar toda la historia financiera innecesariamente.

---

# 7. Pantalla Nuevo gasto

## Objetivo

Registrar un gasto rápidamente.

Debe compartir la misma estructura visual básica de Nuevo ingreso.

---

## Campos

### Categoría

Obligatoria.

Origen:

```text
categorias_gasto
```

Precargar:

```text
ultima_categoria_gasto
```

---

## Actividad

Opcional.

Origen:

```text
actividades
```

Precargar cuando corresponda:

```text
ultima_actividad_gasto
```

Permite calcular rentabilidad por actividad.

---

## Fecha

Predeterminada:

```text
fecha actual
```

---

## Descripción

Ejemplo:

```text
Carga de combustible
```

---

## Observaciones

Opcionales.

---

## Medios de pago

Ejemplo:

```text
Efectivo              $20.000
Transferencia              $0
Tarjeta                $30.000
```

Cada detalle contiene:

```text
medio_pago_id
billetera_id
importe_centavos
```

---

## Total

Ejemplo:

```text
TOTAL

$50.000
```

---

## Acción

```text
Guardar gasto
```

---

## Persistencia

Debe generar:

```text
gastos
```

más:

```text
gastos_medios_pago
```

más:

```text
movimientos_billetera
```

---

## Relaciones

```text
gastos.categoria_id
→ categorias_gasto.id
```

Opcional:

```text
gastos.actividad_id
→ actividades.id
```

```text
gastos_medios_pago.gasto_id
→ gastos.id
```

```text
gastos_medios_pago.medio_pago_id
→ medios_pago.id
```

```text
gastos_medios_pago.billetera_id
→ billeteras.id
```

---

## Movimientos

Cada detalle genera:

```text
tipo = GASTO
```

con importe:

```text
negativo
```

Referencia:

```text
referencia_tipo = GASTO_MEDIO_PAGO
referencia_id = detalle.id
```

---

# 8. Pantalla Gastos

## Objetivo

Consultar y administrar gastos existentes.

---

## Cabecera

```text
Gastos
```

Acción:

```text
+ Nuevo gasto
```

---

## Listado

Cada registro puede mostrar:

```text
Categoría
Descripción
Actividad
Fecha
Total
```

Ejemplo:

```text
Combustible
Carga YPF
DiDi

02/10/2026

-$20.000
```

---

## Filtros

Puede permitir:

```text
Hoy
Semana
Mes
Personalizado
```

y opcionalmente:

```text
Categoría
Actividad
```

---

# 9. Pantalla Billeteras

## Objetivo

Mostrar dónde se encuentra el dinero disponible.

Debe responder:

```text
¿Cuánto dinero tengo?
¿Dónde está?
```

---

## Resumen superior

Mostrar:

```text
Mi dinero

$690.000
```

Este total representa patrimonio disponible según las billeteras mostradas/activas y la política vigente.

---

## Acciones

```text
Transferir
```

Puede existir también:

```text
Ver movimientos
```

si la UX lo requiere.

---

## Listado

Cada billetera muestra:

```text
Icono
Nombre
Saldo
Moneda
Última conciliación
```

Ejemplo:

```text
Efectivo

$250.000

Última conciliación:
02/10/2026
```

---

## Relaciones

Fuente principal:

```text
billeteras
```

Saldo:

```text
SUM(movimientos_billetera.importe_centavos)
```

por billetera.

---

## Navegación

Seleccionar una billetera:

```text
→ Detalle de billetera
```

---

# 10. Pantalla Detalle de billetera

## Objetivo

Consultar el estado de una billetera y su historial.

---

## Cabecera financiera

Mostrar:

```text
Icono
Nombre
Saldo actual
Última conciliación
```

Ejemplo:

```text
Efectivo

$250.000

Última conciliación:
02/10/2026 · 18:32
```

---

## Acciones

```text
Transferir
Conciliar
```

---

## Filtros rápidos

Ejemplo:

```text
Hoy
Semana
Mes
```

---

## Movimientos

Mostrar movimientos de esa billetera.

Ejemplo:

```text
Ingreso DiDi             +$35.000

Gasto Combustible        -$20.000

Transferencia Galicia   -$100.000

Ajuste caja              -$15.000
```

---

## Regla importante

El saldo mostrado no debe calcularse únicamente sumando los movimientos visibles de la página.

El saldo es una consulta independiente.

El listado puede estar paginado.

---

# 11. Pantalla Transferencia entre billeteras

## Objetivo

Mover dinero internamente entre dos billeteras.

---

## Campos

### Billetera origen

Mostrar:

```text
Icono
Nombre
Saldo
```

---

## Billetera destino

Mostrar:

```text
Icono
Nombre
Saldo
```

---

## Importe

Obligatorio.

```text
importe_centavos > 0
```

---

## Fecha

Predeterminada:

```text
fecha actual
```

---

## Descripción

Opcional.

Ejemplo:

```text
Depósito en cuenta
```

---

## Vista previa

Mostrar antes de confirmar:

```text
Efectivo

-$100.000

↓

Banco Galicia

+$100.000
```

---

## Acción principal

```text
Transferir
```

---

## Persistencia

Genera:

```text
transferencias_billeteras
```

más dos movimientos.

### Origen

```text
TRANSFERENCIA_SALIDA
```

importe negativo.

### Destino

```text
TRANSFERENCIA_ENTRADA
```

importe positivo.

---

## Relaciones

```text
billetera_origen_id
→ billeteras.id
```

```text
billetera_destino_id
→ billeteras.id
```

---

## Validaciones

No permitir:

```text
origen = destino
```

Las monedas deben ser compatibles.

La transferencia:

```text
NO
```

genera ingreso o gasto.

---

# 12. Pantalla Conciliación

## Objetivo

Comparar el saldo calculado por la aplicación con el saldo real informado por el usuario.

---

## Billetera

Mostrar:

```text
Icono
Nombre
```

---

## Saldo calculado

Solo lectura.

Ejemplo:

```text
$65.000
```

---

## Saldo real

Editable.

Ejemplo:

```text
$50.000
```

---

## Diferencia

Cálculo:

```text
saldo_real
-
saldo_calculado
```

Ejemplo:

```text
-$15.000
```

---

## Motivo

Puede permitir seleccionar o ingresar un motivo.

Ejemplo:

```text
Diferencia de caja
```

---

## Observaciones

Opcionales.

---

## Acciones

Cuando existe diferencia:

```text
Registrar movimiento faltante
```

y:

```text
Ajustar diferencia
```

---

## Diferencia cero

Si:

```text
diferencia = 0
```

no generar ajuste financiero.

Puede actualizarse:

```text
conciliado_en
```

---

# 13. Pantalla Registrar movimiento faltante

## Objetivo

Resolver una diferencia de conciliación registrando la operación real que no estaba cargada.

Debe preferirse esto frente a un ajuste cuando el usuario reconoce el origen de la diferencia.

---

## Contexto

Mostrar un mensaje como:

```text
La billetera presenta una diferencia de $15.000.

Podés registrar el movimiento faltante para corregir el saldo.
```

---

## Tipo de movimiento

Según la diferencia y elección del usuario puede permitir:

```text
Gasto
Ingreso
```

---

## Ejemplo gasto faltante

```text
Categoría:
Combustible

Actividad:
DiDi

Billetera:
Efectivo

Importe:
$15.000

Fecha:
02/10/2026
```

---

## Resultado previsto

Mostrar:

```text
Saldo actual calculado:
$65.000

Movimiento:
-$15.000

Nuevo saldo:
$50.000
```

---

## Persistencia

No crear un ajuste si se registra una operación real.

Debe utilizar el mismo flujo normal de:

```text
Ingreso
```

o:

```text
Gasto
```

según corresponda.

---

# 14. Ajuste directo de conciliación

Cuando el usuario no puede identificar un movimiento real, puede registrar un ajuste.

---

## Diferencia negativa

Generar:

```text
AJUSTE_NEGATIVO
```

---

## Diferencia positiva

Generar:

```text
AJUSTE_POSITIVO
```

---

## Relaciones

```text
ajustes_billetera.billetera_id
→ billeteras.id
```

Movimiento:

```text
referencia_tipo = AJUSTE
referencia_id = ajuste.id
```

---

## Regla financiera

Los ajustes:

```text
NO
```

se consideran automáticamente:

```text
Ingreso
Gasto
```

y por tanto no alteran automáticamente la ganancia neta.

---

# 15. Pantalla Actividades

Ruta conceptual:

```text
Ajustes
→ Actividades
```

---

## Objetivo

Administrar fuentes de ingreso, trabajos y proyectos.

---

## Cabecera

```text
Actividades
```

Acción:

```text
Nueva actividad
```

---

## Buscador

Permitir búsqueda por:

```text
nombre
tipo
```

---

## Listado

Cada actividad muestra:

```text
Icono
Nombre
Tipo
Estado
Color
```

Ejemplo:

```text
DiDi
Transporte
Activa
```

```text
Fotografía
Servicios
Activa
```

```text
Pintura departamento
Trabajo temporal
Finalizado
```

---

## Estados

Ejemplos iniciales:

```text
activo
finalizado
archivado
```

---

## Acciones

Puede permitir:

```text
Editar
Activar
Desactivar
Finalizar
Archivar
```

según el estado.

---

## Relaciones

```text
actividades.id
→ ingresos.actividad_id
```

y opcionalmente:

```text
actividades.id
→ gastos.actividad_id
```

---

## Regla histórica

Una actividad utilizada históricamente no debe eliminarse físicamente.

---

# 16. Editor de actividad

Puede implementarse como:

```text
Dialog
Bottom Sheet
Pantalla
```

según complejidad.

Campos:

```text
Nombre
Tipo
Descripción
Icono
Color
Fecha inicio
Fecha fin
Estado
Activo
```

Icono y color deben utilizar los selectores compartidos.

---

# 17. Pantalla Categorías de gastos

Ruta:

```text
Ajustes
→ Categorías de gastos
```

---

## Objetivo

Administrar las categorías utilizadas para clasificar gastos.

---

## Cabecera

```text
Categorías de gastos
```

Acción:

```text
Nueva categoría
```

---

## Listado

Cada categoría muestra:

```text
Icono
Nombre
Descripción
Estado
```

Ejemplo:

```text
Combustible
Transporte y vehículo

Activa
```

```text
Comida
Alimentación

Activa
```

---

## Acciones

```text
Crear
Editar
Activar
Desactivar
```

---

## Relaciones

```text
categorias_gasto.id
→ gastos.categoria_id
```

---

## Regla

Una categoría inactiva no aparece al crear nuevos gastos.

Debe seguir apareciendo en históricos.

---

# 18. Pantalla Medios de pago

Ruta:

```text
Ajustes
→ Medios de pago
```

---

## Objetivo

Configurar cómo se pagan o cobran las operaciones.

---

## Listado

Cada medio muestra:

```text
Icono
Nombre
Billetera predeterminada
Carga rápida
Activo
```

Ejemplo:

```text
Efectivo

Billetera predeterminada:
Efectivo

Carga rápida
```

```text
Transferencia

Billetera predeterminada:
Banco Galicia

Carga rápida
```

---

## Campos configurables

```text
nombre
icono
color
mostrar_en_carga_rapida
orden
billetera_predeterminada_id
activo
```

---

## Regla importante

La billetera predeterminada:

```text
solo precarga operaciones futuras
```

No debe modificar operaciones históricas.

---

## Relaciones

```text
medios_pago.billetera_predeterminada_id
→ billeteras.id
```

Los registros históricos utilizan:

```text
detalle.medio_pago_id
detalle.billetera_id
```

---

# 19. Pantalla Ajustes — Billeteras

Ruta:

```text
Ajustes
→ Billeteras
```

Puede reutilizar parcialmente la pantalla general de Billeteras.

---

## Objetivo

Administrar configuración de billeteras.

---

## Acciones

```text
Crear
Editar
Activar
Desactivar
```

---

## Campos

```text
Nombre
Tipo
Icono
Color
Moneda
Activo
```

---

## Saldo

No permitir editar directamente:

```text
saldo
```

desde el ABM.

Para corregir saldo utilizar:

```text
Conciliación
```

---

# 20. Nueva billetera

Campos:

```text
Nombre
Tipo
Icono
Color
Moneda
Saldo inicial opcional
Fecha del saldo inicial
```

Si se informa saldo inicial:

```text
crear movimiento SALDO_INICIAL
```

No almacenar ese valor como un saldo histórico mutable.

---

# 21. Pantalla Reportes

## Objetivo

Analizar resultado financiero, rentabilidad y patrimonio.

---

## Selector de período

Opciones principales:

```text
Hoy
Semana
Mes
Año
Personalizado
```

Mostrar claramente el período vigente.

Ejemplo:

```text
Octubre 2026
```

---

# 22. Reportes — Resultado

Indicadores principales:

```text
Ingresos
Gastos
Ganancia neta
```

Ejemplo:

```text
Ingresos
$1.250.000

Gastos
$420.000

Ganancia neta
$830.000
```

---

## Fórmula

```text
Ganancia neta
=
Ingresos
-
Gastos
```

Excluir:

- transferencias;
- ajustes.

---

# 23. Reportes por actividad

Mostrar:

```text
Actividad
Ingresos
Gastos
Neto
Porcentaje
```

Ejemplo:

```text
DiDi

Ingresos    $520.000
Gastos      $190.000
Neto        $330.000
```

---

# 24. Reportes por categoría

Mostrar distribución de gastos.

Ejemplo:

```text
Combustible    $180.000
Comida         $90.000
Peajes         $45.000
Mantenimiento  $70.000
```

Puede utilizar:

- barras;
- porcentajes;
- listas.

Evitar gráficos decorativos sin valor informativo.

---

# 25. Reportes por medio de pago

Mostrar distribución según:

```text
medio_pago_id
```

Ejemplo:

```text
Efectivo
Transferencia
Tarjeta
```

No confundir este reporte con patrimonio por billetera.

---

# 26. Reporte patrimonial

Mostrar por separado:

```text
Patrimonio
```

Ejemplo:

```text
Efectivo          $250.000
Mercado Pago      $120.000
Banco Galicia     $320.000

Total             $690.000
```

Este bloque no representa ganancia.

---

# 27. Movimientos internos en reportes

Mostrar cuando corresponda:

```text
Transferencias
Ajustes
```

como información independiente.

No agregarlos a:

```text
Ingresos
Gastos
Ganancia neta
```

---

# 28. Pantalla Ajustes

## Objetivo

Centralizar configuración, catálogos y herramientas generales.

---

## Grupos

### Configuración

```text
Apariencia
Preferencias
```

Notificaciones puede aparecer cuando exista funcionalidad real.

---

## Catálogos

```text
Actividades
Categorías de gastos
Medios de pago
Billeteras
```

---

## Datos

```text
Respaldo
```

Puede incluir:

```text
Exportar
Importar
```

---

## Información

```text
Información de la aplicación
Versión
```

---

## Estilo

No utilizar una única card gigante.

Separar visualmente las secciones.

Consultar:

```text
GUIA_VISUAL.md
→ Ajustes — menú principal
```

---

# 29. Pantalla Apariencia

Ruta:

```text
Ajustes
→ Apariencia
```

---

## Tema

Mostrar:

```text
Sistema
Claro
Oscuro
```

Predeterminado:

```text
Sistema
```

---

## Comportamiento

### Sistema

Sigue la preferencia del sistema operativo.

### Claro

Fuerza modo claro.

### Oscuro

Fuerza modo oscuro.

---

## Color principal

Permitir seleccionar entre una colección controlada de colores compatibles con el sistema visual.

Ejemplo:

```text
Azul
Violeta
Verde
Naranja
Rojo
Rosa
```

No permitir colores que destruyan el contraste.

---

## Vista previa

Mostrar:

```text
Claro
Oscuro
```

como pequeñas previsualizaciones.

La vista previa debe mostrar al menos:

- fondo;
- superficie;
- texto;
- botón;
- color primario.

---

## Persistencia

La preferencia puede almacenarse mediante:

```text
localStorage
```

No es información financiera.

---

# 30. Pantalla Respaldo

Ruta:

```text
Ajustes
→ Respaldo
```

---

## Objetivo

Permitir exportar e importar datos locales.

---

## Acciones

```text
Exportar respaldo
Importar respaldo
```

---

## Exportación

Mostrar información como:

```text
Fecha última exportación
Versión de formato
Versión de aplicación
```

cuando esté disponible.

---

## Importación

Antes de confirmar debe advertir claramente que se modificarán datos locales.

Validar:

- formato;
- versión;
- integridad;
- relaciones.

La operación debe ser transaccional.

---

# 31. Información de aplicación

Ruta:

```text
Ajustes
→ Información
```

Mostrar:

```text
AppBilletera
Versión
Build
Plataforma
```

Ejemplo:

```text
AppBilletera

Versión 0.8.0
```

No mostrar detalles técnicos innecesarios al usuario común.

---

# 32. Estados de carga

Las pantallas con información persistida deben contemplar:

```text
cargando
datos disponibles
vacío
error
```

Preferir:

```text
Skeleton
```

cuando se conoce la estructura visual.

---

# 33. Estados vacíos

Ejemplos:

```text
Todavía no tenés ingresos registrados.
```

```text
No hay gastos para este período.
```

```text
Todavía no creaste billeteras.
```

Puede incluir una acción.

Ejemplo:

```text
Crear billetera
```

---

# 34. Errores

Los formularios deben mantener los datos ingresados cuando ocurre un error recuperable.

Ejemplo:

```text
No se pudo guardar el ingreso.
Intentá nuevamente.
```

No borrar el formulario automáticamente.

No utilizar:

```text
window.alert()
```

como mecanismo principal.

---

# 35. Confirmaciones

Las operaciones cotidianas no deben requerir confirmaciones innecesarias.

No mostrar confirmación para:

```text
Guardar ingreso
Guardar gasto
```

cuando la operación es normal y reversible/editable.

Puede requerirse confirmación para:

- eliminar;
- importar backup;
- acciones destructivas;
- ajustes delicados.

---

# 36. Navegación posterior a guardar

Después de crear un ingreso o gasto, la navegación debe ser predecible.

Puede:

```text
volver al listado
```

o:

```text
volver a Inicio
```

según el flujo desde el que se abrió.

No implementar comportamientos distintos de forma arbitraria.

---

# 37. Preferencias de carga

La aplicación puede recordar:

```text
ultima_actividad_ingreso
ultima_actividad_gasto
ultima_categoria_gasto
```

Solo precargar si el registro continúa:

```text
activo
```

y disponible.

Si fue desactivado, utilizar una alternativa segura.

---

# 38. Carga rápida y billetera

Para cada línea rápida:

```text
Medio de pago
+
Billetera
+
Importe
```

La billetera puede mostrarse explícitamente o mediante selector contextual según UX.

No ocultar de forma que el usuario no pueda cambiarla cuando sea necesario.

---

# 39. Relaciones funcionales generales

```text
ACTIVIDAD
   │
   ├─────────────┐
   │             │
   ▼             ▼
INGRESO        GASTO
   │             │
   │             └── CATEGORÍA
   │
   ▼
DETALLES
```

Ingreso:

```text
INGRESO
   │
   ▼
INGRESOS_MEDIOS_PAGO
   │
   ├── MEDIO DE PAGO
   ├── BILLETERA
   └── IMPORTE
          │
          ▼
MOVIMIENTO_BILLETERA
```

Gasto:

```text
GASTO
   │
   ▼
GASTOS_MEDIOS_PAGO
   │
   ├── MEDIO DE PAGO
   ├── BILLETERA
   └── IMPORTE
          │
          ▼
MOVIMIENTO_BILLETERA
```

---

# 40. Relación de transferencias

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

---

# 41. Relación de conciliación

```text
BILLETERA
    │
    ▼
SALDO CALCULADO

SALDO REAL
    │
    ▼
DIFERENCIA
    │
    ├──────────────┐
    ▼              ▼
MOVIMIENTO       AJUSTE
FALTANTE
```

---

# 42. Diferencia conceptual entre entidades

## Actividad

Responde:

```text
¿De dónde proviene el ingreso o con qué trabajo se relaciona?
```

Ejemplo:

```text
DiDi
Fotografía
Programación
```

---

## Categoría

Responde:

```text
¿En qué se gastó?
```

Ejemplo:

```text
Combustible
Comida
Peaje
```

---

## Medio de pago

Responde:

```text
¿Cómo se pagó o cobró?
```

Ejemplo:

```text
Efectivo
Transferencia
Tarjeta
```

---

## Billetera

Responde:

```text
¿Dónde está o de dónde salió el dinero?
```

Ejemplo:

```text
Efectivo
Banco Galicia
Mercado Pago
```

---

# 43. Responsabilidad visual

Las dimensiones exactas no deben duplicarse en este documento.

Consultar:

```text
docs/GUIA_VISUAL.md
```

para:

- alturas;
- radios;
- sombras;
- paddings;
- colores;
- tipografía;
- responsive.

Este documento define estructura y comportamiento.

---

# 44. Modo claro y oscuro

Todas las pantallas descritas en este documento deben funcionar en:

```text
Sistema
Claro
Oscuro
```

No existen versiones funcionales separadas.

Ejemplo:

```text
Inicio claro
Inicio oscuro
```

son la misma:

```text
PaginaInicio
```

renderizada mediante diferentes temas.

---

# 45. Componentes compartidos

Antes de crear un nuevo componente, revisar:

```text
src/shared/components/
```

Especialmente:

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

No duplicar comportamiento visual que ya existe.

---

# 46. Regla de consistencia

Una misma acción debe verse y comportarse de manera consistente.

Ejemplo:

```text
Guardar ingreso
Guardar gasto
```

deben compartir:

- altura;
- radio;
- ubicación;
- jerarquía;
- estados loading/disabled.

La diferencia visual puede ser semántica.

---

# 47. Regla de historial

Las pantallas históricas deben mostrar correctamente registros aunque actualmente:

- la actividad esté inactiva;
- la categoría esté inactiva;
- el medio de pago esté inactivo;
- la billetera esté inactiva;
- haya cambiado el icono;
- haya cambiado el color;
- haya cambiado la billetera predeterminada.

No reinterpretar operaciones antiguas utilizando configuración actual.

---

# 48. Regla de rendimiento

Las pantallas no deben cargar historiales completos para calcular totales.

Ejemplo incorrecto:

```ts
const movimientos = await obtenerTodos();
const saldo = movimientos.reduce(...);
```

Las agregaciones deben resolverse en:

```text
repositorios
persistencia
consultas específicas
```

Los listados pueden paginarse independientemente del total mostrado.

---

# 49. Regla de trazabilidad

Desde una pantalla de movimiento debe ser posible, cuando corresponda, identificar su origen.

Ejemplo:

```text
Movimiento
Ingreso DiDi
+$35.000
```

puede enlazar o resolver:

```text
Ingreso
→ detalle de medio de pago
→ actividad
```

Esto no obliga a mostrar internamente UUID u otros datos técnicos al usuario.

---

# 50. Regla final

Cada pantalla debe responder claramente:

```text
¿Qué estoy viendo?
¿Qué dato es el más importante?
¿Qué puedo hacer acá?
¿Qué cambia si ejecuto esa acción?
```

La interfaz debe priorizar las operaciones frecuentes y mantener separadas:

```text
Resultado
Patrimonio
Movimientos internos
Configuración
```

No sacrificar integridad financiera por simplificar una pantalla.

No sacrificar facilidad de uso por exponer detalles técnicos innecesarios.

Toda nueva pantalla debe respetar:

```text
AGENTS.md
ARQUITECTURA.md
MODELO_DATOS.md
GUIA_VISUAL.md
PANTALLAS.md
```
---

# 51. Composición y retornos — referencias del 03/10/2026

Esta precisión conserva las acciones y reglas financieras anteriores; los tamaños se encuentran en GUIA_VISUAL.md, sección 91.

- Inicio muestra fecha, resultado diario, accesos de ingreso/gasto, billeteras y movimientos; no necesita repetir el título Inicio debajo de la marca.
- Ingreso y gasto conservan campos y servicios actuales; billetera real por línea siempre visible y editable, aunque una lámina la omita.
- Formularios de ingreso/gasto vuelven a su listado; transferencia al listado de billeteras; detalle al listado; conciliación al detalle; movimiento faltante a conciliación conservando billetera y saldo real.
- Subpantallas de Ajustes vuelven a su menú mediante estado local; no depender de history.back ni crear otro flujo por plataforma.
- Billeteras muestra patrimonio por moneda sin comparativas ficticias. Detalle separa saldo actual del período del listado.
- Conciliación mantiene dos decisiones expresas: operación real faltante o ajuste documentado. Una diferencia cero permite confirmar coincidencia sin ajuste.
- Catálogos mantienen edición y disponibilidad; medios distingue Activo de Carga rápida. La billetera predeterminada solo sugiere nuevas operaciones.
- Reportes alterna actividad, categoría y medio, conserva resultado y patrimonio separados y mantiene los rangos existentes. No muestra variación contra un período que no fue consultado.
- Apariencia conserva una sola elección Sistema/Claro/Oscuro y presenta miniaturas demostrativas identificadas como ejemplo. No añadir switches contradictorios ni controles sin soporte.

La TAREA 066 verificó la base existente con muestras manuales y revisión conceptual. Las TAREAS 067–085 refinan las diferencias de composición; no representan autorización de funcionalidades nuevas ni de tests.

## Refinamiento visual de Nuevo ingreso — TAREA 087

Mantener el orden Actividad, Fecha, Descripción opcional, Observaciones opcionales, Medios de cobro, Total y Guardar ingreso. Las etiquetas se muestran sobre los controles; cada medio incluye importe y billetera real visible y editable. La acción de guardar es azul y el total usa verde semántico. La referencia visual no modifica las validaciones ni la persistencia. Moneda y agregar/quitar medios siguen disponibles.

Por instrucción posterior del usuario, Fecha y Descripción comparten fila desde 390 px y se apilan en el ancho mínimo. Se compactan rellenos y medios de cobro, manteniendo las billeteras reales visibles y controles de al menos 48 px.

Referencia final de ingreso: medios agrupados en una sola lista con selector de billetera real en texto bajo cada nombre e importe a la derecha. TOTAL INGRESO se integra en el bloque de cobros. Moneda y agregar/quitar medios se conservan en Opciones de medios y moneda. Descripción sigue siendo opcional, aunque la etiqueta se abrevie.

## Refinamiento de Nuevo gasto — TAREA 088

Categoría y descripción obligatorias, actividad y observaciones opcionales, fecha obligatoria. Etiquetas sobre los campos, con fecha y descripción apiladas. Cada tarjeta de medio de pago conserva importe exacto y billetera real editable en texto debajo. Más y Agregar otro medio de pago abren opciones de medios reales, moneda y retirada de distribuciones. TOTAL GASTO y Guardar gasto usan rojo semántico; no modificar cálculos, validaciones o persistencia para reproducir la referencia.

Corrección de Gasto autorizada: Fecha y Descripción en una fila desde 390 px; medios de pago en lista única con divisores y selector de billetera real en texto bajo el nombre, como Ingreso. En anchos menores se conserva la alternativa apilada.

## Listas de operaciones — TAREA 89

Todos muestra Todos los períodos; Este mes y Mes anterior aplican fechas locales inclusivas; Personalizar permite fechas, actividad y categoría en Gastos. Búsqueda por descripción y nombres de actividad/categoría antes de paginar. Resumen y subtotales mensuales corresponden a todas las coincidencias, separados por moneda; nunca son la suma parcial de la página. Las distribuciones se consultan solo para las operaciones visibles y conservan la billetera histórica, con etiqueta de legado si falta. No incluyen transferencias ni ajustes. Permanecen edición y eliminación lógica confirmada.

## Reportes — actualización TAREA 90

La composición de cinco pestañas sustituye el selector único de desglose, conservando todos los rangos y la rentabilidad. Comparar Mes con el mes calendario anterior y Año con el año calendario anterior; otros rangos con el rango inmediatamente anterior de igual duración. Sin porcentaje cuando la base es cero o negativa. Evolución de seis meses de calendario hasta el mes de fin, rotulada independientemente del período elegido. Separar monedas; patrimonio actual y movimientos internos son información independiente de ingresos/gastos/ganancia. Mostrar transferencias y ajustes positivos/negativos separados, sin total combinado. Movimientos recientes no se presentan como limitados al período. La selección de otro mes y las comparativas quedan autorizadas por esta referencia y prevalecen sobre su exclusión visual anterior.


### Corrección visual de Reportes — 04/10/2026

Continuación de TAREA 90 en su misma rama: acercar la composición a la referencia c880b95b. Cabecera móvil única con título y mes; tarjetas y accesos patrimoniales compactos; comparación con indicador semántico; eje monetario graduado; anillo y leyenda contiguos cuando el ancho lo permita. Mantener centavos, datos reales, fechas accesibles, alternativas textuales y separación de transferencias/ajustes. No crear opciones de gráfico ficticias. Validar visualmente y compilar, sin tests ni merge automático.
