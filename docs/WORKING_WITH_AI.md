# Cómo usar IA en este repo sin repetir v1

La IA no es el problema. El problema es aceptar su salida como si fuera tuya.

## Regla de oro

No merges un cambio que no puedas explicar en una pizarra, sin el editor abierto.

## Flujo de trabajo

1. Escribes tú el objetivo en una frase: “GET /api/health devuelve `{ ok: true }`”.
2. Pides a la IA el cambio **más pequeño** que cumple esa frase.
3. Lees cada línea. Si hay una que no entiendes, no se queda.
4. Borras lo que no pediste (utilidades extra, abstracciones, comentarios genéricos).
5. Arrancas la app y pruebas a mano ese caso.
6. Cierras explicando el cambio en voz alta. Si tartamudeas, reescribes.

## Lo que no se le pide a la IA

- “Hazme el dashboard”.
- “Añade auth, Stripe e IA”.
- “Deja el código production-ready”.

Eso genera archivos dios. Exactamente lo que rompió v1 y la entrevista.

## Lo que sí se le pide

- “Escribe solo `src/app/api/health/route.ts` con un GET que devuelva JSON.”
- “Separa esta función de 80 líneas en dos, sin añadir dependencias.”
- “Explícame qué hace este callback de Auth.js, línea a línea.”

## Tamaño máximo por PR mental

Si el diff toca más de 5 archivos o 200 líneas, se parte. La velocidad que importa ahora no es features por semana; es features que puedes defender.
