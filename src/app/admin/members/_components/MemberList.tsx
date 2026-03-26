"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  toggleMemberVisibility,
  deleteMember,
} from "@/app/admin/_actions/members";
import { Button } from "@/components/ui/Button";
import type { MemberListItem } from "@/app/admin/_actions/members";

type Props = {
  initialMembers: MemberListItem[];
};

export function MemberList({ initialMembers }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const router = useRouter();

  async function handleToggle(id: string, currentValue: boolean) {
    const result = await toggleMemberVisibility(id, currentValue);
    if (result.success) {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_visible: !currentValue } : m))
      );
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    const result = await deleteMember(id);
    if (result.success) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    }
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
                  onClick={() => handleToggle(member.id, member.is_visible)}
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
                  onClick={() => handleDelete(member.id, member.name)}
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
