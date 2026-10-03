# Arquitectura

## Responsabilidades y estructura

Presentación → composición de aplicación → servicios y dominio → contratos de repositorios → infraestructura → IndexedDB o SQLite.

Las pantallas consumen servicios y no ejecutan SQL ni solicitudes IndexedDB. Las carpetas de arquitectura técnica usan inglés convencional por decisión del usuario; módulos del negocio, archivos, entidades y contenido propio permanecen en español.

```text
src/
  app/{data,navigation,preferences,theme}/
  core/{entities,money,repositories,services}/
  database/
    adapters/
    contracts/
    data/
    migrations/
    repositories/
    web/
    BaseLocal.ts
    componerBaseLocal.ts
  modules/
    ajustes/catalogos/
    billeteras/
    gastos/
    ingresos/
    inicio/
    reportes/
  shared/{components,dates,money}/
```

`app/data` compone servicios y repositorios. `core` define entidades, centavos exactos, reglas y puertos. `database/repositories` implementa operaciones locales portables. `database/web` contiene exclusivamente el adaptador y contexto IndexedDB; `database/adapters` contiene el motor SQLite y puntos de integración de plataforma. `ContextoDatos` y `RangoConsulta` impiden que los repositorios dependan de APIs de un motor.

## Persistencia y migraciones

`BaseLocal` encola apertura, migraciones, transacciones y cierre. `componerBaseLocal.ts` selecciona SQLite en Capacitor nativo e IndexedDB en Web/PWA. Las migraciones son consecutivas, comienzan en uno y se aplican después de leer la versión persistida; se rechaza una base más reciente. Un fallo conserva migraciones anteriores confirmadas.

IndexedDB usa versión física igual a la lógica más uno: física 1 es una base vacía y física 2 corresponde a V1. El esquema se crea de forma síncrona en `versionchange`. Las transacciones resuelven tras `oncomplete`; un error aborta todas las escrituras. No se esperan operaciones externas, temporizadores, archivos o red dentro de una transacción IndexedDB.

SQLite usa una conexión privada, FK activas y una versión lógica en `_metadatos`, independiente de la versión de archivo del plugin. La creación del esquema y su versión se confirman juntas. El adaptador abre una transacción y las escrituras internas usan `transaction=false` para evitar anidamiento. Los contextos de lectura rechazan escrituras. Los recorridos procesan bloques de 256 registros.

Ambos motores validan las mismas columnas, formatos, enteros, restricciones y FK mediante `validarRegistro`. SQL utiliza valores parametrizados y nombres del esquema conocido. Nunca se eliminan físicamente referencias históricas para actualizar una operación.

## Escrituras financieras

Los ingresos y gastos guardan cabecera, detalles positivos y movimientos en una transacción. Los detalles sin billetera afectan el resultado pero no el patrimonio. Las monedas de cada billetera deben coincidir con la operación.

Una edición conserva el UUID de cabecera, invalida lógicamente detalles y movimientos anteriores y crea nuevas distribuciones auditadas. `actualizado_en` esperado protege contra ediciones obsoletas; la nueva revisión avanza al menos un milisegundo. El borrado lógico invalida todos los efectos juntos. Una referencia histórica inactiva puede conservarse en una edición; las selecciones nuevas deben estar activas.

Las transferencias crean dos movimientos de igual magnitud y signo opuesto en billeteras distintas de la misma moneda, sin escribir ingresos ni gastos. Se permiten saldos negativos; no existe una regla de fondos suficientes.

Un saldo inicial es único por billetera, incluso si se hubiera eliminado lógicamente; puede ser cero o negativo y sus referencias son nulas. Dejarlo vacío al crear una billetera no produce movimiento. Una billetera con historial conserva su moneda.

La conciliación relee el saldo dentro de su transacción y exige que coincida con la instantánea esperada. Si el saldo real coincide, solo marca `conciliado_en`. Una diferencia exige motivo y registra `AjusteBilletera` más un movimiento positivo o negativo, separado de ingresos y gastos. La pantalla permite registrar primero una operación faltante.

## Consultas y saldos

Los movimientos vigentes constituyen la fuente de verdad. Los saldos se agregan con BigInt y se convierten solo si caben en enteros seguros. Los índices delimitan billetera/fecha y operaciones/fecha; la interfaz recibe páginas o grupos agregados, nunca todo el historial para sumar.

El saldo actual incluye todos los movimientos registrados, incluso futuros. Filtrar el detalle por período solo filtra sus movimientos; no cambia ese saldo. Los totales patrimoniales incluyen billeteras inactivas y se separan por moneda. No se implementa conversión de divisas.

Los reportes consultan operaciones del período y sus detalles por índices de referencia; suman resultado y desgloses en un recorrido. La rentabilidad de una actividad descuenta únicamente sus gastos asociados; los gastos sin actividad se muestran separados. Transferencias y ajustes tienen un reporte patrimonial independiente. Inicio conserva únicamente cinco candidatos recientes y cinco billeteras activas.

No hay caché de saldo mutable ni tabla de cierres. La estrategia futura y sus condiciones de invalidación están en `SALDOS_HISTORICOS.md`.

## Interfaz y preferencias

Material UI utiliza tema, tipografía, paletas y foco centrales. La navegación es inferior en móvil y lateral en escritorio; las áreas seguras se respetan en contenedores nativos. Los formularios muestran medios rápidos directamente y mantienen destino sugerido y opciones adicionales accesibles sin crear catálogos fuera de Ajustes.

localStorage contiene modo de apariencia y UUID de últimas selecciones, nunca importes ni operaciones. Las preferencias se recuerdan tras confirmar el guardado; un fallo del almacenamiento no revierte una operación financiera. El esquema sugerido se inserta una sola vez con la marca `datos_iniciales_v1`.

## Respaldo y plataformas

El respaldo JSON versionado exporta una instantánea completa, incluidos registros borrados lógicamente. La importación valida esquema, referencias y efectos financieros antes de escribir; incorpora registros nuevos, conserva idénticos y aborta conflictos. El adaptador de archivo usa descarga Web o Filesystem/Share nativo, con destino elegido por el usuario.

Vite genera Web/PWA con precache del frontend y contenedores nativos sin service worker mediante `compilar:nativo`. Capacitor comparte el mismo frontend con Android e iOS/iPadOS; sus proyectos y plugins se sincronizan desde la raíz. No hay backend, sincronización cloud ni dependencias de plataforma en el dominio.
