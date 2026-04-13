import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { randomInt } from "crypto";

import {
  buildPrompt,
  generateResponseSchema,
} from "@/lib/ai";

const bodySchema = z.object({
  language: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  count: z.number().int().min(1).max(30)
});

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      {
        error: "Missing GEMINI_API_KEY",
        message:
          "Set GEMINI_API_KEY in your .env file and restart the dev server."
      },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { language, topic, difficulty, count } = parsed.data;
  const prompt = buildPrompt({ language, topic, difficulty, count });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const candidateModels = [
      // Newer stable IDs (older 1.5 models may be retired and 404)
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.5-pro",
      // Common fallbacks (availability varies by project/region)
      "gemini-2.0-flash",
      "gemini-2.0-pro"
    ];

    let text = "";
    let lastErr: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const response = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        });
        text = response.response.text();
        if (text?.trim()) break;
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        // If the model is not found / unsupported, try next model.
        if (msg.includes("404") || msg.toLowerCase().includes("not found")) {
          continue;
        }
        // If the model is temporarily overloaded, try next model.
        if (
          msg.includes("503") ||
          msg.toLowerCase().includes("service unavailable") ||
          msg.toLowerCase().includes("high demand")
        ) {
          continue;
        }
        // Other errors (auth, quota, etc.) should fail fast.
        throw err;
      }
    }

    if (!text?.trim()) {
      const msg =
        lastErr instanceof Error ? lastErr.message : "No supported Gemini model available.";
      return NextResponse.json(
        {
          error: "Failed to generate questions",
          message: msg
        },
        { status: 502 }
      );
    }

    const clean = text.replace(/```json|```/g, "").trim();

    let json: unknown;
    try {
      json = JSON.parse(clean);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: clean.slice(0, 500) },
        { status: 502 }
      );
    }

    const validated = generateResponseSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json(
        { error: "AI response shape invalid", details: validated.error.flatten() },
        { status: 502 }
      );
    }

    // Make quizzes more challenging: shuffle options and re-map correctIndex.
    const shuffled = {
      questions: validated.data.questions.map((q) => {
        const entries = q.options.map((text, idx) => ({ text, idx }));
        // Fisher–Yates shuffle (crypto-backed)
        for (let i = entries.length - 1; i > 0; i--) {
          const j = randomInt(0, i + 1);
          [entries[i], entries[j]] = [entries[j], entries[i]];
        }
        const newOptions = entries.map((e) => e.text);
        const newCorrectIndex = entries.findIndex((e) => e.idx === q.correctIndex);
        return {
          ...q,
          options: newOptions,
          correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0
        };
      })
    };

    return NextResponse.json(shuffled);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gemini request failed";
    const status = message.toLowerCase().includes("aborted") ? 504 : 502;
    return NextResponse.json(
      { error: "Failed to generate questions", message },
      { status }
    );
  } finally {
    clearTimeout(timeout);
  }
}

