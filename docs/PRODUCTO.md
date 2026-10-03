# Producto

AppBilletera administra finanzas personales y rentabilidad de actividades o trabajos temporales. Las funciones de las tareas 000 a 050 están implementadas; la versión continúa en desarrollo.

## Alcance disponible

- Ajustes administra actividades, categorías, medios de pago y billeteras con auditoría y activación.
- La carga de ingresos y gastos muestra medios rápidos, recuerda últimas selecciones y permite distribuir importes entre billeteras de la misma moneda.
- Las operaciones tienen listado por período, edición y borrado lógico. Se conservan las referencias históricas.
- Las billeteras muestran saldo, movimientos, transferencias y conciliación. Los ajustes requieren un motivo; una coincidencia no genera movimiento.
- Inicio presenta resultado de hoy, principales billeteras y últimos movimientos.
- Reportes ofrece Hoy, Semana, Mes, Año y Personalizado, desgloses por actividad, medio y categoría, rentabilidad y patrimonio.
- Ajustes ofrece Sistema/Claro/Oscuro, versión/build y respaldo JSON transaccional.
- Web/PWA y contenedores Android/iOS comparten pantallas y reglas.

## Experiencia y reglas

La prioridad es cargar desde celular con pocos pasos, controles accesibles y navegación adaptable. Los medios rápidos aparecen inmediatamente; un campo vacío equivale a cero para calcular, pero se persisten solo detalles positivos. El total final de un ingreso o gasto debe ser mayor que cero. Los catálogos se editan exclusivamente desde Ajustes.

Un medio expresa cómo se paga o cobra y una billetera dónde está el dinero. Un detalle sin billetera afecta el resultado sin modificar saldos. Las transferencias internas conservan el patrimonio y no afectan la ganancia. Los ajustes documentan diferencias y se informan por separado. No se mezclan ni convierten monedas.

Los reportes de resultado utilizan fechas calendario locales. El patrimonio actual suma todos los movimientos registrados, incluidos los futuros; los filtros de movimientos no alteran ese saldo. La rentabilidad de una actividad incluye únicamente gastos asociados a ella.

## Respaldo y límites

El respaldo contiene toda la información financiera local y debe conservarse de forma privada. Importar incorpora registros faltantes y rechaza conflictos de UUID sin sobrescribir historia; no realiza sincronización entre dispositivos. En nativo, el usuario elige el destino mediante el selector del sistema.

No hay backend ni cloud. La PWA necesita un primer acceso para descargar la interfaz; luego funciona offline. Android tiene APK debug compilado; iOS/iPadOS está preparado y requiere macOS/Xcode para compilar. No se verificó funcionamiento en dispositivos físicos ni se ejecutaron tests. Publicación, firma de distribución y fase de tests quedan fuera de este lote.
