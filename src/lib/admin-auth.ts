import { createServerSupabaseClient } from "@/lib/supabase-server";

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.toLowerCase());
}

type AdminResult =
  | { user: { id: string; email: string }; error: null }
  | { user: null; error: string };

/**
 * Server Action / Server Component 用の管理者認証チェック。
 * 認証済み + ADMIN_EMAILS allowlist に含まれるユーザーのみ通過する。
 */
export async function requireAdmin(): Promise<AdminResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { user: null, error: "認証されていません" };
  }

  if (!isAdminEmail(user.email)) {
    return { user: null, error: "管理者権限がありません" };
  }

  return { user: { id: user.id, email: user.email }, error: null };
}
