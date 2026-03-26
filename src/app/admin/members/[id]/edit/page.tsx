"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { MemberForm } from "@/app/admin/members/_components/MemberForm";
import type { MemberFormData } from "@/lib/validations";

export default function EditMemberPage() {
  const params = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<(MemberFormData & { image_url?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) {
        setInitialData({
          name: data.name as string,
          role: data.role as string,
          bio: data.bio as string,
          year: data.year as string,
          department: (data.department as string) ?? "",
          display_order: data.display_order as number,
          is_visible: data.is_visible as boolean,
          image_url: (data.image_url as string) ?? undefined,
        });
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return <p className="text-foreground/60 text-sm">読み込み中...</p>;
  }

  if (!initialData) {
    return <p className="text-red-600 text-sm">メンバーが見つかりませんでした。</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">メンバー編集</h2>
      <MemberForm memberId={params.id} initialData={initialData} />
    </div>
  );
}
