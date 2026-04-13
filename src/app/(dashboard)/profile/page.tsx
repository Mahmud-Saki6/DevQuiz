import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      sessions: {
        orderBy: { completedAt: "desc" },
        take: 20,
        include: { topic: { include: { language: true } } }
      }
    }
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={900} color="primary.main">
            Profile
          </Typography>
          <Typography color="text.secondary">
            {user?.email} • Streak: {user?.streak ?? 0}
          </Typography>
          <Typography fontWeight={800}>Recent sessions</Typography>
          <Stack spacing={1}>
            {user?.sessions.map((s) => (
              <Paper key={s.id} variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={800}>
                  {s.topic.language.name} • {s.topic.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.score}/{s.total} • {s.difficulty} •{" "}
                  {new Date(s.completedAt).toISOString().replace("T", " ").replace("Z", " UTC")}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

