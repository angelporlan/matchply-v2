# Explicar Matchply v2 sin abrir el código

Ejercicio obligatorio después de cada fase. Si alguna respuesta se atasca, esa pieza aún no es tuya.

## Fase 0 — lo que tiene que salir de memoria

### Next.js App Router

Next.js es React en el servidor y en el cliente. La carpeta `src/app` **es** el enrutado:

- `src/app/page.tsx` → `“/”`
- `src/app/api/health/route.ts` → `“/api/health`”
- `src/app/layout.tsx` envuelve todas las páginas (HTML, fuente, CSS global)

Una página es un Server Component por defecto: se renderiza en el servidor y manda HTML. Solo marcas `'use client'` cuando hace falta estado del navegador (clicks, inputs controlados, hooks).

### `layout.tsx` frente a `page.tsx`

- Layout: la cáscara. Se conserva al navegar entre rutas hijas.
- Page: el contenido de esa URL.

### Ruta de API

`route.ts` exporta funciones con el nombre del método HTTP (`GET`, `POST`, …). Next las convierte en un endpoint. `GET /api/health` no pinta HTML: devuelve JSON.

Para qué sirve ahora: comprobar que el proceso está vivo, sin pasar por React.

### Variables de entorno

`.env` no se sube a git. `.env.example` sí, como plantilla. `src/lib/env.ts` lee `process.env` en un solo sitio para no esparcir `process.env.X` por la app.

En Next hay dos familias:

- Sin prefijo: solo servidor (`DATABASE_URL`, secretos).
- `NEXT_PUBLIC_*`: también el navegador. Nunca pongas un secreto ahí.

### TypeScript `strict`

`tsconfig.json` tiene `"strict": true`. El compilador obliga a tipar lo que entra y sale. `npm run typecheck` es `tsc --noEmit`: valida tipos y no genera JS.

### Tailwind

Lee clases en los JSX y genera CSS. `globals.css` importa las capas de Tailwind (`base`, `components`, `utilities`). `tailwind.config.ts` dice qué archivos escanear.

### Alias `@/`

`@/lib/env` es `src/lib/env`. Lo define `paths` en `tsconfig.json`.

## Preguntas de entrevista para esta fase

1. ¿Qué diferencia hay entre un Server Component y un Client Component?
2. ¿Por qué `/api/health` no es una página?
3. ¿Qué pasaría si pongo `DATABASE_URL` como `NEXT_PUBLIC_DATABASE_URL`?
4. ¿Qué hace `layout.tsx` que no hace `page.tsx`?
5. ¿Por qué existe `src/lib/env.ts` en vez de leer `process.env` en cada archivo?

Cuando las respondas en voz alta, sin mirar, Fase 0 está cerrada.
