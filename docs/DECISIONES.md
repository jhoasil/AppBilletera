# Decisiones

| Decisión vigente | Motivo |
| --- | --- |
| Un frontend para Web/PWA, Android e iOS/iPadOS | Compartir pantallas y reglas sin duplicar aplicaciones. |
| React, TypeScript, Vite, Material UI y Capacitor | Mantener el stack definido y una interfaz adaptable. |
| pnpm con archivo de bloqueo único | Instalar dependencias reproducibles sin mezclar gestores. |
| IndexedDB en Web y SQLite en nativo | Persistencia local tras contratos comunes y selección central. |
| Repositorios portables en `database/repositories` | Separar operaciones de negocio del contexto físico del motor. |
| Validación declarativa compartida | Aplicar los mismos tipos, FK y restricciones en ambos motores. |
| Carpetas técnicas en inglés, contenido propio en español | Respetar la excepción solicitada por el usuario y conservar coherencia del negocio. |
| UUID directamente en `id` | Crear identidades offline preparadas para futura sincronización. |
| Dinero en centavos seguros y agregación BigInt | Evitar precisión flotante y detectar desbordamientos. |
| Movimientos como fuente de verdad, sin saldo mutable | Conservar trazabilidad y evitar una caché sin medición. |
| Transferencias y ajustes separados del resultado | Distinguir ganancia, patrimonio y movimientos internos. |
| Edición con borrado lógico y revisión esperada | Preservar historia y rechazar escrituras obsoletas. |
| Conciliación con relectura transaccional | Evitar ajustar sobre un saldo que cambió desde la pantalla. |
| Importación incorporativa con rechazo de conflictos | Recuperar registros sin borrar ni sobrescribir historia existente. |
| Exportación nativa con selector del sistema | Permitir guardar el respaldo sin enviar datos automáticamente. |
| PWA con actualización diferida | Evitar recargar mientras se completa un formulario. |
| Compilación nativa sin service worker | Compartir frontend sin introducir caché PWA en el contenedor. |
| SQLite con versión lógica propia en `_metadatos` | Separar migraciones de negocio de la versión de archivo del plugin. |
| Una rama y commit por tarea; lotes solo por autorización | Mantener trazabilidad de auditoría y alcance controlado. |
| Mantener 0.1.0 y cambios sin publicar | No cerrar versiones ni crear tags automáticamente. |
| No generar ni ejecutar tests hasta nueva autorización | La fase siguiente comienza en tarea 051 y queda fuera del lote actual. |

La compilación Android utiliza JDK 21. La preparación de iOS se generó y sincronizó en Windows, pero su compilación requiere macOS/Xcode. La revisión visual por tamaño no sustituye la validación en dispositivos físicos.
