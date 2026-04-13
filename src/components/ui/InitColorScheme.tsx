"use client";

import { getInitColorSchemeScript } from "@mui/material/styles";

export default function InitColorScheme() {
  return getInitColorSchemeScript({
    attribute: "data-mui-color-scheme",
    defaultMode: "system"
  });
}

