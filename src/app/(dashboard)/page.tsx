import { prisma } from "@/lib/db";
import HomeClient from "@/components/home/HomeClient";

export default async function DashboardHome() {
  const languages = await prisma.language.findMany({
    orderBy: { name: "asc" },
    include: { topics: { orderBy: { order: "asc" } } }
  });

  return <HomeClient languages={languages} />;
}

