import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/db";

const answerSchema = z.object({
  questionId: z.string(),
  questionText: z.string(),
  options: z.array(z.string()).length(4),
  selectedIndex: z.number().int().min(0).max(3),
  correctIndex: z.number().int().min(0).max(3),
  isCorrect: z.boolean(),
  topic: z.string(),
  explanation: z.string()
});

const bodySchema = z.object({
  languageId: z.string().min(1),
  topicId: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  answers: z.array(answerSchema)
});

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured", message: "Add DATABASE_URL in Netlify environment variables." },
      { status: 503 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const created = await prisma.quizSession.create({
    data: {
      userId: user.id,
      languageId: parsed.data.languageId,
      topicId: parsed.data.topicId,
      difficulty: parsed.data.difficulty,
      score: parsed.data.score,
      total: parsed.data.total,
      answers: parsed.data.answers
    }
  });

  // streak: increment if first completion today
  const now = new Date();
  const lastActive = user.lastActiveAt;
  let newStreak = user.streak;

  if (!lastActive) {
    newStreak = 1;
  } else if (!isSameDay(lastActive, now)) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    newStreak = isSameDay(lastActive, yesterday) ? user.streak + 1 : 1;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      streak: newStreak,
      lastActiveAt: now
    }
  });

  return NextResponse.json({ sessionId: created.id });
}

