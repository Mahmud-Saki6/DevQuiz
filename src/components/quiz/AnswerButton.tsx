"use client";

import Button from "@mui/material/Button";

export default function AnswerButton({
  text,
  disabled,
  onClick,
  state
}: {
  text: string;
  disabled: boolean;
  onClick: () => void;
  state: "neutral" | "correct" | "incorrect";
}) {
  const bg = state === "correct" ? "#9aeabc" : state === "incorrect" ? "#ff9393" : "#fff";
  return (
    <Button
      variant="outlined"
      fullWidth
      disabled={disabled}
      onClick={onClick}
      sx={{
        justifyContent: "flex-start",
        bgcolor: bg,
        borderColor: disabled && state !== "neutral" ? "transparent" : "#222",
        color: "#222",
        "&:hover": { bgcolor: disabled ? bg : "#222", color: disabled ? "#222" : "#fff" }
      }}
    >
      {text}
    </Button>
  );
}

