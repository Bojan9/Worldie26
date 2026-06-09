import { Dashboard } from "@/components/dashboard";
import { getAppData } from "@/lib/app-data";

export default async function Home() {
  const data = await getAppData();
  return <Dashboard data={data} />;
}
