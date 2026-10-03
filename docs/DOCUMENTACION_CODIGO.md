# Documentación interna

La tarea 049 revisó funciones, métodos y firmas propios mediante inspección sintáctica de TypeScript/TSX. Se completó JSDoc en callbacks de presentación, selectores, consultas SQL, validación de respaldos, contratos de pantalla y configuración de Vite. Los métodos de plantillas externas de Capacitor y las APIs de bibliotecas conservan su nomenclatura y documentación original.

Las once tablas documentan su finalidad en `v1.ts`; los índices documentan el motivo de cada consulta en `indicesV1.ts`. Los comentarios explican centavos enteros, FK históricas, borrado lógico, transacciones y conciliaciones. IndexedDB prohíbe esperas externas durante una transacción; SQLite usa una conexión y desactiva transacciones automáticas en cada escritura interna para evitar anidamiento.

Los saldos se reconstruyen desde movimientos vigentes. Las transferencias generan dos efectos compensados y los ajustes se mantienen separados del resultado. La única preparación cacheada es la promesa de apertura, que se libera si falla; no existe una caché financiera persistida. La estrategia futura está en `SALDOS_HISTORICOS.md`.

Esta tarea solo modifica documentación y comentarios; no cambia comportamiento ni genera o ejecuta tests.
