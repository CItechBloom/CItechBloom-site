"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { MemberFormSchema } from "@/lib/validations";
import { z } from "zod";

type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string };

export type MemberListItem = {
  id: string;
  name: string;
  role: string;
  year: string;
  display_order: number;
  is_visible: boolean;
  image_url: string | null;
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function validateAndUploadImage(
  file: File
): Promise<ActionResult<string>> {
  if (file.size > MAX_IMAGE_SIZE) {
    return { success: false, error: "画像は2MB以下にしてください" };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "JPEG、PNG、WebP形式の画像を選択してください",
    };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const supabase = createAdminClient();

  const { error: uploadError } = await supabase.storage
    .from("member-photos")
    .upload(fileName, file);

  if (uploadError) {
    return { success: false, error: "画像のアップロードに失敗しました" };
  }

  const { data: urlData } = supabase.storage
    .from("member-photos")
    .getPublicUrl(fileName);

  return { success: true, data: urlData.publicUrl };
}

export async function getMembers(): Promise<ActionResult<MemberListItem[]>> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("id, name, role, year, display_order, is_visible, image_url")
    .order("display_order", { ascending: true });

  if (error) return { success: false, error: "メンバーの取得に失敗しました" };
  return { success: true, data: data as MemberListItem[] };
}

export async function getMember(
  id: string
): Promise<ActionResult<MemberListItem & { bio: string; department: string | null }>> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const idResult = z.string().uuid().safeParse(id);
  if (!idResult.success) return { success: false, error: "不正なIDです" };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return { success: false, error: "メンバーが見つかりませんでした" };
  }

  return {
    success: true,
    data: data as MemberListItem & { bio: string; department: string | null },
  };
}

export async function createMember(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const raw = {
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    year: formData.get("year"),
    department: formData.get("department") || undefined,
    display_order: Number(formData.get("display_order")),
    is_visible: formData.get("is_visible") === "true",
  };

  const parsed = MemberFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let imageUrl: string | null = null;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const uploadResult = await validateAndUploadImage(imageFile);
    if (!uploadResult.success) return uploadResult;
    imageUrl = uploadResult.data;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("members")
    .insert({
      ...parsed.data,
      department: parsed.data.department || null,
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: "登録に失敗しました" };
  return { success: true, data: { id: data.id } };
}

export async function updateMember(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const idResult = z.string().uuid().safeParse(id);
  if (!idResult.success) return { success: false, error: "不正なIDです" };

  const raw = {
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    year: formData.get("year"),
    department: formData.get("department") || undefined,
    display_order: Number(formData.get("display_order")),
    is_visible: formData.get("is_visible") === "true",
  };

  const parsed = MemberFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let imageUrl: string | undefined;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const uploadResult = await validateAndUploadImage(imageFile);
    if (!uploadResult.success) return uploadResult;
    imageUrl = uploadResult.data;
  }

  const supabase = createAdminClient();
  const updateData = {
    ...parsed.data,
    department: parsed.data.department || null,
    ...(imageUrl !== undefined && { image_url: imageUrl }),
  };

  const { error } = await supabase
    .from("members")
    .update(updateData)
    .eq("id", id);

  if (error) return { success: false, error: "更新に失敗しました" };
  return { success: true, data: null };
}

export async function deleteMember(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const idResult = z.string().uuid().safeParse(id);
  if (!idResult.success) return { success: false, error: "不正なIDです" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) return { success: false, error: "削除に失敗しました" };
  return { success: true, data: null };
}

export async function toggleMemberVisibility(
  id: string,
  currentValue: boolean
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (auth.error) return { success: false, error: auth.error };

  const idResult = z.string().uuid().safeParse(id);
  if (!idResult.success) return { success: false, error: "不正なIDです" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("members")
    .update({ is_visible: !currentValue })
    .eq("id", id);

  if (error) return { success: false, error: "更新に失敗しました" };
  return { success: true, data: null };
}
