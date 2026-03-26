"use client";

import { useState } from "react";
import { updateStats } from "@/app/admin/_actions/stats";
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

type Props = {
  initialStats: Stat[];
};

export function StatsEditor({ initialStats }: Props) {
  const [stats, setStats] = useState(initialStats);
  const [editing, setEditing] = useState<Record<string, string>>(
    Object.fromEntries(initialStats.map((s) => [s.id, s.value]))
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const changes = stats
      .filter((s) => editing[s.id] !== s.value)
      .map((s) => ({ id: s.id, key: s.key, value: editing[s.id] }));

    if (changes.length === 0) {
      setMessage("変更はありません");
      setSaving(false);
      return;
    }

    const result = await updateStats(changes);

    if (result.success) {
      setStats(stats.map((s) => ({ ...s, value: editing[s.id] })));
      setMessage("保存しました");
    } else {
      setMessage(`エラー: ${result.error}`);
    }
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
