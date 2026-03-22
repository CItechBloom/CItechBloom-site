"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type MemberListItem = {
  id: string;
  name: string;
  role: string;
  year: string;
  display_order: number;
  is_visible: boolean;
  image_url: string | null;
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("members")
      .select("id, name, role, year, display_order, is_visible, image_url")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (cancelled) return;
        if (data) setMembers(data as MemberListItem[]);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleVisibility(id: string, currentValue: boolean) {
    await supabase.from("members").update({ is_visible: !currentValue }).eq("id", id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_visible: !currentValue } : m))
    );
  }

  async function deleteMember(id: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    await supabase.from("members").delete().eq("id", id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  if (loading) {
    return <p className="text-foreground/60 text-sm">読み込み中...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">メンバー管理</h2>
        <Link href="/admin/members/new">
          <Button>新規追加</Button>
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-2xl border border-white/60">
          <p className="text-foreground/60 text-sm">メンバーが登録されていません。</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm p-4"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-green/30 flex items-center justify-center shrink-0 overflow-hidden">
                {member.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-foreground/70">
                    {member.name[0]}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{member.name}</p>
                <p className="text-xs text-foreground/60">
                  {member.role} ・ {member.year} ・ 順序: {member.display_order}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleVisibility(member.id, member.is_visible)}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    member.is_visible
                      ? "bg-green/10 text-green"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {member.is_visible ? "公開中" : "非公開"}
                </button>
                <Link
                  href={`/admin/members/${member.id}/edit`}
                  className="text-xs text-gold hover:text-gold/80 font-medium"
                >
                  編集
                </Link>
                <button
                  onClick={() => deleteMember(member.id, member.name)}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
