import { describe, it, expect } from "vitest";
import { SafeUrlSchema, AboutContentSchema } from "@/lib/validations";

describe("SafeUrlSchema", () => {
  it("https:// の URL を受け入れる", () => {
    expect(SafeUrlSchema.safeParse("https://discord.gg/invite").success).toBe(true);
    expect(SafeUrlSchema.safeParse("https://example.com").success).toBe(true);
  });

  it("http:// の URL を拒否する", () => {
    const result = SafeUrlSchema.safeParse("http://example.com");
    expect(result.success).toBe(false);
  });

  it("javascript: プロトコルを拒否する", () => {
    const result = SafeUrlSchema.safeParse("javascript:alert(1)");
    expect(result.success).toBe(false);
  });

  it("data: プロトコルを拒否する", () => {
    const result = SafeUrlSchema.safeParse("data:text/html,<script>alert(1)</script>");
    expect(result.success).toBe(false);
  });

  it("空文字を拒否する（url() バリデーション）", () => {
    const result = SafeUrlSchema.safeParse("");
    expect(result.success).toBe(false);
  });

  it("不正な URL を拒否する", () => {
    const result = SafeUrlSchema.safeParse("not-a-url");
    expect(result.success).toBe(false);
  });
});

describe("AboutContentSchema", () => {
  it("有効なデータを受け入れる", () => {
    const result = AboutContentSchema.safeParse({
      title: "テスト",
      body: "本文です",
    });
    expect(result.success).toBe(true);
  });

  it("タイトルが空の場合を拒否する", () => {
    const result = AboutContentSchema.safeParse({
      title: "",
      body: "本文",
    });
    expect(result.success).toBe(false);
  });

  it("タイトルが200文字を超える場合を拒否する", () => {
    const result = AboutContentSchema.safeParse({
      title: "あ".repeat(201),
      body: "本文",
    });
    expect(result.success).toBe(false);
  });

  it("本文が5000文字を超える場合を拒否する", () => {
    const result = AboutContentSchema.safeParse({
      title: "タイトル",
      body: "あ".repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it("本文が空でも受け入れる", () => {
    const result = AboutContentSchema.safeParse({
      title: "タイトル",
      body: "",
    });
    expect(result.success).toBe(true);
  });
});
