# iOS e iPadOS

`ios/App` contiene el proyecto Xcode compartido para iPhone e iPad (`TARGETED_DEVICE_FAMILY = 1,2`). Capacitor 8 utiliza Swift Package Manager; `CapApp-SPM/Package.swift` incorpora Capacitor y el plugin SQLite. El mismo adaptador SQLite de Android se selecciona al ejecutar en iOS, con migraciones, FK y transacciones comunes. No hay una UI ni lógica financiera separadas.

Requisitos: macOS, Xcode compatible con [Capacitor 8](https://capacitorjs.com/docs/getting-started/environment-setup), herramientas de línea de comandos y Node/pnpm. La plantilla establece iOS 15 como versión mínima. Una cuenta de desarrollador y firma serán necesarias para distribución, pero no se agregan credenciales ni certificados al repositorio.

En macOS, desde la raíz:

```sh
pnpm install
pnpm compilar:nativo
pnpm capacitor sync ios
pnpm capacitor open ios
```

En Xcode, resolver los paquetes SPM y elegir un simulador o dispositivo. Para un dispositivo físico, seleccionar un equipo de firma propio. El nombre visible es AppBilletera y la versión inicial coincide con `package.json`; el número de build es 1. Al cerrar una versión se actualizan los valores según `VERSIONADO.md`.

El proyecto y la sincronización se generaron desde Windows. No se dispone de Xcode/macOS aquí: no se compiló ni ejecutó el contenedor iOS, y no se ejecutaron tests. El layout adapta sus áreas seguras y anchos de pantalla sin depender del dispositivo.
