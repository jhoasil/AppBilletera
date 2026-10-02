# Modelo de datos

Modelo conceptual inicial. El esquema físico, las migraciones y el diagrama de entidades se definirán en la TAREA 10.

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

Ingresos y gastos tienen detalles por medio de pago, sin columnas fijas para efectivo o tarjeta. Los movimientos usan importes positivos para entradas y negativos para salidas. Tipos previstos: `SALDO_INICIAL`, `INGRESO`, `GASTO`, `TRANSFERENCIA_ENTRADA`, `TRANSFERENCIA_SALIDA`, `AJUSTE_POSITIVO` y `AJUSTE_NEGATIVO`.

Una transferencia genera salida y entrada por el mismo importe sin modificar el resultado. El saldo inicial y las diferencias de conciliación se registran como movimientos; el saldo no se edita directamente. Una diferencia cero no genera ajuste.
