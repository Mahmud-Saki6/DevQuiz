import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ streak: 0 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { streak: true }
  });
  return NextResponse.json({ streak: user?.streak ?? 0 });
}

