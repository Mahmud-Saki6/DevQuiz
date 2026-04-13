import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function GET() {
  const languages = await prisma.language.findMany({
    orderBy: { name: "asc" }
  });
  return NextResponse.json({ languages });
}

