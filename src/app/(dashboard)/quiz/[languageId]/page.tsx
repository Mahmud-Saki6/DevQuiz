import Link from "next/link";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export const dynamic = "force-dynamic";

export default async function TopicListPage({
  params
}: {
  params: { languageId: string };
}) {
  if (!isDatabaseConfigured()) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={800}>
            Topics unavailable
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Add DATABASE_URL in Netlify (Site settings → Environment variables) and redeploy to load
            languages and topics.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const language = await prisma.language.findUnique({
    where: { id: params.languageId },
    include: { topics: { orderBy: { order: "asc" } } }
  });

  if (!language) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={800}>
            Language not found
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={900} color="primary.main">
            {language.icon ?? "💻"} {language.name} Topics
          </Typography>
          <Typography color="text.secondary">
            Choose a topic to start an AI-generated quiz.
          </Typography>
        </Stack>
        <List sx={{ mt: 2 }}>
          {language.topics.map((t) => (
            <ListItemButton
              key={t.id}
              component={Link}
              href={`/quiz/${language.id}/${t.id}`}
            >
              <ListItemText primary={t.title} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

