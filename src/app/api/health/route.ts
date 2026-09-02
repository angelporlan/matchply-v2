import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    ok: true,
    app: env.appName,
    env: env.nodeEnv,
  });
}
