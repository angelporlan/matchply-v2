/**
 * Un solo sitio para leer variables de entorno.
 * Si falta una variable obligatoria, fallamos al arrancar, no en medio de una request.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Matchply",
};

void required;
