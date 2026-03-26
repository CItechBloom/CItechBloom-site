"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { SafeUrlSchema } from "@/lib/validations";
import { z } from "zod";

type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string };

type Stat = {
  id: string;
  key: string;
  value: string;
};

export async function getStats(): Promise<ActionResult<Stat[]>> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_stats")
    .select("id, key, value")
    .order("key");

  if (error) return { success: false, error: "統計値の取得に失敗しました" };
  return { success: true, data: data as Stat[] };
}

const UpdateSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  value: z.string(),
});

export async function updateStats(
  updates: { id: string; key: string; value: string }[]
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const parsed = z.array(UpdateSchema).safeParse(updates);
  if (!parsed.success) return { success: false, error: "入力が不正です" };

  const supabase = createAdminClient();

  for (const { id, key, value } of parsed.data) {
    // community_invite_url は https:// のみ許可（空文字は許容）
    if (key === "community_invite_url" && value !== "") {
      const urlResult = SafeUrlSchema.safeParse(value);
      if (!urlResult.success) {
        return {
          success: false,
          error: `コミュニティ招待URL: ${urlResult.error.issues[0].message}`,
        };
      }
    }

    const { error } = await supabase
      .from("site_stats")
      .update({ value })
      .eq("id", id);

    if (error) {
      return { success: false, error: `${key} の保存に失敗しました` };
    }
  }

  return { success: true, data: null };
}
