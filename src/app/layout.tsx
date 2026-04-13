import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/components/ui/Providers";
import ThemeRegistry from "@/components/ui/ThemeRegistry";
import InitColorScheme from "@/components/ui/InitColorScheme";

export const metadata: Metadata = {
  title: "DevQuiz - AI-Powered Programming Quiz",
  description: "Test your coding knowledge with AI-generated questions"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorScheme />
        <ThemeRegistry>
          <Providers>{children}</Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}

