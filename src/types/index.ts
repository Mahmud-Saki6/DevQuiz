export interface Question {
  id: string;
  text: string;
  codeSnippet?: string | null;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: string;
}

export interface Answer {
  questionId: string;
  questionText: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  topic: string;
  explanation: string;
}

export type Category = "all" | "frontend" | "backend" | "database" | "devops" | "ai-ml";

