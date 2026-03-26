"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/Button";

type Stat = {
  id: string;
  key: string;
  value: string;
};

const STAT_LABELS: Record<string, string> = {
  member_count: "メンバー数",
  years_active: "活動年数",
  hackathon_count: "ハッカソン参加数",
  next_event_info: "次回活動情報",
  community_invite_url: "コミュニティ招待URL",
};

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("site_stats").select("*").order("key");
      if (data) {
        setStats(data as Stat[]);
        setEditing(Object.fromEntries(data.map((s) => [s.id, s.value])));
      }
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    for (const stat of stats) {
      const newValue = editing[stat.id];
      if (newValue !== stat.value) {
        const { error } = await supabase
          .from("site_stats")
          .update({ value: newValue })
          .eq("id", stat.id);
        if (error) {
          setMessage(`エラー: ${stat.key} の保存に失敗しました`);
          setSaving(false);
          return;
        }
      }
    }

    setStats(stats.map((s) => ({ ...s, value: editing[s.id] })));
    setMessage("保存しました");
    setSaving(false);
  };

  const inputClass =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors duration-200";

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">統計値の編集</h2>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
        {stats.map((stat) => (
          <div key={stat.id}>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {STAT_LABELS[stat.key] ?? stat.key}
              <span className="text-foreground/40 ml-2 font-normal">({stat.key})</span>
            </label>
            <input
              type="text"
              value={editing[stat.id] ?? ""}
              onChange={(e) =>
                setEditing((prev) => ({ ...prev, [stat.id]: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        ))}

        {stats.length === 0 && (
          <p className="text-foreground/60 text-sm text-center py-8">
            統計値がありません。Supabaseダッシュボードで初期データを登録してください。
          </p>
        )}

        {message && (
          <p className={`text-sm px-4 py-3 rounded-xl ${message.startsWith("エラー") ? "text-red-600 bg-red-50" : "text-green-700 bg-green-50"}`}>
            {message}
          </p>
        )}

        <div className="pt-2">
          <Button onClick={handleSave} disabled={saving || stats.length === 0}>
            {saving ? "保存中..." : "保存する"}
          </Button>
        </div>
      </div>
    </div>
  );
}
