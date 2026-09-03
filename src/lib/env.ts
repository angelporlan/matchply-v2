/**
 * Un solo sitio para leer variables de entorno.
 * Las secretas se validan al usarse para no descubrir un `undefined`
 * a mitad de una request.
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
  /** Cadena de Postgres. Solo servidor: no lleva `NEXT_PUBLIC_`. */
  get databaseUrl() {
    return required("DATABASE_URL");
  },
};
