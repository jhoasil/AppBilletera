# Arquitectura

## Separación de responsabilidades

Presentación → aplicación y servicios → dominio → contratos de repositorios → infraestructura → IndexedDB o SQLite.

La presentación consume servicios y nunca accede directamente a los motores de persistencia. El dominio contiene las entidades y reglas financieras. Los contratos permiten intercambiar adaptadores sin exponer diferencias de plataforma a las capas superiores.

## Tecnologías previstas

React, TypeScript estricto y Vite para la aplicación; Material UI y Material Icons para la interfaz; Capacitor para plataformas nativas; pnpm para dependencias. IndexedDB en Web y SQLite en Android, iOS e iPadOS.

Estructura inicial creada en la TAREA 001; las carpetas de dominio, persistencia, módulos y recursos compartidos permanecen reservadas para tareas posteriores:

```text
src/
    app/
    nucleo/
    base-datos/
    modulos/
    compartido/
```

## Componentes visuales compartidos

Los componentes visuales reutilizables están en `src/compartido/componentes/`: `CabeceraPagina`, `TarjetaResumen`, `CampoImporte`, `EstadoVacio`, `SelectorCatalogo`, `BotonAccion` y `ListaMovimiento`. Reciben propiedades y eventos desde los módulos, usan el tema y no acceden a persistencia. Los importes de entrada permanecen como texto y los resúmenes y movimientos reciben valores ya preparados; el cálculo y la conversión monetaria corresponden a tareas de dominio posteriores.

## Persistencia e integridad

Los ocho contratos están en `src/nucleo/repositorios/`. Son interfaces asíncronas sin dependencias de React, IndexedDB o SQLite. Las consultas requieren límite positivo y desplazamiento no negativo, que los adaptadores deberán validar. Los catálogos se ordenan por nombre e id ascendentes; los medios de pago, por orden, nombre e id. Las operaciones y movimientos se ordenan por fecha descendente e id ascendente. Las consultas excluyen registros eliminados salvo petición explícita; obtener por id devuelve `null` para registros inexistentes o eliminados. Los errores de escritura se comunican rechazando la promesa; eliminar un registro inexistente no tiene efecto.

Guardar ingresos o gastos incluye sus detalles: una edición reemplaza el conjunto vigente y conserva los anteriores mediante borrado lógico. Las operaciones con movimientos se coordinarán en una misma transacción desde la infraestructura de la TAREA 009; los contratos no abren transacciones independientes que impidan esa coordinación. El repositorio de movimientos devuelve saldos enteros seguros en centavos, calcula en persistencia y rechaza desbordamientos. No se implementan motores ni servicios financieros en la TAREA 008.

La infraestructura administra inicialización, migraciones versionadas, transacciones y cierre. Guardar cada operación financiera y sus movimientos de billetera de forma atómica. Mantener identidades UUID locales y borrado lógico para conservar la historia.

La coordinación está en `src/base-datos/BaseLocal.ts`, con el puerto `AdaptadorBaseLocal` y puntos de integración Web y Nativo. El motor físico se inyecta explícitamente; todavía no hay implementación de IndexedDB ni SQLite. Las migraciones comienzan en uno, son consecutivas y se aplican después de leer la versión persistida. Una base más reciente se rechaza para evitar degradaciones. Cada cambio y su versión deben confirmarse atómicamente por el adaptador; si uno falla, se cierra la conexión y se conservan las migraciones anteriores confirmadas.

Las operaciones se encolan para proteger apertura, transacciones y cierre. Cada transacción declara recursos y modo de acceso y entrega un contexto común a futuros repositorios; el adaptador confirma o revierte antes de resolver la promesa. El cierre espera las operaciones previas, es repetible y permite reinicializar. No llamar a `BaseLocal` desde su propia transacción o migración: los repositorios deben utilizar el contexto recibido, sin transacciones anidadas. En IndexedDB, ese contexto deberá respetar la vida útil de la transacción y evitar esperas externas; las migraciones se ejecutarán en el contexto de actualización de esquema. La coordinación no se conecta todavía a la interfaz ni crea repositorios físicos.

Los movimientos de billetera son la fuente de verdad del saldo. Resolver consultas y agregaciones en persistencia, evitando cargar toda la historia en la interfaz. Una caché futura debe ser reconstruible; los cierres por período se evaluarán cuando sean necesarios.

## Preferencias y evolución

Usar localStorage únicamente para preferencias de interfaz, como apariencia y últimos valores utilizados. Los datos financieros permanecen en la base local. Preparar identidades para futura sincronización sin implementar servicios cloud en esta etapa.

## Persistencia Web

El adaptador IndexedDB está en `src/base-datos/web/`. La versión física es la versión lógica más uno: IndexedDB 1 representa una base vacía y IndexedDB 2 el esquema V1. Las migraciones crean almacenes e índices dentro de versionchange y las transacciones resuelven después de oncomplete. Los errores abortan todas sus escrituras. Las referencias y restricciones se validan en la misma transacción; los componentes solo consumirán servicios. Los catálogos pequeños pueden ordenarse en la capa de persistencia; los movimientos financieros deberán recorrerse mediante sus índices, sin materializar toda la historia.

## Datos iniciales

Los datos sugeridos se insertan una sola vez, en una transacción común con la marca `datos_iniciales_v1` del almacén técnico `_metadatos`. Editar, desactivar o renombrar un catálogo no vuelve a crear sus valores sugeridos. `_metadatos` no es una entidad de negocio ni contiene datos financieros. Una instalación nueva crea DiDi, Uber, seis categorías, tres medios de pago y la billetera Efectivo; únicamente Efectivo recibe esa billetera predeterminada.

## Catálogos y saldo inicial

Los cuatro catálogos se administran desde Ajustes mediante servicios, con paginación de veinte registros, auditoría y activación sin borrar referencias históricas. Los trabajos temporales utilizan la misma entidad Actividad: `tipo = trabajo_temporal`, fechas opcionales y estados activo, finalizado o archivado. El estado del trabajo y su disponibilidad en catálogos son propiedades independientes. Se rechaza una fecha de fin anterior al inicio.

El saldo inicial es un movimiento `SALDO_INICIAL` con referencias nulas, UUID y centavos enteros firmados. El importe acepta coma o punto decimal, hasta dos decimales y ningún separador de miles; se convierte mediante BigInt antes de comprobar el rango seguro. Cero representa una apertura explícita sin importe; un valor negativo permite iniciar con deuda. Dejar el campo vacío al crear una billetera no genera movimiento y permite configurarlo después.

Crear una billetera con saldo inicial guarda ambos registros en una transacción. Configurar una existente comprueba que esté activa y que no exista ningún saldo inicial previo, incluso eliminado lógicamente. La comprobación recorre solamente el índice de esa billetera y queda en la misma transacción de escritura, evitando duplicados entre pestañas. No se modifica el movimiento inicial desde el ABM: las correcciones corresponderán a las tareas de conciliación. Una billetera con cualquier historial conserva su moneda.

La fecha elegida se interpreta como medianoche en la zona horaria del dispositivo y se persiste como instante ISO UTC; la validación del día calendario es independiente de la zona horaria. Las fechas de auditoría también son UTC. El modelo no guarda un atributo de saldo mutable ni cuenta el saldo inicial como ingreso o rentabilidad.

## Operaciones financieras y carga rápida

Los formularios consumen servicios de aplicación y comparten controles, conversión a centavos y cálculo del total. Los campos vacíos equivalen a cero; no se permiten importes negativos en detalles ni un total cero. Las distribuciones persistidas son estrictamente positivas. Cada medio puede utilizar una billetera de la misma moneda o ninguna: un detalle sin billetera forma parte del ingreso o gasto, pero no modifica patrimonio. Los catálogos se administran exclusivamente desde Ajustes.

El servicio de preferencias UI conserva únicamente los UUID `ultima_actividad_ingreso`, `ultima_actividad_gasto` y `ultima_categoria_gasto`. Solo precarga identidades disponibles y recuerda las selecciones después de confirmar la operación. Si localStorage está bloqueado o contiene datos inválidos, la operación financiera continúa normalmente. Los importes y operaciones permanecen en IndexedDB.

Los repositorios de ingresos y gastos escriben cabecera, detalles y movimientos en una transacción común. La creación vuelve a comprobar catálogos activos y monedas dentro de la escritura. Una edición puede mantener referencias históricas inactivas; invalida detalles y movimientos anteriores mediante borrado lógico y crea nuevas distribuciones con UUID distintos. La cabecera conserva su UUID y fecha de creación. El borrado lógico invalida todos los efectos juntos. La versión `actualizado_en` esperada se comprueba dentro de la transacción para rechazar ediciones obsoletas de otra pestaña; la fecha de actualización avanza al menos un milisegundo respecto de la versión anterior.

Una transferencia registra una cabecera y dos movimientos de igual magnitud y signos opuestos, en billeteras distintas de la misma moneda. No escribe ingresos ni gastos y no genera conversiones monetarias. Se permiten saldos negativos; no existe una regla de fondos suficientes en V1.

## Consultas de patrimonio y movimientos

Las consultas de billeteras agregan centavos con BigInt en persistencia mediante `movimientos_billetera(billetera_id, fecha)`. No materializan los movimientos ni los entregan al componente para sumar. El resultado debe caber en un entero seguro. Los totales se agrupan por moneda e incluyen billeteras inactivas para no ocultar patrimonio conservado.

La página de billeteras obtiene catálogo, saldos y totales en una única transacción de lectura. El detalle obtiene billetera, saldo actual y página de movimientos también en una única instantánea, evitando mezclar valores durante transferencias o ediciones concurrentes. Cada consulta de operaciones o movimientos conserva solamente la página solicitada, ordenada por fecha descendente y UUID ascendente. El cursor procesa grupos de una fecha sin acumular toda la historia.

Los filtros del detalle incluyen desde la medianoche local del primer día hasta el último milisegundo del día final, respetando cambios de horario del dispositivo. Filtrar movimientos no cambia el saldo actual mostrado. Los cierres periódicos y cachés reconstruibles continúan siendo una posibilidad futura; no se agregan en esta etapa. La acción de conciliación se presenta como pendiente hasta su implementación en la TAREA 031.
