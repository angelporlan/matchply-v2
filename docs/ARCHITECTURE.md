# Arquitectura

## Stack cerrado

| Pieza | Elección | Para qué | Qué no es |
| --- | --- | --- | --- |
| App | Next.js 14 + TS + Tailwind | UI y APIs cortas | Un backend Python |
| Hosting app | Vercel | Push → preview → prod | El sitio para workers eternos |
| Base de datos | Supabase (Postgres) | Datos persistentes | Auth / Storage / Realtime de momento |
| Acceso a datos | Drizzle | Schema y queries | Prisma, cliente mágico de Supabase |
| Auth | Nuestra (cookie + hash) | Quién eres | Supabase Auth |
| IA | 1 proveedor + runner de skills | Match y optimizar | LangChain, agentes, embeddings |
| PDF | Servidor, etapa 9 | Descargar CV | Generar en el navegador |
| Pago | Stripe, etapa 10 | Cuota free vs pro | El núcleo del producto |

Si una pieza no está en esta tabla, no entra hasta el producto final.

## Fase 11 (hoy)

```text
registro → CV JSON → oferta
  → match_offer (score, gaps, evidence) se guarda en la oferta
  → optimize_cv propone; el usuario aplica secciones a un CV nuevo
  → rewrite_section en el editor (misma runner)
  → GET /api/cvs/:id/pdf
  → cuota: ai_runs este mes; webhook Stripe → subscriptionStatus
```

La clave es `GEMINI_API_KEY` en el servidor. Un proveedor. Las skills `match_offer`, `optimize_cv` y `rewrite_section` son filas. El PDF se genera en el servidor. Stripe escribe `subscriptionStatus` por webhook. El runner mira la cuota antes de llamar al modelo.

## Destino (producto)

```text
navegador
   |
   v
Vercel  (Next.js)
   |-- páginas y Server Actions
   |-- route handlers (health, pdf, stripe webhook, ia)
   |
   |-- lib/casos de uso     ownership, cuotas, aplicar parches de CV
   |-- lib/ai/runner        una skill por request
   |-- lib/ai/provider      un cliente HTTP
   |
   v
Supabase Postgres
   users, sessions, cvs, job_offers, skills, ai_runs
```

Una request de IA = una skill = una respuesta. Si algún día una skill o el PDF se pasa del timeout de Vercel, sale un worker. No antes.

## Carpetas

```text
src/
  app/             rutas (páginas y APIs)
  components/      UI reutilizable
  lib/             casos de uso y utilidades sin JSX
  db/              cliente Drizzle + schema
```

Regla: `app/` enruta, `components/` pinta, `lib/` decide, `db/` habla SQL. Si un archivo mezcla tres, se parte.

## Skills

Las skills son datos (tabla + seed en git), no un `if` de 2.000 líneas.

```text
optimize_cv | match_offer | rewrite_section | echo
        \           |              /
         \          |             /
          v         v            v
              runner único
```

Añadir una skill nueva no toca el cliente HTTP.

## CV

Fuente de verdad: JSON estructurado. Markdown y PDF son proyecciones.

## Límites duros

- Nada de archivos de 50 KB.
- Nada de `any` nuevo.
- Nada de lógica de negocio en un componente cliente.
- Nada de `NEXT_PUBLIC_` en secretos.
- Cada feature nueva entra en su carpeta, no en un cajón global.
