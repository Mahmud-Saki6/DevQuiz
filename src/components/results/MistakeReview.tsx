"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type WrongAnswer = {
  topic: string;
  questionText: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  explanation: string;
};

export default function MistakeReview({ wrongAnswers }: { wrongAnswers: WrongAnswer[] }) {
  if (!wrongAnswers.length) return null;

  return (
    <Box>
      <Typography fontWeight={900} sx={{ mb: 1 }}>
        Mistake review
      </Typography>
      <Stack spacing={1}>
        {wrongAnswers.map((a, idx) => (
          <Accordion key={idx} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip size="small" label={a.topic} variant="outlined" />
                <Typography fontWeight={800}>{a.questionText}</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                <Typography color="error.main" fontWeight={800}>
                  Your answer: {a.options?.[a.selectedIndex] ?? `Option ${a.selectedIndex + 1}`}
                </Typography>
                <Typography color="success.main" fontWeight={800}>
                  Correct answer: {a.options?.[a.correctIndex] ?? `Option ${a.correctIndex + 1}`}
                </Typography>
                <Typography color="text.secondary">{a.explanation}</Typography>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
}

