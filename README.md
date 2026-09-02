# Matchply v2

SaaS para buscar empleo: optimizar el CV, seguir candidaturas y usar IA con criterio.

Este repositorio es el rebuild desde cero. La versión anterior sigue en [angelporlan/Matchply](https://github.com/angelporlan/Matchply) como archivo de producto, no como base de código.

## Por qué existe v2

v1 avanzó rápido con IA y dejó un producto con buenas ideas, pero con archivos de 70–130 KB que nadie puede explicar de memoria. Aquí la regla es la inversa:

> No se da por buena una pieza hasta poder explicar cómo funciona sin abrir el código.

Si no puedes explicarla, no entra. Si entra, cabe en la cabeza.

## Qué hay ahora (Fase 0)

Una app Next.js 14 que arranca, pinta una landing mínima y responde `GET /api/health`.

No hay autenticación, ni base de datos, ni Stripe, ni IA. Eso es deliberado.

| Quieres esto | Está en |
| --- | --- |
| Arrancar en local | más abajo |
| Qué hace cada archivo | [docs/EXPLAIN.md](docs/EXPLAIN.md) |
| Cómo está montado el sistema | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Orden de las siguientes piezas | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Cómo trabajar con IA sin repetir v1 | [docs/WORKING_WITH_AI.md](docs/WORKING_WITH_AI.md) |

## Arrancar

Necesitas Node.js 20+.

```bash
git clone https://github.com/angelporlan/matchply-v2.git
cd matchply-v2
cp .env.example .env
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La salud de la app está en [http://localhost:3000/api/health](http://localhost:3000/api/health).

## Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # compilación de producción
npm run start      # servir el build
npm run lint       # ESLint de Next
npm run typecheck  # TypeScript sin emitir archivos
```

## Límites de esta fase

- Un archivo de UI no supera ~150 líneas. Si las pasa, se parte.
- Una función hace una cosa.
- No se añade una librería “por si acaso”.
- `main` solo recibe trabajo que ya se puede explicar.
