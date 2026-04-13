import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { languageId: string } }
) {
  const topics = await prisma.topic.findMany({
    where: { languageId: params.languageId },
    orderBy: { order: "asc" }
  });
  return NextResponse.json({ topics });
}

