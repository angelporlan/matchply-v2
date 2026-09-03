# Ruta hasta el producto final

Este documento es el plan de avance. Se lee de arriba abajo. No se salta una etapa porque “ya lo hice en v1”.

Producto final (v2, primera versión pública):

> Un candidato se registra, guarda un CV estructurado, pega una oferta, ve un match con lagunas, pide a la IA que adapte el CV, descarga un PDF y, si quiere más de una cuota gratis, paga.

No entra en esa versión: STAR, extensión de Chrome, MCP, research profundo, invitados, panel admin gordo.

## Mapa de etapas

```text
0  Cimiento          Next arranca en local          ✓ hecha
1  Datos             Supabase + Drizzle + users     ✓ hecha
2  Identidad         registro / login / sesión      actual
3  CV                modelo JSON + editor simple
4  Ofertas           pegar oferta + estados
5  Motor IA          1 proveedor + tabla skills + runner
6  Skill match       puntuar CV contra oferta
7  Skill optimize    adaptar CV a la oferta
8  Skill rewrite     reescribir una sección
9  PDF               descargar el CV
10 Cobro             Stripe + cuota
11 Lanzar            Vercel prod + dominio + pulido
```

Cada etapa tiene: qué construyes, qué aprendes, criterio de cierre (lo explicas sin abrir el código) y qué queda fuera.

---

## Etapa 0 — Cimiento (hecha)

**Construyes:** landing mínima + `GET /api/health`.

**Aprendes:** App Router, Server Component, env, Tailwind.

**Cierre:** las 5 preguntas de `docs/EXPLAIN.md`.

**Fuera:** cualquier feature de producto.

---

## Etapa 1 — Datos (hecha)

**Construyes:** proyecto en Supabase (solo Postgres). Drizzle. Tabla `users`. `npm run db:push`. Healthcheck que hace `select 1`.

**Aprendes:** qué es un ORM, `DATABASE_URL`, por qué el secreto no va con `NEXT_PUBLIC_`.

**Cierre:** dibujas usuario → base de datos → respuesta, y explicas la diferencia entre migración y `db:push`.

**Fuera:** Auth de Supabase, Storage, Realtime, RLS.

---

## Etapa 2 — Identidad (actual)

**Construyes:** registro, login, logout. Password hasheada. Cookie de sesión. Ruta `/dashboard` protegida.

**Aprendes:** por qué no se guarda la contraseña en claro, qué viaja en la cookie, qué pasa si alguien llama a una Server Action sin sesión.

**Cierre:** explicas el flujo login → cookie → `auth()` → `userId` en una query.

**Fuera:** Google OAuth, invitados, roles admin.

---

## Etapa 3 — CV estructurado

**Construyes:** un usuario crea un CV. Fuente de verdad: JSON (perfil, experiencia, educación, skills). Editor por secciones + preview. Listar y elegir el CV activo.

**Aprendes:** ownership (`cv.userId === session.user.id`), validar input, no meter SQL en el componente.

**Cierre:** explicas por qué el CV no es un Markdown suelto si luego la IA tiene que tocarlo por secciones.

**Fuera:** PDF, IA, plantillas de 6 temas, TipTap.

---

## Etapa 4 — Ofertas

**Construyes:** pegar título, empresa, descripción (y URL opcional). Lista o tablero simple por estado: `interested → applied → interview → offer → rejected`. Enlazar un CV a la oferta.

**Aprendes:** máquina de estados, enum en schema (no `text` libre), un índice útil.

**Cierre:** cambias un estado y explicas qué fila se actualiza y quién puede hacerlo.

**Fuera:** drag-and-drop, extensión LinkedIn, scrapers, curación masiva.

---

## Etapa 5 — Motor de IA (sin features de producto)

**Construyes:** un cliente HTTP a un solo proveedor. Tabla `skills` (id, version, system, userTemplate, output). Un runner: valida input → monta mensajes → llama → parsea → valida salida. Seed de una skill dummy (`echo`) para probar el tubo.

**Aprendes:** dónde está la API key, qué es un system prompt, qué haces si el modelo devuelve basura.

**Cierre:** explicas el runner en una pizarra, sin hablar de “el agente decide”.

**Fuera:** LangChain, varios proveedores, embeddings, optimizar CVs todavía.

---

## Etapa 6 — Skill `match_offer`

**Construyes:** un botón en la oferta. Entrada: CV JSON + texto de la oferta. Salida: score 0–100, lagunas, evidencias. Se guarda en la oferta.

**Aprendes:** salida estructurada (JSON), rúbrika vs “que el modelo opine”, no fiarse del primer parseo.

**Cierre:** enseñas un resultado y dices qué parte vino del modelo y qué parte validó tu código.

**Fuera:** STAR, entrevistas, research de empresa.

---

## Etapa 7 — Skill `optimize_cv`

**Construyes:** a partir del match (o de la oferta), la IA propone un CV adaptado. El usuario ve el antes/después y acepta o descarta por sección. Se guarda como versión nueva, no se pisa el CV base.

**Aprendes:** el modelo no escribe en tu tabla a ciegas; tú aplicas el parche.

**Cierre:** explicas CV base vs CV adaptado a una oferta.

**Fuera:** veinte modos de prompt, carta de presentación.

---

## Etapa 8 — Skill `rewrite_section`

**Construyes:** en el editor, “reescribe este bullet / esta experiencia para esta oferta”. Reutiliza el runner. Es la tercera skill, no un segundo servicio.

**Aprendes:** cómo añadir una skill sin tocar el cliente HTTP.

**Cierre:** añades la skill en seed + una página de prueba y no modificas el runner.

**Fuera:** marketplace de skills, prompts por usuario.

---

## Etapa 9 — PDF

**Construyes:** un GET autenticado que serializa el CV JSON a PDF y lo descarga.

**Aprendes:** por qué va en el servidor, límites de tiempo/memoria en Vercel, no generar PDFs en el navegador al principio.

**Cierre:** descargas un PDF de tu CV y explicas la request de punta a punta.

**Fuera:** cinco plantillas pixel-perfect, editor visual del PDF.

---

## Etapa 10 — Cobro

**Construyes:** plan free (N matches / optimizaciones al mes) y plan pro. Stripe Checkout + webhook que escribe `subscriptionStatus`. El runner consulta la cuota antes de llamar al modelo.

**Aprendes:** el webhook es la fuente de verdad, no la URL de éxito.

**Cierre:** en test mode, pagas, llega el webhook, la cuota sube.

**Fuera:** equipos, facturas custom, varios precios.

---

## Etapa 11 — Lanzar

**Construyes:** proyecto en Vercel unido al repo. Env de producción (`DATABASE_URL`, `AUTH_SECRET`, clave IA, Stripe live cuando toque). Dominio. Landing con una frase clara. Privacy / terms mínimos.

**Aprendes:** preview vs production, qué secretos nunca van al cliente.

**Cierre:** un desconocido puede registrarse, crear un CV, pegar una oferta, ver un match y descargar PDF.

Eso es producto final v2.

---

## Después del producto final (no antes)

Solo si las 11 etapas se pueden explicar:

1. Google OAuth
2. Storage de Supabase para PDFs
3. Extensión LinkedIn
4. API externa / MCP
5. Worker fuera de Vercel si una skill o el PDF se pasa de timeout
6. Admin para editar skills en caliente

## Regla de avance

```text
¿Puedo explicar la etapa actual en voz alta, sin el editor?
  no → no se abre la siguiente
  sí → se abre la siguiente, y solo esa
```

Si una etapa se alarga más de una semana de calendario, se parte. No se “aprovecha” para colar la siguiente.
