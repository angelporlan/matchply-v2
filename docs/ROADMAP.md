# Roadmap

Una fase, un concepto. No se abre la siguiente si la anterior no se puede explicar en voz alta.

## Fase 0 — Cimiento (actual)

Next.js + TypeScript + Tailwind + healthcheck.

Criterio de cierre: las 5 preguntas de `docs/EXPLAIN.md`.

## Fase 1 — Base de datos

Postgres + Drizzle. Una tabla `users` mínima. Un script `db:push`.

Aprender: qué es un ORM, qué es una migración, por qué no guardamos secretos en el schema.

## Fase 2 — Autenticación

Registro + login con email y contraseña. Hash con bcrypt. Sesión con Auth.js.

Aprender: qué viaja en la cookie, por qué no se guarda la contraseña en claro, diferencia JWT vs sesión en base de datos.

## Fase 3 — CV base

Un usuario tiene un CV en Markdown. Crear, editar, listar. Sin PDF. Sin IA.

Aprender: ownership (`cv.userId === session.user.id`), Server Actions, validación de input.

## Fase 4 — Candidaturas

Tabla `job_offer` y un tablero simple (columnas por estado). Sin drag-and-drop al principio.

Aprender: máquina de estados (`interested → applied → interview → offer → rejected`), índices, no usar `text` libre para estados.

## Fase 5 — PDF

Un endpoint que convierte el Markdown del CV en PDF.

Aprender: por qué esto va en el servidor, streaming de binarios, límites de memoria.

## Fase 6 — IA, un solo caso de uso

Un botón: “adapta este CV a esta oferta”. Un proveedor. Un prompt. Un resultado editable.

Aprender: el modelo no es una caja mágica; hay sistema, usuario, parseo, fallos, coste.

## Fase 7 — Cobro

Stripe Checkout + webhook + un flag `subscriptionStatus`.

Aprender: el webhook es la fuente de verdad, no el redirect de éxito.

## Después, solo si lo anterior es sólido

Extensión de LinkedIn, MCP, research, invitados, admin. Son multiplicadores, no el producto.

## Qué no se copia de v1

- Archivos de 2.000 líneas.
- Modal y página duplicados.
- API keys de usuario en texto plano.
- Prompts, Stripe, OAuth y Kanban en el mismo pull request.
