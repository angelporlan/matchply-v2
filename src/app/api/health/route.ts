import { NextResponse } from "next/server";
import { ping } from "@/db";
import { env } from "@/lib/env";

// Sin esto Next puede cachear el GET y no llegar a Postgres.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ping();
    return NextResponse.json({
      ok: true,
      app: env.appName,
      env: env.nodeEnv,
      db: true,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        app: env.appName,
        env: env.nodeEnv,
        db: false,
      },
      { status: 503 },
    );
  }
}
