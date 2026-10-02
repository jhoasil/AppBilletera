# Historial de cambios

## [Sin publicar]

### Agregado

- Preferencias de las últimas selecciones, formularios rápidos de ingreso y gasto con conversión exacta a centavos y detalles positivos.
- Persistencia transaccional y ABM de ingresos y gastos con filtros, edición, borrado lógico y reemplazo auditado de movimientos.
- Transferencias entre billeteras de la misma moneda, con entrada y salida atómicas sin modificar el resultado.
- Consulta de patrimonio por moneda y detalle de billetera con saldo actual, movimientos paginados y filtros de período.
- Índices financieros y persistencia IndexedDB con migraciones, validaciones y transacciones atómicas.
- Datos iniciales insertados una sola vez sin reemplazar las personalizaciones del usuario.
- Ajustes con administración paginada de medios de pago, categorías, actividades y billeteras.
- Selectores visuales de Material Icons y colores para actividades y billeteras.
- Trabajos temporales mediante Actividad, con fechas y estados activo, finalizado y archivado.
- Saldo inicial opcional al crear o configurar una billetera, registrado una sola vez como movimiento SALDO_INICIAL.

### Modificado

- Nomenclatura arquitectónica de `app` y `shared` completada en inglés; módulos del negocio y contenido propio conservados en español.
- Subcarpetas técnicas de `core` y `database` con nombres convencionales en inglés; sus archivos y contenido permanecen en español.
- Carpetas principales de `src` en inglés (`app`, `database`, `shared`, `modules`, `core`), con importaciones y documentación actualizadas; su contenido propio permanece en español.
- Carga de Ajustes bajo demanda para reducir el paquete inicial.
- Protección de la moneda de billeteras con historial de movimientos.

Las tareas 011 a 030 no cierran una versión ni crean un tag. La conciliación, los reportes y los resúmenes de Inicio siguen pendientes de sus tareas respectivas.

## [0.1.0]

### Agregado

- Migración declarativa V1 con once tablas, relaciones, restricciones y diagrama de entidades.
- Abstracción de base local con ciclo de vida, migraciones, transacciones y puntos de integración Web y Nativo.
- Ocho contratos de repositorios independientes del motor, con paginación, borrado lógico y consulta de saldos.
- Manejo seguro de centavos, suma y resta por moneda y formateo visual separado sin pérdida de precisión.
- Once entidades de dominio TypeScript documentadas, con identidad UUID, auditoría y relaciones financieras.
- Componentes visuales compartidos para cabeceras, resúmenes, importes, estados vacíos, catálogos, acciones y movimientos.
- Navegación inferior móvil, lateral de escritorio y páginas provisionales con acceso a Ajustes.
- Apariencia de sistema, clara y oscura con preferencia guardada en localStorage.
- Material UI y Material Icons con tema central, paleta, tipografía y estilos compartidos.
- Base ejecutable React + TypeScript + Vite con TypeScript estricto y pnpm.
- Estructura inicial de carpetas y comandos de desarrollo, tipos y compilación.
- Documentación inicial del producto, arquitectura, modelo conceptual y decisiones.
- Reglas de trabajo, plan de tareas y política de versionado.
- Exclusiones de Git para dependencias, compilaciones, archivos temporales y privados.

Esta versión identifica la base inicial del proyecto; no constituye una publicación ni incluye funcionalidades financieras implementadas.
