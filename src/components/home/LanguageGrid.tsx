"use client";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Language } from "@prisma/client";

export default function LanguageGrid({
  languages,
  selectedLanguageId,
  onSelect
}: {
  languages: Language[];
  selectedLanguageId: string | null;
  onSelect: (l: Language) => void;
}) {
  return (
    <Grid container spacing={2}>
      {languages.map((l) => {
        const selected = l.id === selectedLanguageId;
        return (
          <Grid key={l.id} item xs={12} sm={6} md={4} lg={3}>
            <Card
              variant="outlined"
              sx={{
                borderColor: selected ? "primary.main" : "divider",
                borderWidth: selected ? 2 : 1
              }}
            >
              <CardActionArea onClick={() => onSelect(l)}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontSize={22}>{l.icon ?? "💻"}</Typography>
                    <Typography fontWeight={800}>{l.name}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                    {l.categories.slice(0, 2).map((c) => (
                      <Chip key={c} size="small" label={c} variant="outlined" />
                    ))}
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

