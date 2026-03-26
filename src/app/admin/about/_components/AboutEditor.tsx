"use client";

import { useState } from "react";
import { updateAboutSections } from "@/app/admin/_actions/about";
import { Button } from "@/components/ui/Button";

type AboutSection = {
  id: string;
  section_key: string;
  content: {
    title?: string;
    body?: string;
  };
};

const SECTION_LABELS: Record<string, string> = {
  mission: "私たちのミッション",
  features: "活動の特徴",
  schedule: "活動スケジュール",
};

type Props = {
  initialSections: AboutSection[];
};

export function AboutEditor({ initialSections }: Props) {
  const [sections] = useState(initialSections);
  const [editing, setEditing] = useState<Record<string, { title: string; body: string }>>(
    Object.fromEntries(
      initialSections.map((s) => [
        s.section_key,
        {
          title: s.content.title ?? "",
          body: s.content.body ?? "",
        },
      ])
    )
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const updates = sections.map((s) => ({
      id: s.id,
      content: editing[s.section_key],
    }));

    const result = await updateAboutSections(updates);

    if (result.success) {
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
      <h2 className="text-xl font-bold text-foreground mb-6">「私たちについて」の編集</h2>

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6"
          >
            <h3 className="text-lg font-bold text-foreground mb-4">
              {SECTION_LABELS[section.section_key] ?? section.section_key}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  タイトル
                </label>
                <input
                  type="text"
                  value={editing[section.section_key]?.title ?? ""}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev,
                      [section.section_key]: {
                        ...prev[section.section_key],
                        title: e.target.value,
                      },
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  本文
                </label>
                <textarea
                  rows={6}
                  value={editing[section.section_key]?.body ?? ""}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev,
                      [section.section_key]: {
                        ...prev[section.section_key],
                        body: e.target.value,
                      },
                    }))
                  }
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-16 bg-white/50 rounded-2xl border border-white/60">
            <p className="text-foreground/60 text-sm">
              Aboutセクションがありません。Supabaseダッシュボードで初期データを登録してください。
            </p>
          </div>
        )}

        {message && (
          <p className={`text-sm px-4 py-3 rounded-xl ${message.startsWith("エラー") ? "text-red-600 bg-red-50" : "text-green-700 bg-green-50"}`}>
            {message}
          </p>
        )}

        {sections.length > 0 && (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : "保存する"}
          </Button>
        )}
      </div>
    </div>
  );
}
