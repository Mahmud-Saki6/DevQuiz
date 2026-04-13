import { z } from "zod";

export const questionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  codeSnippet: z.string().nullable().optional(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.string().min(1)
});

export const generateResponseSchema = z.object({
  questions: z.array(questionSchema).min(1)
});

export function buildPrompt(params: {
  language: string;
  topic: string;
  difficulty: string;
  count: number;
}) {
  const { language, topic, difficulty, count } = params;
  return `
You are an expert programming educator. Generate exactly ${count} multiple-choice 
questions to test practical understanding of "${topic}" in ${language}.

Rules:
- Difficulty: ${difficulty}
- Every question must test real-world practical usage, not just definitions
- At least 60% of questions must include a code snippet
- Code snippets should be realistic, concise (max 10 lines), and contain the 
  key concept being tested
- Options must be plausible — wrong answers should be common misconceptions
- Explanations must be clear and educational (2-3 sentences)

Return ONLY valid JSON (no markdown, no backticks) in this exact shape:
{
  "questions": [
    {
      "id": "unique_id_string",
      "text": "Question text here?",
      "codeSnippet": "optional code string or null",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is correct and others are wrong.",
      "topic": "${topic}",
      "difficulty": "${difficulty}"
    }
  ]
}
`.trim();
}

