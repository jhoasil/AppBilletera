# Estrategia de saldos

`movimientos_billetera` es la fuente de verdad. El saldo registrado comprende todos los movimientos vigentes, incluso los que tienen una fecha futura. Para reconstruir un corte histórico se suman solamente movimientos con `fecha <= hasta`, usando el índice compuesto `por_billetera_fecha` y un extremo inclusivo en ISO UTC. Los filtros del detalle no alteran el saldo actual.

IndexedDB recorre el índice y acumula centavos con BigInt. No materializa el historial: la memoria depende del tamaño de página y del catálogo. Los reportes recorren las operaciones del período y consultan sus detalles con índices de referencia; no acumulan identificadores de todas las operaciones. Las escrituras y los borrados lógicos actualizan movimientos en la misma transacción que su operación.

No se agrega `saldo_actual_centavos`: no hay una medición que justifique duplicar el estado y todas las rutas de invalidación. La conciliación vuelve a calcular el saldo dentro de su transacción para detectar lecturas antiguas.

Si el volumen futuro lo requiere, `saldos_billetera_periodo` podrá guardar una proyección por `(billetera_id, moneda, periodo)` con saldo de apertura, entradas, salidas, saldo de cierre y revisión de movimientos. Un cambio retroactivo invalida ese período y los posteriores. La proyección será reconstruible, nunca una nueva fuente de verdad; su implementación requerirá medición previa y una migración versionada. No se crea esa tabla en V1.
