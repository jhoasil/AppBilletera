# Arquitectura

## Separación de responsabilidades

Presentación → aplicación y servicios → dominio → contratos de repositorios → infraestructura → IndexedDB o SQLite.

La presentación consume servicios y nunca accede directamente a los motores de persistencia. El dominio contiene las entidades y reglas financieras. Los contratos permiten intercambiar adaptadores sin exponer diferencias de plataforma a las capas superiores.

## Tecnologías previstas

React, TypeScript estricto y Vite para la aplicación; Material UI y Material Icons para la interfaz; Capacitor para plataformas nativas; pnpm para dependencias. IndexedDB en Web y SQLite en Android, iOS e iPadOS.

Estructura prevista, todavía no creada:

```text
src/
    app/
    nucleo/
    base-datos/
    modulos/
    compartido/
```

## Persistencia e integridad

La infraestructura administra inicialización, migraciones versionadas, transacciones y cierre. Guardar cada operación financiera y sus movimientos de billetera de forma atómica. Mantener identidades UUID locales y borrado lógico para conservar la historia.

Los movimientos de billetera son la fuente de verdad del saldo. Resolver consultas y agregaciones en persistencia, evitando cargar toda la historia en la interfaz. Una caché futura debe ser reconstruible; los cierres por período se evaluarán cuando sean necesarios.

## Preferencias y evolución

Usar localStorage únicamente para preferencias de interfaz, como apariencia y últimos valores utilizados. Los datos financieros permanecen en la base local. Preparar identidades para futura sincronización sin implementar servicios cloud en esta etapa.
