"use client";

import Link from "next/link";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";

export default function Sidebar() {
  return (
    <Paper sx={{ p: 1 }}>
      <List dense>
        <ListItemButton component={Link} href="/">
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component={Link} href="/profile">
          <ListItemText primary="Profile" />
        </ListItemButton>
      </List>
    </Paper>
  );
}

