/**
 * Un solo sitio para leer variables de entorno.
 * En fases siguientes, las secretas se validan aquí al arrancar
 * para no descubrir un `undefined` a mitad de una request.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Matchply",
};
