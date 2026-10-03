# Nomenclatura auditada

Las carpetas técnicas siguen la excepción aprobada por el usuario: `app`, `core`, `database`, `modules`, `shared` y sus subdivisiones convencionales, incluida `database/repositories`. Los módulos de negocio, archivos, servicios, entidades, variables y columnas propios permanecen en español.

La auditoría 048 renombró el atributo propio de información de build a `compilacion` y el identificador de compilación a `__COMPILACION_APLICACION__`. El parámetro de Vite se recibe como `mode: modo`, conservando la API externa y usando español para la variable local.

Se mantienen APIs y convenciones externas: React `children`, `useEffect`, Material UI `loading`, Vite `mode`, Capacitor `appId`, UUID, IndexedDB, SQLite y los identificadores de Material Icons. Los nombres generados de Android/Xcode y las claves oficiales de sus archivos de configuración se conservan para mantener compatibilidad. Las tablas y columnas de negocio utilizan español en snake_case.

La estructura actual se describe en `ARQUITECTURA.md`; esta excepción no autoriza traducir funcionalidades ni contenido al inglés.
