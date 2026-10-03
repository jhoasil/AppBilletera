# Versionado de AppBilletera

AppBilletera utiliza Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Ejemplo:

```text
0.4.2
```

---

# Desarrollo inicial

Estado después de la tarea 050: `package.json` conserva **0.1.0**. Los cambios funcionales permanecen en «Sin publicar» de `CHANGELOG.md`; el lote no cierra una versión, crea tags ni autoriza push.

La información de pantalla proviene de `app/informacionAplicacion.ts`. Vite lee la versión de `package.json` e incorpora la compilación desde `APP_BUILD`, o muestra `desarrollo` si no se define. En PowerShell puede usarse `$env:APP_BUILD = '1'` antes de compilar; no cambia la versión ni publica artefactos.

Android lee `versionName` directamente de `package.json` desde Gradle y mantiene `versionCode = 1`. iOS mantiene `MARKETING_VERSION = 0.1.0` y `CURRENT_PROJECT_VERSION = 1`, usados por Info.plist. Al preparar una publicación se coordinan números de compilación, `APP_BUILD` y metadatos nativos según el procedimiento de cierre; no se incrementan durante tareas ordinarias.

Mientras la aplicación no sea estable utilizar:

```text
0.x.x
```

---

# Hitos sugeridos

```text
0.1.0
Base del proyecto, arquitectura y tema.

0.2.0
Catálogos, actividades y billeteras.

0.3.0
Ingresos, gastos y movimientos.

0.4.0
Transferencias, conciliación y saldos.

0.5.0
Inicio, reportes y rentabilidad.

0.6.0
Respaldo y PWA.

0.7.0
Android e iOS.

0.8.0
Revisión visual, arquitectura y documentación.

0.9.0
Tests y candidata a release.

1.0.0
Primera versión estable.
```

Estos números representan hitos.

No incrementar versión después de cada tarea.

---

# MAJOR

Incrementar cuando exista un cambio incompatible importante.

Ejemplo:

```text
1.5.0
→
2.0.0
```

---

# MINOR

Incrementar al agregar una funcionalidad compatible importante.

Ejemplo:

```text
0.4.0
→
0.5.0
```

---

# PATCH

Incrementar para correcciones compatibles.

Ejemplo:

```text
0.5.0
→
0.5.1
```

---

# package.json

La versión principal de AppBilletera estará en:

```json
{
  "version": "0.1.0"
}
```

---

# Android

Utilizar:

```text
versionName
```

igual a la versión SemVer.

Ejemplo:

```text
versionName = 0.7.0
```

Utilizar también:

```text
versionCode
```

como entero siempre creciente.

Ejemplo:

```text
versionCode = 23
```

---

# iOS

Utilizar:

```text
CFBundleShortVersionString
```

igual a SemVer.

Ejemplo:

```text
0.7.0
```

Utilizar:

```text
CFBundleVersion
```

como número de compilación creciente.

---

# Tags Git

Versiones publicadas:

```text
v0.1.0
v0.5.0
v1.0.0
```

No crear tags automáticamente.

Solo hacerlo cuando el usuario solicite cerrar una versión.

---

# CHANGELOG

Mantener:

```text
CHANGELOG.md
```

Formato:

```text
## [0.4.0]

### Agregado

- Transferencias entre billeteras.
- Conciliación de saldos.
- Ajustes positivos y negativos.

### Modificado

- Mejora de carga rápida.

### Corregido

- ...
```

---

# Cierre de versión

Codex no debe cerrar versiones automáticamente.

Cuando el usuario solicite preparar una versión, informar primero:

```text
Versión actual:
Versión propuesta:
Tipo de cambio:
Motivo:
```

Después realizar:

1. actualizar package.json;
2. actualizar CHANGELOG.md;
3. actualizar Android;
4. actualizar iOS;
5. commit:

```text
chore(release): prepara version X.Y.Z
```

6. tag:

```text
vX.Y.Z
```

No hacer este proceso sin autorización explícita.
