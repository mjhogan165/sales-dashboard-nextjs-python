import { promises as fs } from "fs";
import path from "path";
import type { SalesData } from "@/Types/sales";
import DashboardClient from "@/components/DashboardClient";

async function getData(): Promise<SalesData> {
  const filePath = path.join(
    process.cwd(),
    "..",
    "analysis",
    "output",
    "results.json",
  );

  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents) as SalesData;
}

export default async function Home() {
  const data = await getData();

  return <DashboardClient data={data} />;
}
