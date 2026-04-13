import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { isDatabaseConfigured, prisma } from "@/lib/db";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  email: z.string().trim().email(),
  password: z.string().min(6)
});

export async function POST(req: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured", message: "Add DATABASE_URL in Netlify environment variables." },
        { status: 503 }
      );
    }
    const body = await req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email }
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(parsed.data.password, 10);
    await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        password: hash
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Registration failed", message },
      { status: 500 }
    );
  }
}

