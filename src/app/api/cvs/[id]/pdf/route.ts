import { NextResponse } from "next/server";
import { getOwnedCv } from "@/db/cvs";
import { auth } from "@/lib/auth";
import { parseStoredCv } from "@/lib/cv";
import { cvToPdf } from "@/lib/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const row = await getOwnedCv(params.id, session.userId);
  if (!row) {
    return new NextResponse("Not found", { status: 404 });
  }
  const bytes = await cvToPdf(row.title, parseStoredCv(row.data));
  const filename = `${row.title.replace(/[^\w.-]+/g, "_")}.pdf`;
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
