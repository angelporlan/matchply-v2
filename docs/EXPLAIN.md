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

## Fase 1 — lo que tiene que salir de memoria

### ORM y Drizzle

Un ORM (Object-Relational Mapper) traduce entre objetos TypeScript y filas SQL. Drizzle no esconde el SQL: describes tablas en `src/db/schema.ts` y las queries se leen casi como SQL (`db.select().from(users)`). El paquete `postgres` abre la conexión TCP; Drizzle monta el texto y los parámetros.

No usamos el cliente JS de Supabase. Ese cliente habla HTTP con PostgREST. Nosotros queremos Postgres de verdad, en el servidor, con `DATABASE_URL`. Auth, Storage, Realtime y RLS de Supabase no entran.

### `DATABASE_URL`

Es la cadena de conexión: usuario, contraseña, host, puerto, base. Vive en `.env` (no en git). `src/lib/env.ts` la lee. Solo el proceso Node del servidor la usa.

### Por qué no `NEXT_PUBLIC_DATABASE_URL`

Todo lo que empieza por `NEXT_PUBLIC_` Next lo mete en el JavaScript del navegador. Si la URL de Postgres sale ahí, cualquiera abre DevTools, copia la contraseña y tiene la base. Los secretos no viajan al cliente.

### `db:push` frente a migraciones

`npm run db:push` (`drizzle-kit push`):

1. Lee `schema.ts`
2. Mira las tablas reales en Postgres
3. Calcula el diff
4. Ejecuta `CREATE` / `ALTER` ahora mismo

No deja archivos SQL en git. No hay historial. Vale cuando eres tú solo y la base de desarrollo se puede reconstruir.

Migraciones (`drizzle-kit generate` + `migrate`): ficheros SQL numerados, se commitean, cada entorno los aplica en orden. Hay historial y se revisan en el PR.

Esta etapa usa push. El historial en git llega cuando haga falta más de un entorno de verdad.

### Flujo del healthcheck

```text
navegador  GET /api/health
    → route handler (servidor)
    → ping() → Drizzle ejecuta `select 1`
    → TCP a Supabase Postgres
    → { ok: true, db: true }
```

Si Postgres no responde: HTTP 503 y `db: false`. La tabla `users` existe tras `db:push`; el pulso no la consulta, solo comprueba el cable.

### Preguntas de entrevista para esta fase

1. ¿Qué es un ORM y qué hace Drizzle aquí que no haga el cliente JS de Supabase?
2. ¿Por qué `DATABASE_URL` no lleva `NEXT_PUBLIC_`?
3. ¿Qué diferencia hay entre una migración y `npm run db:push`?
4. Dibuja GET `/api/health` desde el navegador hasta `select 1` y de vuelta.
5. ¿Qué queda fuera de esta etapa a propósito (Auth, RLS, Storage)?

Cuando las respondas en voz alta, sin mirar, Fase 1 está cerrada.
