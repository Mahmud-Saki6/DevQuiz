import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ streak: 0 });
  if (!isDatabaseConfigured()) return NextResponse.json({ streak: 0 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { streak: true }
  });
  return NextResponse.json({ streak: user?.streak ?? 0 });
}

