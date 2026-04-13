import { isDatabaseConfigured, prisma } from "@/lib/db";
import HomeClient from "@/components/home/HomeClient";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  if (!isDatabaseConfigured()) {
    return <HomeClient languages={[]} />;
  }
  const languages = await prisma.language.findMany({
    orderBy: { name: "asc" },
    include: { topics: { orderBy: { order: "asc" } } }
  });

  return <HomeClient languages={languages} />;
}

