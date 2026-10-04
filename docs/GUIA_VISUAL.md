# AppBilletera — Guía visual

Este documento define el sistema visual vigente de AppBilletera.

Debe utilizarse como referencia para:

- nuevas pantallas;
- componentes reutilizables;
- revisiones visuales;
- modo claro;
- modo oscuro;
- responsive;
- Web;
- PWA;
- Android;
- iOS;
- iPadOS.

La implementación debe utilizar Material UI y los componentes compartidos existentes.

No crear estilos independientes por pantalla si una regla visual ya está definida aquí.

---

# 1. Principios visuales

AppBilletera debe sentirse:

- moderna;
- limpia;
- rápida;
- clara;
- compacta;
- táctil;
- consistente;
- orientada principalmente al uso desde celular.

La interfaz debe priorizar:

```text
1. Dato principal
2. Acción principal
3. Información secundaria
4. Historial o detalle
```

No dar el mismo peso visual a todos los elementos.

---

# 2. Mobile-first

La aplicación se diseña primero para celular.

Viewport principal de referencia:

```text
390 × 844 px
```

También debe funcionar correctamente aproximadamente entre:

```text
320 px
```

y:

```text
430 px
```

de ancho móvil.

La interfaz debe adaptarse posteriormente a tablet y desktop.

---

# 3. Breakpoints

Utilizar preferentemente los breakpoints de Material UI.

Conceptualmente:

```text
xs  < 600 px
sm  >= 600 px
md  >= 900 px
lg  >= 1200 px
xl  >= 1536 px
```

## Mobile

```text
< 600 px
```

Características:

- una columna principal;
- BottomNavigation;
- formularios full-width;
- botones principales full-width;
- tarjetas apiladas;
- diálogos adaptados;
- acciones fáciles de alcanzar con una mano.

## Tablet

```text
600–1024 px
```

Características:

- una o dos columnas;
- mayor padding;
- formularios limitados;
- posible NavigationRail o Drawer.

## Desktop

```text
> 1024 px
```

Características:

- Drawer/sidebar cuando corresponda;
- contenido centrado;
- grids;
- formularios con ancho limitado;
- mejor aprovechamiento horizontal.

No crear pantallas funcionalmente distintas para desktop.

---

# 4. Grilla de espaciado

La unidad base es:

```text
8 px
```

Valores recomendados:

```text
4 px   → separación mínima
8 px   → separación pequeña
12 px  → separación media corta
16 px  → separación estándar
24 px  → separación entre bloques
32 px  → separación grande
40 px  → separación excepcional
```

Evitar valores arbitrarios.

Preferir múltiplos de:

```text
4
```

y especialmente de:

```text
8
```

---

# 5. Márgenes generales

## Mobile

Padding horizontal principal:

```text
16 px
```

En pantallas muy angostas puede reducirse hasta:

```text
12 px
```

## Tablet

```text
24 px
```

## Desktop

```text
24–32 px
```

El contenido principal puede limitarse aproximadamente a:

```text
1200–1440 px
```

según la pantalla.

---

# 6. Formularios

En móvil:

```text
width: 100%
```

En desktop:

```text
max-width: 600 px
```

para formularios comunes.

Formularios especialmente complejos pueden llegar aproximadamente a:

```text
720 px
```

si realmente lo requieren.

---

# 7. Paleta — modo claro

## Fondo general

```text
#F8FAFC
```

## Superficie principal

```text
#FFFFFF
```

## Superficie secundaria

```text
#F1F5F9
```

## Superficie destacada

```text
#EFF6FF
```

## Texto principal

```text
#0F172A
```

## Texto secundario

```text
#475569
```

## Texto deshabilitado

```text
#94A3B8
```

## Bordes

```text
#E2E8F0
```

---

# 8. Paleta — modo oscuro

No utilizar negro puro como fondo general.

## Fondo general

```text
#0F172A
```

## Superficie principal

```text
#111827
```

## Superficie secundaria / elevada

```text
#1F2937
```

## Superficie destacada

```text
#172554
```

## Texto principal

```text
#F8FAFC
```

## Texto secundario

```text
#94A3B8
```

## Texto deshabilitado

```text
#64748B
```

## Bordes

```text
#334155
```

---

# 9. Colores semánticos

## Primario claro

```text
#2563EB
```

## Primario oscuro

```text
#3B82F6
```

## Ingreso / éxito claro

```text
#16A34A
```

## Ingreso / éxito oscuro

```text
#22C55E
```

## Gasto / error claro

```text
#DC2626
```

## Gasto / error oscuro

```text
#EF4444
```

## Advertencia

```text
#F59E0B
```

## Ajuste

```text
#7C3AED
```

## Transferencia

Utilizar principalmente el color primario.

---

# 10. Regla de color

No transmitir información solamente mediante color.

Ejemplo de ingreso:

```text
+ $35.000
↑
verde
```

Ejemplo de gasto:

```text
- $20.000
↓
rojo
```

Ejemplo de transferencia:

```text
Efectivo → Galicia
⇄
azul
```

Debe existir siempre alguna combinación de:

- signo;
- icono;
- texto;
- color.

---

# 11. Tipografía

Fuente principal:

```text
Roboto
```

Fallback:

```css
Roboto,
system-ui,
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif
```

---

# 12. Escala tipográfica

## Título principal de pantalla

```text
24 px
font-weight: 700
line-height: 32 px
```

## Título de sección

```text
18 px
font-weight: 700
line-height: 24 px
```

## Subtítulo

```text
16 px
font-weight: 500
line-height: 24 px
```

## Texto normal

```text
14 px
font-weight: 400
line-height: 20 px
```

## Texto secundario

```text
12–13 px
font-weight: 400
line-height: 18 px
```

## Importe principal

```text
32–36 px
font-weight: 700
```

## Importe secundario

```text
20–24 px
font-weight: 700
```

## Importe de lista

```text
14–16 px
font-weight: 600
```

---

# 13. Bordes

Grosor normal:

```text
1 px
```

Modo claro:

```text
#E2E8F0
```

Modo oscuro:

```text
#334155
```

Utilizar:

```text
2 px
```

solo para:

- foco;
- selección;
- error destacado;
- elemento activo.

---

# 14. Radios

## Tarjetas principales

```text
16 px
```

## Tarjetas compactas

```text
12 px
```

## Inputs

```text
12 px
```

## Botones

```text
12 px
```

## Componentes destacados

```text
16–20 px
```

## Dialog

```text
20 px
```

## Bottom sheet

Esquinas superiores:

```text
24 px
```

## Chips

```text
999 px
```

para estilo completamente redondeado.

---

# 15. Sombras

Las sombras deben ser discretas.

## Card normal — claro

```css
box-shadow:
  0 2px 8px rgba(15, 23, 42, 0.06);
```

## Card elevada

```css
box-shadow:
  0 6px 20px rgba(15, 23, 42, 0.10);
```

## Dialog

```css
box-shadow:
  0 12px 32px rgba(15, 23, 42, 0.18);
```

## Bottom sheet

```css
box-shadow:
  0 -8px 30px rgba(15, 23, 42, 0.16);
```

## Modo oscuro

En modo oscuro se priorizan:

- diferencias de superficie;
- bordes;
- contraste;

por encima de sombras fuertes.

Ejemplo:

```css
box-shadow:
  0 4px 16px rgba(0, 0, 0, 0.25);
```

---

# 16. AppBar

Altura:

```text
56 px
```

sin contar safe area.

Padding horizontal:

```text
16 px
```

Debe contener idealmente:

```text
← / icono
Título
1–2 acciones
```

No llenar el AppBar con acciones secundarias.

---

# 17. Navegación inferior

Altura base:

```text
64 px
```

más safe area cuando corresponda.

Icono:

```text
24 px
```

Texto:

```text
11–12 px
```

Navegación principal prevista:

```text
Inicio
Ingresos
Gastos
Reportes
```

Ajustes puede accederse mediante AppBar o menú según la navegación vigente.

---

# 18. Drawer / Sidebar

En desktop puede utilizarse:

```text
240–280 px
```

de ancho.

Elementos:

```text
48–56 px
```

de altura.

No mostrar simultáneamente Drawer permanente y BottomNavigation salvo una razón responsive concreta.

---

# 19. Iconos

Utilizar Material Icons / Material Symbols.

Tamaños:

```text
20 px → inputs
24 px → navegación
28 px → acciones destacadas
32 px → tarjetas
40 px → icono protagonista
```

Contenedor de iconos de catálogo:

```text
40–48 px
```

Radio:

```text
10–14 px
```

---

# 20. Botón principal

Altura:

```text
48 px
```

Para acciones especialmente relevantes:

```text
52 px
```

En formularios móviles:

```text
width: 100%
```

Radio:

```text
12 px
```

Texto:

```text
15–16 px
font-weight: 600
```

Padding horizontal:

```text
16–20 px
```

---

# 21. Botón secundario

Altura:

```text
44–48 px
```

Variantes preferidas:

```text
outlined
text
tonal
```

No colocar dos botones visualmente primarios dentro del mismo grupo de decisión.

---

# 22. Inputs

Altura estándar:

```text
52–56 px
```

Preferencia:

```text
56 px
```

Radio:

```text
12 px
```

Padding horizontal:

```text
14–16 px
```

Separación entre campos:

```text
16 px
```

Label:

```text
14 px
font-weight: 500
```

---

# 23. Campos monetarios

Los importes deben ser fáciles de leer y editar.

Altura:

```text
56 px
```

Texto:

```text
18 px
font-weight: 600
```

En carga rápida:

```text
text-align: right
```

Ejemplo:

```text
Efectivo          $ 35.000
```

En móvil utilizar teclado numérico apropiado.

---

# 24. Tarjetas

Padding normal:

```text
16 px
```

Padding compacto:

```text
12 px
```

Radio:

```text
16 px
```

Separación vertical:

```text
12 px
```

No convertir absolutamente todo en cards.

Las listas sencillas pueden utilizar superficies sin card individual.

---

# 25. Chips

Altura:

```text
26–30 px
```

Padding horizontal:

```text
10 px
```

Texto:

```text
12 px
font-weight: 500–600
```

Ejemplos:

```text
Activa
Finalizado
Carga rápida
Inactiva
```

---

# 26. Switches

Utilizar Material UI.

El control visual puede ser pequeño, pero el área táctil debe ser al menos:

```text
44 × 44 px
```

Preferiblemente:

```text
48 × 48 px
```

---

# 27. Listas

Fila financiera estándar:

```text
64–72 px
```

Fila con mayor información:

```text
72–80 px
```

Estructura:

```text
[icono] Título                   $ importe
        descripción              fecha
```

Icono:

```text
40 px
```

---

# 28. Touch targets

Ninguna acción importante debe tener un área táctil inferior a:

```text
44 × 44 px
```

Preferencia:

```text
48 × 48 px
```

---

# 29. Pantalla Inicio

Orden general:

```text
AppBar

12 px

Resumen del día

16 px

Ingresos / Gastos

24 px

Mi dinero

24 px

Últimos movimientos
```

---

# 30. Inicio — resumen principal

La tarjeta principal muestra:

```text
Ganancia de hoy
```

Altura aproximada:

```text
140–160 px
```

Ancho:

```text
100%
```

Padding:

```text
16–20 px
```

Radio:

```text
16 px
```

Muestra:

```text
Ganancia de hoy

$90.000

Ingresos        Gastos
$132.000        $42.000
```

Monto principal:

```text
32–36 px
```

---

# 31. Inicio — ingresos y gastos

En móvil normal:

```text
2 columnas
```

Gap:

```text
12 px
```

Cada bloque:

```text
min-height: 112–120 px
```

Incluye:

```text
Ingresos
$132.000
+ Agregar ingreso
```

y:

```text
Gastos
$42.000
+ Agregar gasto
```

Ingreso usa semántica verde.

Gasto usa semántica roja.

---

# 32. Inicio — billeteras

Sección:

```text
Mi dinero
```

Puede utilizar una card contenedora.

Padding:

```text
16 px
```

Mostrar inicialmente:

```text
3 billeteras
```

aproximadamente.

Ejemplo:

```text
Efectivo          $250.000
Mercado Pago      $120.000
Galicia           $320.000
```

Acciones:

```text
Transferir
Ver todas
```

---

# 33. Inicio — últimos movimientos

Mostrar inicialmente:

```text
4–5 movimientos
```

Fila:

```text
64–72 px
```

Ejemplo:

```text
Ingreso DiDi          +$35.000
Gasto Combustible     -$20.000
Efectivo → Galicia    $100.000
Ajuste caja           -$15.000
```

Agregar:

```text
Ver todos
```

si existe historial adicional.

---

# 34. Nuevo ingreso

Padding general:

```text
16 px
```

Orden:

```text
Actividad
Fecha
Descripción
Observaciones
Medios de cobro
Total
Guardar
```

Separación entre campos:

```text
16 px
```

---

# 35. Nuevo ingreso — medios rápidos

Contenedor:

```text
padding: 12–16 px
border-radius: 16 px
```

Cada fila:

```text
56 px
```

Ejemplo:

```text
[icono] Efectivo               [$35.000]
[icono] Transferencia          [$20.000]
[icono] Tarjeta                [$0]
```

---

# 36. Nuevo ingreso — total

Altura:

```text
64–72 px
```

Radio:

```text
12 px
```

Modo claro:

```text
background: #ECFDF5
```

Texto:

```text
#16A34A
```

Modo oscuro:

usar una superficie verde oscura de bajo contraste, manteniendo texto legible.

Total:

```text
24 px
font-weight: 700
```

---

# 37. Nuevo gasto

Debe utilizar exactamente la misma estructura de Nuevo ingreso.

No crear un formulario visualmente distinto.

Cambiar únicamente la semántica.

Modo claro:

```text
background total: #FEF2F2
```

Texto:

```text
#DC2626
```

La consistencia entre ingreso y gasto tiene prioridad.

---

# 38. Transferencia entre billeteras

Orden:

```text
Billetera origen
Billetera destino
Importe
Fecha
Descripción
Vista previa
Confirmar
```

Selectores de billetera:

```text
min-height: 64 px
```

Mostrar:

```text
icono
nombre
saldo
```

Vista previa:

```text
min-height: 112–128 px
padding: 16 px
border-radius: 16 px
```

Ejemplo:

```text
Efectivo
-$100.000

↓  

Banco Galicia
+$100.000
```

---

# 39. Listado de billeteras

Tarjeta resumen superior:

```text
120–140 px
```

Mostrar:

```text
Mi dinero
$690.000
```

Cada billetera:

```text
88–96 px
```

Estructura:

```text
[icono] Nombre                 $ saldo
        última conciliación       >
```

Icono:

```text
48 px
```

Saldo:

```text
20 px
font-weight: 700
```

---

# 40. Detalle de billetera

Tarjeta principal:

```text
min-height: 144–160 px
```

Saldo:

```text
32–36 px
font-weight: 700
```

Mostrar:

```text
Nombre
Saldo actual
Última conciliación
```

Acciones:

```text
Transferir
Conciliar
```

En móvil:

```text
2 columnas
gap: 12 px
```

---

# 41. Filtros de billetera

Utilizar segmented control.

Ejemplo:

```text
Hoy | Semana | Mes
```

Altura:

```text
44 px
```

Radio exterior:

```text
12 px
```

Elemento seleccionado:

```text
10 px
```

de radio aproximadamente.

---

# 42. Conciliación de billetera

Mostrar claramente:

```text
Saldo calculado
Saldo real
Diferencia
```

Cards:

```text
min-height: 88–96 px
padding: 16 px
border-radius: 16 px
```

Diferencia principal:

```text
30–32 px
font-weight: 700
```

Negativa:

```text
rojo
```

Positiva:

```text
verde
```

---

# 43. Acciones de conciliación

Mostrar:

```text
Registrar movimiento faltante
Ajustar diferencia
```

Como tarjetas/botones suficientemente grandes.

En móviles normales:

```text
2 columnas
```

Cada opción:

```text
min-height: 104–112 px
```

En anchos pequeños:

```text
< aproximadamente 360 px
```

apilar verticalmente.

---

# 44. Registrar movimiento faltante

Mostrar primero un banner de contexto.

Ejemplo:

```text
La billetera presenta una diferencia de $15.000.
Podés registrar el movimiento que falta.
```

Banner:

```text
padding: 12–16 px
border-radius: 12–16 px
```

Luego utilizar el formulario correspondiente.

El banner informa.

No debe competir visualmente con la acción principal.

---

# 45. Actividades

Buscador:

```text
52–56 px
```

Tarjetas:

```text
84–92 px
```

Padding:

```text
12 px
```

Icono:

```text
48 px
```

Mostrar:

```text
icono
nombre
tipo
estado
acciones
```

Botón:

```text
Nueva actividad
```

Altura:

```text
48–52 px
```

---

# 46. Categorías de gastos

Utilizar el mismo lenguaje de catálogo.

Tarjeta:

```text
72–84 px
```

Icono:

```text
44 px
```

Mostrar:

```text
icono
nombre
descripción
estado
```

No crear una estética diferente a Actividades.

---

# 47. Medios de pago

Tarjeta:

```text
88–96 px
```

Mostrar:

```text
icono
nombre
billetera predeterminada
Carga rápida
activo/inactivo
```

Switch:

alineado al extremo derecho.

Chip:

```text
Carga rápida
```

usa semántica positiva o primaria suave.

---

# 48. Reportes

Selector de período:

```text
Hoy
Semana
Mes
Año
```

Altura:

```text
44 px
```

Rango personalizado:

acción separada si no hay espacio suficiente.

---

# 49. Reportes — indicadores

Indicadores principales:

```text
Ingresos
Gastos
Ganancia neta
```

En móvil:

```text
1–3 columnas
```

según ancho disponible.

No reducir excesivamente el texto para forzar tres columnas.

Cada tarjeta:

```text
min-height: 112–128 px
```

Valor:

```text
20–24 px
font-weight: 700
```

---

# 50. Reportes — desglose

Card contenedora:

```text
padding: 16 px
border-radius: 16 px
```

Fila:

```text
64–72 px
```

Mostrar:

```text
icono
nombre
importe
porcentaje
barra
```

Barra:

```text
height: 8 px
border-radius: 999 px
```

Evitar exceso de gráficos decorativos.

Los gráficos deben aportar información.

---

# 51. Ajustes — menú principal

No utilizar una única card gigante.

Separar por grupos:

```text
Configuración
Catálogos
Datos
Información
```

Separación entre grupos:

```text
24 px
```

Fila:

```text
64–72 px
```

Estructura:

```text
[icono] Título                  >
        descripción
```

---

# 52. Ajustes — Apariencia

Selector:

```text
Sistema
Claro
Oscuro
```

Puede utilizar tres tarjetas.

Altura:

```text
104–120 px
```

Radio:

```text
14–16 px
```

Elemento seleccionado:

```text
border: 2px solid primary
```

---

# 53. Selector de color principal

Círculos:

```text
40 × 40 px
```

Gap:

```text
8–12 px
```

Seleccionado:

```text
outline: 2 px
```

Separación entre círculo y outline:

```text
2 px
```

No depender solo del color para indicar selección.

---

# 54. Vista previa de tema

Mostrar miniaturas de:

```text
Claro
Oscuro
```

Cada una:

```text
aprox. 50% del ancho
```

Radio:

```text
12 px
```

Debe permitir apreciar:

- fondo;
- superficie;
- texto;
- color primario;
- tarjeta;
- botón.

No necesita recrear toda la aplicación.

---

# 55. Dialog

Ancho móvil:

```text
calc(100% - 32px)
```

Máximo:

```text
480 px
```

Radio:

```text
20 px
```

Padding:

```text
20–24 px
```

Acciones principales claramente diferenciadas.

---

# 56. Bottom Sheet

En móvil puede utilizarse para:

- selección de catálogo;
- opciones;
- acciones rápidas.

Radio superior:

```text
24 px
```

Padding:

```text
16 px
```

Altura máxima:

```text
80vh
```

Scroll interno cuando sea necesario.

---

# 57. Snackbar

Altura mínima:

```text
48 px
```

Radio:

```text
10–12 px
```

Duración aproximada:

```text
3–5 segundos
```

Ejemplos:

```text
Ingreso guardado correctamente.
Gasto actualizado.
Transferencia realizada.
```

---

# 58. Skeletons

Preferir Skeleton sobre un spinner de pantalla completa cuando ya se conoce la estructura visual.

Utilizar para:

- tarjetas;
- listados;
- balances;
- reportes.

El Skeleton debe aproximarse al tamaño final del elemento.

---

# 59. Estados vacíos

Deben incluir:

```text
icono
título
descripción
acción opcional
```

Altura aproximada:

```text
200–280 px
```

Ejemplo:

```text
Todavía no tenés ingresos registrados.

Registrar ingreso
```

---

# 60. Errores

Errores de campo:

```text
12 px
```

debajo del input.

Utilizar color semántico de error.

Los errores de operación pueden utilizar:

- Snackbar;
- Alert;
- mensaje contextual.

No utilizar:

```text
window.alert()
```

como interfaz normal.

---

# 61. FAB

Utilizar solamente cuando realmente aporte.

Tamaño normal:

```text
56 × 56 px
```

Mini:

```text
40 × 40 px
```

No utilizar simultáneamente un FAB y un botón principal grande para exactamente la misma acción.

En Inicio, las acciones:

```text
Agregar ingreso
Agregar gasto
```

ya están visibles.

Por lo tanto no es necesario un FAB general.

---

# 62. Tablas desktop

No utilizar tablas densas como interfaz principal en móvil.

En desktop pueden utilizarse.

Fila:

```text
52–56 px
```

Header:

```text
48 px
```

Evitar bordes verticales innecesarios.

---

# 63. Safe Areas

En plataformas nativas respetar:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
env(safe-area-inset-right)
```

No colocar:

- botones;
- navegación;
- acciones;

debajo de zonas reservadas por el sistema.

---

# 64. Animaciones

Mantener animaciones discretas.

Duración habitual:

```text
150–250 ms
```

Aplicables a:

- hover;
- selección;
- expandir;
- cambiar pestañas;
- abrir paneles;
- switches;
- feedback.

Evitar animaciones decorativas largas.

---

# 65. Responsive de cards

En mobile:

```text
1 columna
```

salvo componentes expresamente definidos en dos columnas.

En tablet:

```text
1–2 columnas
```

En desktop:

```text
2–4 columnas
```

según el contenido.

No aumentar el número de columnas si perjudica la lectura.

---

# 66. Scroll

La pantalla principal puede hacer scroll vertical.

No crear múltiples áreas de scroll vertical dentro de una pantalla salvo:

- Dialog;
- Bottom Sheet;
- menú;
- tabla específica.

Evitar scroll horizontal en móvil.

---

# 67. Densidad

La aplicación debe sentirse compacta pero no apretada.

Evitar:

```text
demasiado aire
```

y también:

```text
demasiada información pegada
```

Como regla general:

```text
12–16 px
```

entre elementos relacionados.

```text
20–24 px
```

entre bloques conceptuales.

---

# 68. Jerarquía de acciones

Utilizar:

```text
1 acción primaria
```

por bloque importante.

Las demás deben ser:

```text
secundarias
outlined
text
icon buttons
```

Ejemplo de transferencia:

```text
Primaria:
Transferir

Secundaria:
Cancelar
```

---

# 69. Carga rápida

La carga rápida debe mantener siempre la misma estructura visual entre Ingreso y Gasto.

No cambiar:

- alturas;
- alineaciones;
- posiciones;
- distribución;

salvo diferencias semánticas.

Esto permite desarrollar memoria muscular en el usuario.

---

# 70. Consistencia de iconos

Un mismo concepto debe utilizar el mismo icono en toda la aplicación.

Ejemplo:

```text
Billetera
```

no debe utilizar un icono distinto en:

```text
Inicio
Ajustes
Detalle
Transferencias
```

sin una razón concreta.

---

# 71. Contraste

Mantener contraste suficiente entre:

- texto y fondo;
- iconos y superficie;
- estados activos;
- estados deshabilitados.

Especial atención en:

```text
modo oscuro
```

donde no deben confundirse:

```text
fondo
card
input
borde
```

por utilizar tonos demasiado similares.

---

# 72. Estado deshabilitado

Debe verse claramente deshabilitado sin desaparecer.

Utilizar:

- menor opacidad;
- texto secundario;
- superficie neutra;
- cursor/estado Material UI apropiado.

No utilizar únicamente un gris extremadamente claro.

---

# 73. Selección

Elementos seleccionados deben tener al menos dos señales visuales.

Ejemplo:

```text
borde primario
+
check
```

o:

```text
fondo primario suave
+
texto primario
```

---

# 74. Implementación Material UI

Centralizar configuración en:

```text
src/app/theme/
```

Especialmente:

```text
colores.ts
componentes.ts
tema.ts
tipografia.ts
```

No repetir:

```tsx
sx={{
  borderRadius: '16px',
  boxShadow: '...'
}}
```

en decenas de componentes cuando el valor puede definirse como token o variante.

---

# 75. Tokens recomendados

Conceptualmente:

```ts
const espaciadoBase = 8;

const radioPequeno = 10;
const radioInput = 12;
const radioTarjeta = 16;
const radioDialogo = 20;
const radioBottomSheet = 24;

const alturaInput = 56;
const alturaBoton = 48;
const alturaAppBar = 56;
const alturaBottomNavigation = 64;
```

Estos valores deben centralizarse en el sistema visual.

---

# 76. Sombras centralizadas

Definir variantes conceptuales:

```text
sombraTarjeta
sombraElevada
sombraDialogo
sombraBottomSheet
```

No inventar una sombra diferente para cada tarjeta.

---

# 77. Colores centralizados

Evitar:

```tsx
color: '#16A34A'
```

repetido directamente en componentes.

Preferir tokens semánticos como:

```text
exito
gasto
ajuste
transferencia
textoPrincipal
textoSecundario
superficie
```

adaptados al tema activo.

---

# 78. Modo oscuro

Todo componente nuevo debe contemplar desde su creación:

```text
Claro
Oscuro
```

No implementar primero una pantalla exclusivamente clara para luego “convertirla”.

Validar conceptualmente:

- fondo;
- superficie;
- borde;
- texto;
- hover;
- selected;
- disabled;
- error;
- ingreso;
- gasto.

---

# 79. Apariencia Sistema

Cuando el usuario selecciona:

```text
Sistema
```

la aplicación debe seguir:

```text
prefers-color-scheme
```

o la abstracción correspondiente del entorno.

El cambio del sistema debe poder reflejarse sin requerir reiniciar la aplicación cuando técnicamente sea posible.

---

# 80. Preferencia de tema

La selección:

```text
Sistema
Claro
Oscuro
```

es una preferencia de interfaz.

Puede persistirse en:

```text
localStorage
```

No debe almacenarse junto con datos financieros.

---

# 81. Diseño de catálogo

Actividades, Categorías, Medios de pago y Billeteras deben compartir:

- alineaciones;
- radios;
- altura de cards;
- sistema de iconos;
- chips;
- acciones.

Las diferencias corresponden al contenido, no a un sistema visual nuevo.

---

# 82. Formularios ABM

Crear/editar catálogo puede utilizar:

```text
Dialog
Bottom Sheet
pantalla dedicada
```

según complejidad.

Campos simples:

preferir Dialog/Bottom Sheet.

Entidades más complejas:

pueden utilizar pantalla completa.

---

# 83. Acciones peligrosas

Desactivar, eliminar o reemplazar información debe utilizar semántica adecuada.

No usar rojo para acciones normales.

Rojo se reserva principalmente para:

- gastos;
- errores;
- acciones destructivas.

---

# 84. Formateo financiero

Mostrar valores de forma consistente.

Ejemplo ARS:

```text
$ 1.250.000
```

o formato equivalente definido centralmente.

Valores negativos:

```text
-$ 20.000
```

Mantener una sola convención en toda la aplicación.

---

# 85. Fechas

Mostrar fechas en español y en formato adecuado al contexto.

Ejemplo compacto:

```text
02/10/2026
```

Ejemplo con hora:

```text
02/10/2026 · 18:32
```

No mostrar timestamps técnicos al usuario.

---

# 86. Truncado de texto

Los nombres largos deben utilizar:

```text
ellipsis
```

cuando sea necesario.

No permitir que un nombre largo rompa la estructura de:

- card;
- AppBar;
- lista;
- navegación.

Cuando el contexto lo necesite, permitir hasta dos líneas.

---

# 87. Pantallas pequeñas

En aproximadamente:

```text
320–359 px
```

priorizar:

- una columna;
- botones apilados;
- menor padding horizontal;
- tipografía sin reducción extrema.

Nunca reducir elementos táctiles para hacerlos entrar.

---

# 88. Pantallas grandes

En desktop no expandir formularios indefinidamente.

Ejemplo:

```text
FormularioIngreso
max-width: 600 px
```

Aunque el viewport mida:

```text
1920 px
```

La información debe conservar una longitud de lectura cómoda.

---

# 89. Estados financieros

## Ingreso

Visual:

```text
verde
+
signo positivo
+
icono de entrada
```

## Gasto

Visual:

```text
rojo
+
signo negativo
+
icono de salida
```

## Transferencia

Visual:

```text
azul
+
icono de intercambio
```

## Ajuste

Visual:

```text
violeta
+
icono de ajuste
```

---

# 90. Principio final

La interfaz de AppBilletera debe poder evolucionar modificando principalmente:

```text
Theme
Tokens
Componentes compartidos
```

y no editando estilos individuales en cada pantalla.

Antes de agregar una nueva medida, color, radio o sombra:

1. comprobar si ya existe;
2. reutilizarlo;
3. si realmente falta, incorporarlo al sistema visual;
4. documentarlo.

La consistencia visual tiene prioridad sobre personalizaciones aisladas.
---

# 91. Composición vigente de las referencias — TAREA 067

Esta sección precisa la composición de las pantallas desde la revisión del 03/10/2026. Mantiene los tokens de los capítulos anteriores y sustituye únicamente sus alternativas de composición cuando difieran.

## Cabeceras

Una sola cabecera contextual en móvil: identidad AppBilletera en destinos principales; regreso explícito y título en formularios, detalle y subpantallas. No repetir una barra de marca encima de otra barra de regreso. En escritorio conservar navegación lateral y un encabezado de contenido.

## Superficies y jerarquía

El resumen principal usa una superficie azul suave en claro y elevada en oscuro, texto del tema y cifra 32–36 px. El azul saturado se reserva principalmente para acciones. Las tarjetas de saldo usan superficies neutrales, sin reinterpretar el saldo como ganancia.

Inicio mantiene fecha localizada, franja de ingresos/gastos, accesos rápidos semánticos, hasta tres mini billeteras y cuatro o cinco movimientos agrupados. En 320 px se permite apilar; desde 360 px pueden usarse dos columnas cuando el texto cabe.

## Filas y formularios

Catálogos: contenedor de icono de 40–48 px con el color configurado, nombre, información secundaria necesaria y edición contextual. Eliminar hexadecimales y botones repetidos del listado; el editor conserva todos los campos. Separar estado de trabajo, disponibilidad y carga rápida con etiquetas inequívocas.

Carga rápida: icono/nombre a la izquierda e importe a la derecha; segunda línea con billetera real editable. Nunca ocultar el destino del dinero para imitar una imagen. Agrupar campos de identidad/fecha/descripción y medios/total en superficies relacionadas.

Reportes: indicadores con iconos, selector de desglose, filas de importe/porcentaje/barra y patrimonio separado. Cada porcentaje identifica su denominador y moneda.

## Adaptación y exclusiones

Mantener 390 × 844 px como referencia y revisar 320, 430, 600, 768, 1024 y 1440 px. Formularios limitados a 600 px, controles táctiles y un único scroll de pantalla; conservar áreas seguras y foco visible.

La implementación ya posee paletas, medidas, consultas financieras, modos Sistema/Claro/Oscuro y estados básicos. La nueva fase refina composición, densidad, cabeceras e iconos; no rehace estos mecanismos.

## Ajuste de Inicio — TAREA 086

Roboto se incluye localmente mediante su variante de peso variable y subconjunto latino, con alternativas del sistema mientras carga. La fuente y su licencia acompañan la compilación y el precache PWA; no depende de Google Fonts ni de una conexión para usos posteriores.

Inicio dispone de un resumen con icono a la derecha y dos columnas centradas de ingresos/gastos. Por debajo de 360 px, esa franja usa dos filas para conservar importes completos. Por decisión posterior del usuario del 03/10/2026, los accesos rápidos se simplifican a dos botones semánticos: Agregar ingreso y Agregar gasto, sin tarjetas ni totales repetidos. Se muestran una sola vez, fuera de los resúmenes por moneda; se apilan por debajo de 360 px. Esta decisión reemplaza la composición de tarjetas rápidas de la referencia. La variante compartida de tarjeta permanece disponible sin cambiar los otros resúmenes.

Mi dinero adapta sus columnas a las billeteras realmente disponibles y ofrece Transferir/Ver todas en el pie. Los movimientos permiten bajar el importe completo a una segunda fila en anchos estrechos. El resumen principal conserva cifra de 34 px; los ingresos/gastos de su franja inferior, 20 px; los movimientos, 16 px. No se fuerzan alturas para hacer caber contenido debajo de la navegación fija.

Las imágenes tienen diferencias entre sí. Se conservan paleta normativa, cuatro destinos inferiores, entrada positiva, salida negativa y ajuste violeta. No copiar logos comerciales ni cifras de muestra. Color de acento configurable, descripción de categorías, comparativas, cantidad de movimientos, arrastre y notificaciones quedan fuera hasta una tarea funcional autorizada.

## Ajuste de Nuevo ingreso — TAREA 087

La referencia de Nuevo ingreso aportada el 03/10/2026 guía etiquetas exteriores, iconos de apoyo, importes alineados a la derecha, ayuda inferior, total verde y guardado azul. La billetera real permanece visible y editable por distribución; no se copia su omisión en la imagen. Se preservan moneda, formato decimal exacto, actividad precargada y campos opcionales. Las propiedades visuales nuevas son optativas para conservar otros formularios.

Compactación posterior autorizada: Fecha y Descripción comparten fila desde 390 px, con columna de fecha de 160 px y descripción flexible; se apilan por debajo. La fecha usa solamente el calendario nativo. Ingreso reduce rellenos a 12 px, separación de campos a 12 px y filas de cobro a controles de 48 px con separación de 8 px. Billetera real permanece visible; la ayuda breve conserva formato decimal y vacío equivalente a cero. Gasto conserva su distribución anterior.

La referencia final del 03/10/2026 sustituye las tarjetas separadas por una lista de cobros con divisores. La billetera real se muestra como selector de texto debajo del medio, con acceso visible a cambiarla, nunca como dato oculto. TOTAL INGRESO se integra en el bloque de cobros con cifra verde e icono de tendencia. Opciones de moneda y agregar/quitar medios siguen disponibles en un desplegable; los importes y los catálogos son reales, sin copiar cifras o logos de muestra.

## Refinamiento de Nuevo gasto — TAREA 088

La referencia del 03/10/2026 establece etiquetas exteriores, categoría y descripción obligatorias, actividad opcional y fecha/descripcion apiladas. Los pagos usan tarjetas con importe alineado y selector de billetera real en texto debajo, total rojo e icono de salida, guardado rojo. Más y Agregar otro medio de pago dan acceso a los medios reales disponibles; quitar medios y cambiar moneda permanecen disponibles. Ingreso conserva la composición aprobada en TAREA 87.

Corrección posterior de TAREA 88: Fecha y Descripción comparten fila desde 390 px (en anchos menores se apilan). Gasto reutiliza la lista unificada de Ingreso con separadores, billetera real editable junto al nombre y campo de importe a la derecha. Sustituye las tarjetas individuales; se mantienen total rojo, opciones y guardado.

Corrección de bordes solicitada: las listas de medios de Ingreso y Gasto utilizan el token radioTarjeta (16 px explícitos), igual que el contenedor exterior. Sustituye borderRadius: 3, que Material UI multiplicaba por el radio base y producía esquinas excesivas. No cambia el resto de superficies ni los datos.

## Listas de Ingresos y Gastos — TAREA 89

Referencia aprobada el 03/10/2026: cabecera horizontal con Agregar semántico, filtros Todos/Este mes/Mes anterior/Personalizar, resumen por moneda, búsqueda y filtros de catálogo. Agrupar tarjetas por mes con subtotales completos del filtro, aunque la página contenga solo parte del mes. Tarjetas con icono configurado, nombre histórico, fecha, descripción y total a la derecha; debajo chips con medio, billetera realmente utilizada e importe exacto. Radios de tarjeta explícitos de 16 px. Mantener accesos al detalle y eliminación confirmada, temas y navegación.
