# Arquitectura — Fase 0

```text
navegador
   |
   |  GET /
   v
Next.js (App Router)
   |-- src/app/layout.tsx     cáscara HTML
   |-- src/app/page.tsx       landing
   |
   |  GET /api/health
   v
src/app/api/health/route.ts
   |
   +-- src/lib/env.ts         lee entorno
```

No hay base de datos. No hay sesión. El proceso de Next es el único runtime.

## Carpetas

```text
src/
  app/             rutas (páginas y APIs)
  components/      UI reutilizable (vacía en Fase 0)
  lib/             código de servidor / utilidades sin JSX
```

Regla: `app/` enruta, `components/` pinta, `lib/` decide. Si un archivo mezcla las tres, se parte.

## Lo que vendrá (sin implementarlo aún)

```text
UI  →  Server Actions / Route Handlers  →  lib/ (casos de uso)  →  db/
```

Las rutas no hablarán con SQL a pelo. Un caso de uso en `lib/` (crear candidatura, generar CV) será el único que conozca Drizzle. Así una pantalla no se casa con la base de datos.

## Límites duros

- Nada de archivos de 50 KB.
- Nada de `any` nuevo.
- Nada de lógica de negocio dentro de un componente cliente.
- Cada feature nueva entra en su propia carpeta, no en un cajón global.
