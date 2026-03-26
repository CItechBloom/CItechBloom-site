import { createServerSupabaseClient } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const [statsResult, membersResult] = await Promise.all([
    supabase.from("site_stats").select("key, value"),
    supabase.from("members").select("id, is_visible"),
  ]);

  const stats = statsResult.data ?? [];
  const members = membersResult.data ?? [];
  const visibleMembers = members.filter((m) => "is_visible" in m && m.is_visible);

  const cards = [
    {
      label: "統計値",
      value: `${stats.length} 項目`,
      href: "/admin/stats",
      color: "bg-gold/10 text-gold",
    },
    {
      label: "メンバー",
      value: `${visibleMembers.length} / ${members.length} 人公開中`,
      href: "/admin/members",
      color: "bg-green/10 text-green",
    },
    {
      label: "私たちについて",
      value: "セクション編集",
      href: "/admin/about",
      color: "bg-blue-50 text-blue-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, href, color }) => (
        <Link
          key={href}
          href={href}
          className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-foreground/60 mb-1">{label}</p>
          <p className={cn("text-lg font-bold", color)}>{value}</p>
        </Link>
      ))}
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
