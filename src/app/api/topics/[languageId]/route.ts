import { NextResponse } from "next/server";

import { isDatabaseConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { languageId: string } }
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ topics: [] });
  }
  const topics = await prisma.topic.findMany({
    where: { languageId: params.languageId },
    orderBy: { order: "asc" }
  });
  return NextResponse.json({ topics });
}

