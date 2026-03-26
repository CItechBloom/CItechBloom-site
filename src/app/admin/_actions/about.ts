"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { AboutContentSchema } from "@/lib/validations";
import { z } from "zod";

type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string };

type AboutSection = {
  id: string;
  section_key: string;
  content: {
    title?: string;
    body?: string;
  };
};

export async function getAboutSections(): Promise<ActionResult<AboutSection[]>> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("about_sections")
    .select("*")
    .order("section_key");

  if (error) {
    return { success: false, error: "Aboutセクションの取得に失敗しました" };
  }
  return { success: true, data: data as AboutSection[] };
}

const UpdateItemSchema = z.object({
  id: z.string().uuid(),
  content: AboutContentSchema,
});

export async function updateAboutSections(
  updates: { id: string; content: { title: string; body: string } }[]
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const parsed = z.array(UpdateItemSchema).safeParse(updates);
  if (!parsed.success) return { success: false, error: "入力が不正です" };

  const supabase = createAdminClient();

  for (const { id, content } of parsed.data) {
    const { error } = await supabase
      .from("about_sections")
      .update({ content })
      .eq("id", id);

    if (error) {
      return { success: false, error: "セクションの保存に失敗しました" };
    }
  }

  return { success: true, data: null };
}
