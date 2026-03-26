import { describe, it, expect, beforeEach, vi } from "vitest";

// Next.jsのNextResponseをモック
vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      body,
      status: init?.status ?? 200,
    }),
  },
}));

// resendをモック（外部APIのため）
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  })),
}));

async function callPOST(body: unknown, headers?: Record<string, string>) {
  const { POST } = await import("@/app/api/join/route");
  const request = new Request("http://localhost:3000/api/join", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return POST(request);
}

const validData = {
  name: "山田 太郎",
  email: "yamada@example.com",
  year: "3年" as const,
  department: "情報工学科",
};

describe("POST /api/join", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("不正なJSONで400を返す", async () => {
    const { POST } = await import("@/app/api/join/route");
    const request = new Request("http://localhost:3000/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid json",
    });
    const res = await POST(request);
    expect(res.status).toBe(400);
  });

  it("バリデーション不正で400を返す", async () => {
    const res = await callPOST({ name: "" });
    expect(res.status).toBe(400);
  });

  it("有効なデータでsuccessを返す（Turnstile未設定時）", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    const res = await callPOST(validData);
    expect(res.status).toBe(200);
  });

  describe("Turnstile 有効時", () => {
    beforeEach(() => {
      vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
      // Turnstile API をモック
      vi.stubGlobal(
        "fetch",
        vi.fn().mockImplementation((url: string) => {
          if (
            typeof url === "string" &&
            url.includes("challenges.cloudflare.com")
          ) {
            return Promise.resolve({
              json: () => Promise.resolve({ success: true }),
            });
          }
          return Promise.reject(new Error(`Unexpected fetch: ${url}`));
        })
      );
    });

    it("トークンなしで400を返す", async () => {
      const res = await callPOST(validData);
      expect(res.status).toBe(400);
    });

    it("有効なトークン付きでsuccessを返す", async () => {
      const res = await callPOST({
        ...validData,
        turnstileToken: "valid-token",
      });
      expect(res.status).toBe(200);
    });

    it("無効なトークンで400を返す", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockImplementation((url: string) => {
          if (
            typeof url === "string" &&
            url.includes("challenges.cloudflare.com")
          ) {
            return Promise.resolve({
              json: () => Promise.resolve({ success: false }),
            });
          }
          return Promise.reject(new Error(`Unexpected fetch: ${url}`));
        })
      );

      const res = await callPOST({
        ...validData,
        turnstileToken: "invalid-token",
      });
      expect(res.status).toBe(400);
    });
  });
});
