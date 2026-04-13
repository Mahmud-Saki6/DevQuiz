"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setLoading(false);
      setError("Password must be at least 6 characters.");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      const text = await res.text();
      setLoading(false);
      try {
        const json = JSON.parse(text) as {
          error?: string;
          message?: string;
          details?: {
            fieldErrors?: Record<string, string[]>;
          };
        };

        const fieldErrors = json.details?.fieldErrors;
        const firstFieldError =
          fieldErrors &&
          (fieldErrors.password?.[0] ||
            fieldErrors.email?.[0] ||
            fieldErrors.name?.[0]);

        if (firstFieldError) {
          setError(firstFieldError);
          return;
        }

        if (json.error && json.message) {
          setError(`${json.error}: ${json.message}`);
        } else {
          setError(json.error ?? json.message ?? "Registration failed");
        }
      } catch {
        setError(text || "Registration failed");
      }
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/");
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={800}>
            Create your DevQuiz account
          </Typography>
          <Stack spacing={2} component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              helperText="Minimum 6 characters"
            />
            {error ? (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            ) : null}
            <Button type="submit" variant="contained" disabled={loading}>
              Create account
            </Button>
            <Button variant="text" onClick={() => router.push("/login")}>
              Already have an account? Sign in
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

