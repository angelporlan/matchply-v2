# Roadmap

La ruta detallada (criterio de cierre, qué queda fuera, producto final) está en [PATH.md](PATH.md).

Una etapa, un concepto. No se abre la siguiente si la anterior no se puede explicar en voz alta.

## Dónde estamos

| Etapa | Nombre | Estado |
| --- | --- | --- |
| 0 | Cimiento (Next + healthcheck) | hecha |
| 1 | Datos (Supabase Postgres + Drizzle) | hecha |
| 2 | Identidad (registro / sesión) | hecha |
| 3 | CV estructurado + editor | hecha |
| 4 | Ofertas y estados | hecha |
| 5 | Motor IA (proveedor + skills + runner) | hecha |
| 6 | Skill `match_offer` | hecha |
| 7 | Skill `optimize_cv` | hecha |
| 8 | Skill `rewrite_section` | hecha |
| 9 | PDF | hecha |
| 10 | Stripe + cuota | hecha |
| 11 | Lanzar en Vercel | actual |

## Producto final v2

Registro → CV estructurado → oferta → match → optimizar → PDF → pago si se acaba la cuota.

## Qué no se copia de v1

- Archivos de 2.000 líneas.
- STAR, MCP, extensión y research en el primer producto.
- Auth / Realtime / Edge Functions de Supabase.
- Varios proveedores de IA a la vez.
- API keys de usuario en texto plano.
- Prompts, Stripe y Kanban en el mismo pull request.
