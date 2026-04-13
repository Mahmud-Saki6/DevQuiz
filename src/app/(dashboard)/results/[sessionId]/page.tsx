import { isDatabaseConfigured, prisma } from "@/lib/db";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ScoreSummary from "@/components/results/ScoreSummary";
import TopicPerformanceChart from "@/components/results/TopicPerformanceChart";
import WeakTopicsPanel from "@/components/results/WeakTopicsPanel";
import MistakeReview from "@/components/results/MistakeReview";
import ResultsActions from "@/components/results/ResultsActions";

export const dynamic = "force-dynamic";

type Answer = {
  topic: string;
  isCorrect: boolean;
  questionText: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  explanation: string;
};

export default async function ResultsPage({
  params
}: {
  params: { sessionId: string };
}) {
  if (!isDatabaseConfigured()) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography fontWeight={900} sx={{ mb: 1 }}>
            Results unavailable
          </Typography>
          <Typography color="text.secondary">
            Set DATABASE_URL in your hosting environment (Netlify → Environment variables) so the
            app can load quiz sessions from the database.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const session = await prisma.quizSession.findUnique({
    where: { id: params.sessionId },
    include: { topic: { include: { language: true } } }
  });

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography fontWeight={900}>Session not found</Typography>
        </Paper>
      </Container>
    );
  }

  const answers = (session.answers as unknown as Answer[]) ?? [];
  const total = session.total;
  const score = session.score;
  const correct = answers.filter((a) => a.isCorrect).length;
  const missed = total - correct;

  const byTopic = new Map<string, { correct: number; total: number }>();
  for (const a of answers) {
    const k = a.topic || session.topic.title;
    const cur = byTopic.get(k) ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (a.isCorrect) cur.correct += 1;
    byTopic.set(k, cur);
  }
  const topicData = Array.from(byTopic.entries()).map(([topic, v]) => ({
    topic,
    accuracy: v.total ? Math.round((v.correct / v.total) * 100) : 0
  }));

  const weakTopics = topicData.filter((t) => t.accuracy < 60).map((t) => t.topic);
  const wrong = answers.filter((a) => !a.isCorrect);
  const summary = `DevQuiz: ${correct}/${total} (${Math.round(
    (correct / total) * 100
  )}%) on ${session.topic.language.name} / ${session.topic.title}`;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={900} color="primary.main">
            Results
          </Typography>
          <Typography color="text.secondary">
            {session.topic.language.name} • {session.topic.title} • {session.difficulty}
          </Typography>
        </Box>

        <ScoreSummary score={score} total={total} correct={correct} missed={missed} />

        <Paper sx={{ p: 2 }}>
          <Typography fontWeight={900} sx={{ mb: 2 }}>
            Topic Performance
          </Typography>
          <TopicPerformanceChart data={topicData} />
        </Paper>

        <WeakTopicsPanel
          weakTopics={weakTopics}
          languageId={session.topic.language.id}
          difficulty={session.difficulty as "easy" | "medium" | "hard"}
          topicId={session.topicId}
        />

        <MistakeReview wrongAnswers={wrong} />

        <ResultsActions summary={summary} />
      </Stack>
    </Container>
  );
}

