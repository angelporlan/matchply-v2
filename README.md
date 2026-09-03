# Matchply v2

SaaS para buscar empleo: guardar un CV, medirlo contra una oferta y adaptarlo con IA.

Este repositorio es el rebuild desde cero. La versión anterior sigue en [angelporlan/Matchply](https://github.com/angelporlan/Matchply) como archivo de producto, no como base de código.

## Por qué existe v2

v1 avanzó rápido con IA y dejó un producto con buenas ideas, pero con archivos de 70–130 KB que nadie puede explicar de memoria. Aquí la regla es la inversa:

> No se da por buena una pieza hasta poder explicar cómo funciona sin abrir el código.

Si no puedes explicarla, no entra. Si entra, cabe en la cabeza.

## Stack

- App: Next.js 14 + TypeScript + Tailwind, alojada en **Vercel**
- Datos: **Supabase** como Postgres. Acceso con Drizzle. Sin Auth/Realtime de Supabase
- IA: un proveedor + skills versionadas + un runner
- Pago: Stripe, cuando haya cuota que cobrar

## Qué hay ahora (etapa 3)

Tras entrar, creas un CV. La fuente de verdad es JSON (perfil, experiencia, educación, skills), con editor por secciones y preview. Puedes tener varios y marcar uno como activo. Solo ves los tuyos: `cv.userId === session.userId`.

No hay PDF, ni IA, ni TipTap. Eso es deliberado.

| Quieres esto | Está en |
| --- | --- |
| Arrancar en local | más abajo |
| Ruta hasta el producto final | [docs/PATH.md](docs/PATH.md) |
| Roadmap en una página | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Stack y capas | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Qué hace cada archivo de hoy | [docs/EXPLAIN.md](docs/EXPLAIN.md) |
| Cómo trabajar con IA sin repetir v1 | [docs/WORKING_WITH_AI.md](docs/WORKING_WITH_AI.md) |

## Producto final v2

Un candidato se registra, guarda un CV estructurado, pega una oferta, ve un match, adapta el CV, descarga PDF y paga si se acaba la cuota gratis.

## Arrancar

Necesitas Node.js 20+ y un proyecto de [Supabase](https://supabase.com) (solo Postgres: no actives Auth, Storage ni Realtime para esta etapa).

```bash
git clone https://github.com/angelporlan/matchply-v2.git
cd matchply-v2
cp .env.example .env
```

En el dashboard de Supabase: **Connect** → copia la URI del **Shared Pooler** y pégala en `DATABASE_URL` (sustituye `[PASSWORD]`). Si `db:push` falla con el puerto 6543, usa la URI de modo sesión (puerto 5432 en el host `*.pooler.supabase.com`).

```bash
npm install
npm run db:push
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Crea una cuenta en `/register`, un CV en `/dashboard` y edítalo en `/cvs/[id]`. El pulso sigue en [http://localhost:3000/api/health](http://localhost:3000/api/health). En el Table Editor: `users`, `sessions` y `cvs`.

## Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # compilación de producción
npm run start      # servir el build
npm run lint       # ESLint de Next
npm run typecheck  # TypeScript sin emitir archivos
npm run db:push    # sincroniza schema.ts → Postgres (sin archivos de migración)
```

## Límites

- Un archivo de UI no supera ~150 líneas. Si las pasa, se parte.
- Una función hace una cosa.
- No se añade una librería “por si acaso”.
- `main` solo recibe trabajo que ya se puede explicar.
- Se avanza una etapa de [docs/PATH.md](docs/PATH.md) cada vez.
