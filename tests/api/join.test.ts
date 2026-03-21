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

  it("有効なデータでsuccessを返す", async () => {
    const res = await callPOST(validData);
    expect(res.status).toBe(200);
  });
});
