# Modelo de datos

Modelo conceptual inicial. El esquema físico, las migraciones y el diagrama de entidades se definirán en la TAREA 10.

Las once entidades TypeScript están definidas en `src/nucleo/entidades/`, con una base `EntidadAuditada`. Las propiedades del dominio usan camelCase en español (`actividadId`, `importeCentavos`, `creadoEn`); las columnas de persistencia usarán snake_case (`actividad_id`, `importe_centavos`, `creado_en`) mediante los adaptadores.

Los instantes de auditoría, conciliación y movimientos se representan como cadenas ISO 8601 en UTC. Las fechas de ingresos, gastos, transferencias y períodos de actividad usan `AAAA-MM-DD` sin zona horaria. La ausencia de datos opcionales se representa con `null` explícito. Estos tipos describen los datos y no validan UUID, formatos de fechas, enteros, signos, referencias ni consistencia financiera en ejecución; esa responsabilidad corresponde a servicios posteriores.

Los detalles heredan la moneda de su ingreso o gasto. Las transferencias se limitan a billeteras de la misma moneda; no se implementa conversión de divisas. Los movimientos usan la moneda de su billetera. Sus referencias apuntan a la operación de origen; en saldos iniciales, tipo e identidad de referencia son nulos. `AjusteBilletera.diferenciaCentavos` expresa saldo real menos saldo calculado y determina el signo del movimiento asociado.

## Entidades previstas

| Entidad | Propósito y relaciones |
| --- | --- |
| Actividad | Fuente de ingresos o trabajo, con estado y fechas opcionales. |
| MedioPago | Forma de pago o cobro, con billetera predeterminada opcional. |
| CategoriaGasto | Clasificación editable de gastos. |
| Billetera | Ubicación del dinero y moneda. |
| Ingreso | Registro asociado a una actividad. |
| DetalleIngresoMedioPago | Distribución del ingreso entre medios y billeteras. |
| Gasto | Registro con categoría y actividad opcional. |
| DetalleGastoMedioPago | Distribución del gasto entre medios y billeteras. |
| TransferenciaBilletera | Movimiento interno entre billeteras distintas. |
| MovimientoBilletera | Entrada o salida que constituye la fuente de verdad del saldo. |
| AjusteBilletera | Diferencia registrada durante una conciliación. |

## Convenciones

- Nombres propios en español; tablas y columnas en snake_case.
- Clave primaria `id` con UUID generado localmente; sin campo `uuid` adicional ni identidad autoincremental.
- Claves foráneas con sufijo `_id`, por ejemplo `actividad_id` y `billetera_origen_id`.
- Importes enteros en unidades menores, mediante `importe_centavos`; moneda inicial ARS.
- Auditoría con `creado_en`, `actualizado_en` y `eliminado_en` cuando corresponda; conservar registros históricos mediante borrado lógico o desactivación.
- La representación consistente de fechas se concretará al definir el esquema físico.

## Consistencia financiera

Las operaciones de dinero se centralizan en `src/nucleo/dinero/Importe.ts`: `crearImporte` recibe centavos enteros seguros, `sumarImportes` suma una lista de la misma moneda y `restarImportes` calcula una diferencia con signo. La moneda predeterminada es ARS; una suma sin argumentos devuelve cero ARS. Se rechazan fracciones, valores no finitos, monedas de formato inválido, mezclas de monedas y resultados fuera de ±`Number.MAX_SAFE_INTEGER`. Los cálculos usan BigInt internamente y devuelven enteros number para persistencia; nunca se persiste BigInt.

El formateo se separa en `src/compartido/dinero/formatearImporte.ts`, con idioma predeterminado `es-AR` y dos decimales. Conserva los centavos exactos, incluidos los negativos menores a un peso. El modelo actual representa monedas de dos decimales; monedas con otra cantidad de unidades menores requerirán ampliar el modelo. La interpretación de texto de formularios no se implementa en esta tarea.

Ingresos y gastos tienen detalles por medio de pago, sin columnas fijas para efectivo o tarjeta. Los movimientos usan importes positivos para entradas y negativos para salidas. Tipos previstos: `SALDO_INICIAL`, `INGRESO`, `GASTO`, `TRANSFERENCIA_ENTRADA`, `TRANSFERENCIA_SALIDA`, `AJUSTE_POSITIVO` y `AJUSTE_NEGATIVO`.

Una transferencia genera salida y entrada por el mismo importe sin modificar el resultado. El saldo inicial y las diferencias de conciliación se registran como movimientos; el saldo no se edita directamente. Una diferencia cero no genera ajuste.
