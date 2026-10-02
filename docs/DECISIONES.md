# Decisiones iniciales

Estas decisiones documentan las reglas del proyecto; su implementación se realizará en las tareas correspondientes.

| Decisión | Motivo |
| --- | --- |
| Una base de código para todas las plataformas | Compartir pantallas y reglas, encapsulando diferencias en adaptadores. |
| React, TypeScript, Vite, Material UI y Capacitor | Utilizar el stack definido para el proyecto. |
| pnpm como único gestor | Mantener un único archivo de bloqueo y evitar gestores mezclados. |
| Persistencia local y funcionamiento offline | Permitir registrar y consultar sin conexión ni backend inicial. |
| IndexedDB en Web y SQLite en nativo | Separar los motores mediante contratos de repositorios. |
| Nomenclatura y documentación en español | Mantener coherencia; conservar nombres de APIs y tecnologías externas. |
| UUID directamente en `id` | Crear identidades offline preparadas para futura sincronización. |
| Dinero en enteros de centavos, inicialmente ARS | Evitar errores de precisión de punto flotante. |
| Movimientos como fuente de verdad del saldo | Conservar trazabilidad y reconstruir cualquier caché futura. |
| Transferencias y ajustes separados del resultado | Distinguir ingresos y gastos de movimientos patrimoniales. |
| Borrado lógico y operaciones transaccionales | Conservar historia e impedir registros financieros parciales. |
| Versión inicial 0.1.0 sin tag | Registrar el inicio sin cerrar ni publicar una versión automáticamente. |
| Una tarea y un commit por ejecución | Mantener cambios acotados y revisables. |
| Tests reservados para las tareas específicas | Respetar la generación en TAREA 51 y ejecución solo con autorización. |

La selección de versiones de dependencias y la creación de package.json corresponden a la preparación de la aplicación en la TAREA 01.
