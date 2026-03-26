import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase-types";

/**
 * Service Role Key を使った管理用 Supabase クライアント。
 * RLS をバイパスするため、呼び出し元で必ず requireAdmin() による認可チェックを行うこと。
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY の設定が必要です"
    );
  }

  return createClient<Database>(url, serviceRoleKey);
}
