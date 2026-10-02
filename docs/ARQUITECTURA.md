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
