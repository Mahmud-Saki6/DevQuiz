"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/");
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={800}>
            DevQuiz
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Sign in to continue
          </Typography>

          <Stack spacing={2} component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error ? (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            ) : null}
            <Button type="submit" variant="contained" disabled={loading}>
              Sign in
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Button
            fullWidth
            variant="outlined"
            onClick={() => signIn("google")}
          >
            Continue with Google
          </Button>

          <Button
            sx={{ mt: 2 }}
            fullWidth
            variant="text"
            onClick={() => router.push("/register")}
          >
            Create an account
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

