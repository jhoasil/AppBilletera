# Auditoría de arquitectura

La tarea 047 separó `database/repositories` de `database/web`. Los repositorios locales consumen `ContextoDatos`, rangos portables y conversiones compartidas; no importan el contexto físico IndexedDB. `componerBaseLocal.ts` concentra la selección entre IndexedDB y SQLite. Dominio y presentación no ejecutan SQL ni solicitudes IndexedDB.

La validación declarativa de registros es común a ambos motores. SQLite ahora rechaza escrituras en contextos de lectura. Los reportes agregan resultado y desgloses en un solo recorrido del período, con memoria acotada a grupos y páginas.

La importación valida el esquema y el grafo del archivo antes de abrir la escritura: referencias, signos, monedas, saldos iniciales únicos y correspondencia entre operaciones y efectos vigentes. Los conflictos sobre una identidad existente abortan sin sobrescribir historia.

La descarga del respaldo está encapsulada: Web usa Blob y los contenedores nativos ofrecen el selector del sistema mediante Filesystem/Share. El usuario elige el destino; no se envían respaldos automáticamente. iOS incorpora la declaración de acceso a fechas de archivos requerida por Filesystem. [API de Filesystem](https://github.com/ionic-team/capacitor-filesystem).

Se conservaron los contratos especializados y los servicios existentes: no se añadió una capa de abstracción por cada operación ni una caché financiera sin medición.
