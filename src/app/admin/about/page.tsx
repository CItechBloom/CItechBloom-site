"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
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

export default function AdminAboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [editing, setEditing] = useState<Record<string, { title: string; body: string }>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("about_sections")
        .select("*")
        .order("section_key");

      if (data) {
        const typedData = data as AboutSection[];
        setSections(typedData);
        setEditing(
          Object.fromEntries(
            typedData.map((s) => [
              s.section_key,
              {
                title: (s.content.title as string) ?? "",
                body: (s.content.body as string) ?? "",
              },
            ])
          )
        );
      }
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    for (const section of sections) {
      const editedContent = editing[section.section_key];
      if (!editedContent) continue;

      const { error } = await supabase
        .from("about_sections")
        .update({ content: editedContent })
        .eq("id", section.id);

      if (error) {
        setMessage(`エラー: ${section.section_key} の保存に失敗しました`);
        setSaving(false);
        return;
      }
    }

    setMessage("保存しました");
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
