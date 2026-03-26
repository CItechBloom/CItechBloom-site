import { describe, it, expect, vi, beforeEach } from "vitest";

// getAdminEmails / isAdminEmail は環境変数を直接読むので、
// テストごとに env を差し替えてからモジュールを再読み込みする
describe("admin-auth", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe("getAdminEmails", () => {
    it("カンマ区切りのメール一覧をパースする", async () => {
      vi.stubEnv("ADMIN_EMAILS", "a@test.com, B@Test.com , c@test.com");
      const { getAdminEmails } = await import("@/lib/admin-auth");
      expect(getAdminEmails()).toEqual(["a@test.com", "b@test.com", "c@test.com"]);
    });

    it("空文字の場合は空配列を返す", async () => {
      vi.stubEnv("ADMIN_EMAILS", "");
      const { getAdminEmails } = await import("@/lib/admin-auth");
      expect(getAdminEmails()).toEqual([]);
    });

    it("未設定の場合は空配列を返す", async () => {
      vi.stubEnv("ADMIN_EMAILS", undefined as unknown as string);
      const { getAdminEmails } = await import("@/lib/admin-auth");
      expect(getAdminEmails()).toEqual([]);
    });

    it("余分なカンマ・空白を無視する", async () => {
      vi.stubEnv("ADMIN_EMAILS", " ,a@test.com, ,, b@test.com, ");
      const { getAdminEmails } = await import("@/lib/admin-auth");
      expect(getAdminEmails()).toEqual(["a@test.com", "b@test.com"]);
    });
  });

  describe("isAdminEmail", () => {
    it("allowlist に含まれるメールで true を返す", async () => {
      vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
      const { isAdminEmail } = await import("@/lib/admin-auth");
      expect(isAdminEmail("admin@example.com")).toBe(true);
    });

    it("大文字小文字を区別しない", async () => {
      vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
      const { isAdminEmail } = await import("@/lib/admin-auth");
      expect(isAdminEmail("Admin@Example.COM")).toBe(true);
    });

    it("allowlist に含まれないメールで false を返す", async () => {
      vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
      const { isAdminEmail } = await import("@/lib/admin-auth");
      expect(isAdminEmail("user@example.com")).toBe(false);
    });

    it("allowlist が空の場合は常に false を返す", async () => {
      vi.stubEnv("ADMIN_EMAILS", "");
      const { isAdminEmail } = await import("@/lib/admin-auth");
      expect(isAdminEmail("anyone@example.com")).toBe(false);
    });
  });

  describe("requireAdmin", () => {
    function mockSupabaseUser(user: { id: string; email: string } | null) {
      vi.doMock("@/lib/supabase-server", () => ({
        createServerSupabaseClient: vi.fn().mockResolvedValue({
          auth: {
            getUser: vi.fn().mockResolvedValue({
              data: { user },
            }),
          },
        }),
      }));
    }

    it("未認証ユーザーの場合エラーを返す", async () => {
      vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
      mockSupabaseUser(null);

      const { requireAdmin } = await import("@/lib/admin-auth");
      const result = await requireAdmin();
      expect(result.error).toBe("認証されていません");
      expect(result.user).toBeNull();
    });

    it("非管理者メールの場合エラーを返す", async () => {
      vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
      mockSupabaseUser({ id: "1", email: "user@example.com" });

      const { requireAdmin } = await import("@/lib/admin-auth");
      const result = await requireAdmin();
      expect(result.error).toBe("管理者権限がありません");
      expect(result.user).toBeNull();
    });

    it("管理者メールの場合ユーザー情報を返す", async () => {
      vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
      mockSupabaseUser({ id: "1", email: "admin@example.com" });

      const { requireAdmin } = await import("@/lib/admin-auth");
      const result = await requireAdmin();
      expect(result.error).toBeNull();
      expect(result.user).toEqual({ id: "1", email: "admin@example.com" });
    });
  });
});
