import { getStats } from "@/app/admin/_actions/stats";
import { StatsEditor } from "./_components/StatsEditor";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const result = await getStats();

  if (!result.success) {
    return (
      <p className="text-red-600 text-sm">
        統計値の取得に失敗しました: {result.error}
      </p>
    );
  }

  return <StatsEditor initialStats={result.data} />;
}
