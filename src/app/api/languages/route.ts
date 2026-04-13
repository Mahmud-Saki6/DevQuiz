import { NextResponse } from "next/server";

import { isDatabaseConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        languages: [],
        error: "DATABASE_URL is not configured. Add it in Netlify → Site settings → Environment variables."
      },
      { status: 200 }
    );
  }
  const languages = await prisma.language.findMany({
    orderBy: { name: "asc" }
  });
  return NextResponse.json({ languages });
}

