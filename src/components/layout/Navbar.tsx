"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import { setUser } from "@/store/features/userSlice";

export default function Navbar() {
  const { data } = useSession();
  const dispatch = useDispatch();
  const streak = useSelector((s: RootState) => s.user.streak);

  useEffect(() => {
    dispatch(
      setUser({
        name: data?.user?.name ?? null,
        email: data?.user?.email ?? null
      })
    );
  }, [data?.user?.email, data?.user?.name, dispatch]);

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper" }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" fontWeight={900} color="primary.main">
          DevQuiz
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalFireDepartmentIcon color="warning" fontSize="small" />
          <Typography variant="body2" fontWeight={700}>
            {streak}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => signOut({ callbackUrl: "/login" })}>
          Sign out
        </Button>
      </Toolbar>
    </AppBar>
  );
}

