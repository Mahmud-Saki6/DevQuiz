"use client";

import { PropsWithChildren } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CssVarsProvider } from "@mui/material/styles";

import { theme } from "@/theme";

export default function ThemeRegistry({ children }: PropsWithChildren) {
  return (
    <AppRouterCacheProvider>
      <CssVarsProvider
        theme={theme}
        defaultMode="system"
        attribute="data-mui-color-scheme"
      >
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </AppRouterCacheProvider>
  );
}

