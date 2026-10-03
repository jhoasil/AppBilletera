# AppBilletera

Aplicación personal para administrar actividades, ingresos, gastos y billeteras, con carga rápida, persistencia local y trazabilidad.

Versión de desarrollo: **0.1.0**, sin publicación ni tag. Implementación funcional completada hasta la tarea **050**. Web/PWA usa IndexedDB; Android e iOS/iPadOS comparten el mismo frontend mediante Capacitor y usan SQLite.

## Funciones disponibles

- Catálogos de actividades, categorías, medios de pago y billeteras desde Ajustes.
- Ingresos y gastos con distribuciones por medio, edición y borrado lógico.
- Saldos iniciales, transferencias, conciliación y ajustes positivos o negativos.
- Inicio con resultado diario, billeteras y últimos movimientos.
- Reportes por período, rentabilidad por actividad y patrimonio por moneda.
- Apariencia Sistema/Claro/Oscuro e información central de versión y build.
- Respaldo JSON versionado con validación de integridad e importación transaccional.
- PWA instalable y proyectos nativos Android/iOS.

## Desarrollo

Requisitos: Node.js 22.12 o posterior y pnpm 11.19.0, fijado en `package.json`. Sin backend ni servicios cloud.

```sh
pnpm install --frozen-lockfile
pnpm desarrollo
```

| Comando | Finalidad |
| --- | --- |
| `pnpm verificar-tipos` | Comprobar TypeScript sin emitir archivos. |
| `pnpm compilar` | Verificar tipos y generar Web/PWA en `dist`. |
| `pnpm previsualizar` | Servir la compilación Web localmente. |
| `pnpm compilar:nativo` | Generar el frontend sin service worker para Capacitor. |
| `pnpm capacitor sync android` | Sincronizar frontend y plugins Android. |
| `pnpm capacitor sync ios` | Sincronizar frontend y paquetes iOS. |

Las rutas usan fragmentos, por ejemplo `#/inicio`, `#/ingresos?nuevo=1` y `#/billetera?id=UUID`. Los datos financieros permanecen en la base local; localStorage contiene solo preferencias de interfaz.

## Estado de verificación

Compilación Web/PWA y nativa, TypeScript y sincronización de ambas plataformas verificados. El APK debug Android se compiló con JDK 21; sus archivos quedan fuera de Git. iOS/iPadOS requiere macOS y Xcode y no se compiló en este equipo Windows. La revisión visual cubrió anchos móvil, tablet y escritorio, con apariencia clara y oscura. No se ejecutaron tests ni se verificó funcionamiento en dispositivos físicos.

La importación incorpora registros faltantes y acepta registros idénticos; rechaza conflictos sobre el mismo UUID sin sobrescribir historia. El respaldo contiene información financiera: el usuario elige dónde conservarlo. No hay conversiones de moneda ni sincronización entre dispositivos.

## Documentación

- [Reglas de trabajo](AGENTS.md) y [plan de tareas](docs/TAREAS_CODEX.md).
- [Producto](docs/PRODUCTO.md), [arquitectura](docs/ARQUITECTURA.md) y [modelo de datos](docs/MODELO_DATOS.md).
- [Decisiones](docs/DECISIONES.md), [versionado](docs/VERSIONADO.md) e [historial](CHANGELOG.md).
- [Saldos históricos](docs/SALDOS_HISTORICOS.md) y [auditoría de arquitectura](docs/AUDITORIA_ARQUITECTURA.md).
- [PWA](docs/PWA.md), [Capacitor](docs/CAPACITOR.md), [Android](docs/ANDROID.md) e [iOS/iPadOS](docs/IOS.md).
- [Revisión visual](docs/REVISION_VISUAL.md), [nomenclatura](docs/NOMENCLATURA.md) y [documentación interna](docs/DOCUMENTACION_CODIGO.md).

Cada tarea se desarrolla en `task_AA/NNN_descripcion_de_la_tarea` y tiene su commit. La autorización de este lote termina en 050. No se generan ni ejecutan tests durante el desarrollo inicial; la tarea 051 requiere una nueva instrucción.
