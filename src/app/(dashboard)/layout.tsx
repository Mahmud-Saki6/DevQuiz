import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";

import { authOptions } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <Navbar />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
          gap: 2,
          px: { xs: 2, md: 3 },
          py: 2
        }}
      >
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Sidebar />
        </Box>
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}

