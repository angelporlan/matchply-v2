import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Falta DATABASE_URL. Cópiala al .env desde Supabase → Connect.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: { url: databaseUrl },
  // Solo `public`. No tocamos auth / storage / realtime de Supabase.
  schemaFilter: ["public"],
});
