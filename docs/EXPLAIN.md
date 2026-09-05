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

## Fase 2 — lo que tiene que salir de memoria

### Contraseña hasheada

En `users.password_hash` no va la contraseña. Va un salt + el resultado de `scrypt`. Si alguien copia la tabla, no tiene las contraseñas. `verifyPassword` vuelve a derivar la clave y compara con `timingSafeEqual` para no filtrar por tiempo si el hash coincide.

### Cookie de sesión

Tras login (o registro) el servidor:

1. Genera un token aleatorio
2. Lo guarda en `sessions` con `user_id` y `expires_at`
3. Lo pone en una cookie `httpOnly` llamada `session`

El navegador no puede leerla con JavaScript. No viaja el `userId` ni el hash de la contraseña: viaja un token opaco. Quien robe la cookie es esa sesión; por eso es httpOnly y `SameSite=lax`.

### `auth()` → `userId`

```text
request (Cookie: session=…)
    → auth() lee la cookie
    → SELECT en sessions WHERE token = …
    → si existe y no ha caducado: { userId }
    → si no: null
```

`requireAuth()` es `auth()` + redirect a `/login`. El dashboard hace `const { userId } = await requireAuth()` y con eso consulta `users`.

### Server Action sin sesión

Una Server Action es un POST. Si el cuerpo de la acción no llama a `auth()`, se ejecuta igual: no hay magia. Registro y login son públicos. Logout borra la cookie. Cualquier acción que toque datos de un usuario tiene que pedir `auth()` dentro, no fiarse de que “la página está protegida”.

### Preguntas de entrevista para esta fase

1. ¿Por qué no se guarda la contraseña en claro?
2. ¿Qué viaja en la cookie y qué no?
3. ¿Qué pasa si alguien llama a una Server Action sin sesión?
4. Dibuja login → cookie → `auth()` → `userId` en una query.
5. ¿Por qué no usamos Auth de Supabase ni Google OAuth aquí?

Cuando las respondas en voz alta, sin mirar, Fase 2 está cerrada.

## Fase 3 — lo que tiene que salir de memoria

### JSON, no Markdown

La fuente de verdad es un objeto:

```text
{
  profile,
  experience: [ { company, role, bullets[] } ],
  education:  [ { school, degree, year } ],
  skills:     [ "TypeScript", … ]
}
```

Si el CV fuera un Markdown suelto, la IA de las etapas 6–8 tendría que adivinar dónde acaba un trabajo. Con secciones, el runner puede mandar `experience[2]` y escribir solo eso. El preview (y más adelante el PDF) es una proyección de ese JSON.

### Ownership

Toda query lleva `userId` de `auth()`. `getOwnedCv(id, userId)` es `WHERE id = ? AND user_id = ?`. Si pides el CV de otra persona, no existe para ti. El componente no escribe SQL: llama a `src/db/cvs.ts` o a una Server Action que valida y luego habla con la base.

### Validar input

El editor manda JSON en un campo hidden. El servidor no se fía: `parseCv` recorta longitudes, tira claves raras y reconstruye el objeto. Lo que no pasa por `parseCv` no se guarda.

### Preguntas de entrevista para esta fase

1. ¿Por qué el CV no es un Markdown suelto si luego la IA tiene que tocarlo por secciones?
2. ¿Qué impide leer o editar el CV de otro usuario?
3. ¿Dónde se valida el input y por qué no en el componente?
4. ¿Qué significa que un CV esté activo?
5. ¿Qué queda fuera (PDF, TipTap, plantillas, IA)?

Cuando las respondas en voz alta, sin mirar, Fase 3 está cerrada.

## Fase 4 — lo que tiene que salir de memoria

### Enum, no texto libre

`job_offers.status` es el tipo Postgres `offer_status`. Cinco valores: `interested`, `applied`, `interview`, `offer`, `rejected`. Un `UPDATE` con `"en proceso"` lo rechaza la base. El tablero agrupa por ese enum.

### Máquina de estados

El enum lista los sitios. Las flechas viven en `TRANSITIONS`:

```text
interested → applied | rejected
applied    → interview | rejected
interview  → offer | rejected
offer      → rejected
rejected   → interested
```

El botón del tablero solo enseña destinos legales. La Server Action vuelve a llamar `canTransition`. Si alguien POST-ea `interested → offer`, no se toca la fila.

### Qué fila y quién

Cambiar estado es un `UPDATE job_offers SET status = $1 WHERE id = $2 AND user_id = $3`. Una fila. La de esa oferta. Solo si `auth()` te da ese `user_id`. El índice `(user_id, status)` sirve para pintar el tablero: “mis ofertas en esta columna”.

### Preguntas de entrevista para esta fase

1. ¿Por qué el estado es un enum y no un `text`?
2. ¿Qué impide saltar de `interested` a `offer`?
3. Cambias un estado: ¿qué fila se actualiza y quién puede hacerlo?
4. ¿Para qué sirve el índice `(user_id, status)`?
5. ¿Qué queda fuera (drag-and-drop, LinkedIn, scrapers)?

Cuando las respondas en voz alta, sin mirar, Fase 4 está cerrada.
