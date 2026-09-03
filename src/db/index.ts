import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  postgresClient: ReturnType<typeof postgres> | undefined;
};

function getClient() {
  // prepare: false — el pooler de Supabase en modo transaction no soporta
  // prepared statements. El cache en globalThis evita una conexión nueva
  // en cada recarga de `next dev`.
  globalForDb.postgresClient ??= postgres(env.databaseUrl, {
    prepare: false,
    max: 1,
  });
  return globalForDb.postgresClient;
}

export function getDb() {
  return drizzle(getClient(), { schema });
}

export async function ping() {
  await getDb().execute(sql`select 1`);
}
