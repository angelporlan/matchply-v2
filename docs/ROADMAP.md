# Roadmap

La ruta detallada (criterio de cierre, qué queda fuera, producto final) está en [PATH.md](PATH.md).

Una etapa, un concepto. No se abre la siguiente si la anterior no se puede explicar en voz alta.

## Dónde estamos

| Etapa | Nombre | Estado |
| --- | --- | --- |
| 0 | Cimiento (Next + healthcheck) | actual |
| 1 | Datos (Supabase Postgres + Drizzle) | siguiente |
| 2 | Identidad (registro / sesión) | pendiente |
| 3 | CV estructurado + editor | pendiente |
| 4 | Ofertas y estados | pendiente |
| 5 | Motor IA (proveedor + skills + runner) | pendiente |
| 6 | Skill `match_offer` | pendiente |
| 7 | Skill `optimize_cv` | pendiente |
| 8 | Skill `rewrite_section` | pendiente |
| 9 | PDF | pendiente |
| 10 | Stripe + cuota | pendiente |
| 11 | Lanzar en Vercel | pendiente |

## Producto final v2

Registro → CV estructurado → oferta → match → optimizar → PDF → pago si se acaba la cuota.

## Qué no se copia de v1

- Archivos de 2.000 líneas.
- STAR, MCP, extensión y research en el primer producto.
- Auth / Realtime / Edge Functions de Supabase.
- Varios proveedores de IA a la vez.
- API keys de usuario en texto plano.
- Prompts, Stripe y Kanban en el mismo pull request.
