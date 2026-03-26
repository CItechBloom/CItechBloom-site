import type { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { MemberCard } from "@/components/features/MemberCard";
import type { Member } from "@/types";
import type { MemberRow } from "@/lib/supabase-types";

export const metadata: Metadata = {
  title: "メンバー",
  description: "CITechBloomのメンバーを紹介します。",
};

function toMember(row: MemberRow): Member {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    year: row.year,
    department: row.department ?? undefined,
    imageUrl: row.image_url ?? undefined,
  };
}

async function getMembers(): Promise<Member[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true });

    if (error || !data) return [];
    return (data as MemberRow[]).map(toMember);
  } catch {
    return [];
  }
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-gold font-medium tracking-widest text-sm uppercase mb-3">
          Members
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
          メンバー
        </h1>
        <p className="text-foreground/70 mb-12">
          CITechBloomのメンバーを紹介します。
        </p>

        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 rounded-2xl border border-white/60">
            <p className="text-5xl mb-4">🌸</p>
            <p className="text-xl font-bold text-foreground mb-2">
              準備中
            </p>
            <p className="text-foreground/60 text-sm">
              メンバー紹介はまもなく公開されます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
