# AppBilletera

Aplicación personal para administrar actividades, ingresos, gastos y billeteras, con prioridad en la carga rápida, el funcionamiento offline y la trazabilidad.

Versión inicial: **0.1.0**. Estado: aplicación base React + TypeScript + Vite, todavía sin módulos funcionales ni persistencia.

## Plataformas y tecnologías previstas

Una base compartida para Web, PWA, Android, iOS e iPadOS mediante React, TypeScript, Vite, Material UI y Capacitor. Gestor de paquetes: pnpm. Persistencia local: IndexedDB en Web y SQLite en plataformas nativas.

## Documentación

- [Reglas de trabajo](AGENTS.md).
- [Producto](docs/PRODUCTO.md).
- [Arquitectura](docs/ARQUITECTURA.md).
- [Modelo de datos](docs/MODELO_DATOS.md).
- [Decisiones](docs/DECISIONES.md).
- [Versionado](docs/VERSIONADO.md).
- [Plan de tareas](docs/TAREAS_CODEX.md).
- [Historial de cambios](CHANGELOG.md).

## Desarrollo

Requisitos: Node.js 20.19+ o 22.12+ y pnpm 11.19.0, fijado en `package.json`. Se recomienda Node.js 24 LTS.

```sh
pnpm install --frozen-lockfile
pnpm desarrollo
```

Comandos disponibles:

- `pnpm verificar-tipos`: comprueba TypeScript estricto sin emitir archivos.
- `pnpm compilar`: verifica tipos y genera la aplicación en `dist/`.
- `pnpm previsualizar`: sirve localmente la compilación generada.

Ejecutar solamente la tarea solicitada en su rama `codex/NNN` y finalizar con su commit. No generar ni ejecutar tests durante la preparación y el desarrollo inicial.
