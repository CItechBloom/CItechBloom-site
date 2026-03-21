import { describe, it, expect } from "vitest";
import { JoinFormSchema } from "@/lib/validations";

const validData = {
  name: "山田 太郎",
  email: "yamada@example.com",
  year: "3年" as const,
  department: "情報工学科",
  message: "よろしくお願いします",
};

describe("JoinFormSchema", () => {
  it("有効なデータを受け入れる", () => {
    const result = JoinFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("messageが省略可能", () => {
    const { message: _message, ...withoutMessage } = validData;
    const result = JoinFormSchema.safeParse(withoutMessage);
    expect(result.success).toBe(true);
  });

  it("nameが空の場合エラー", () => {
    const result = JoinFormSchema.safeParse({ ...validData, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((i) => i.path[0] === "name");
      expect(nameError).toBeDefined();
    }
  });

  it("不正なemailでエラー", () => {
    const result = JoinFormSchema.safeParse({ ...validData, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((i) => i.path[0] === "email");
      expect(emailError).toBeDefined();
    }
  });

  it("無効な学年でエラー", () => {
    const result = JoinFormSchema.safeParse({ ...validData, year: "5年" });
    expect(result.success).toBe(false);
  });

  it("有効な学年を全て受け入れる", () => {
    const years = ["1年", "2年", "3年", "4年", "院1年", "院2年"] as const;
    for (const year of years) {
      const result = JoinFormSchema.safeParse({ ...validData, year });
      expect(result.success).toBe(true);
    }
  });

  it("departmentが空の場合エラー", () => {
    const result = JoinFormSchema.safeParse({ ...validData, department: "" });
    expect(result.success).toBe(false);
  });

  it("messageが500文字を超える場合エラー", () => {
    const result = JoinFormSchema.safeParse({
      ...validData,
      message: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("messageがちょうど500文字は有効", () => {
    const result = JoinFormSchema.safeParse({
      ...validData,
      message: "a".repeat(500),
    });
    expect(result.success).toBe(true);
  });
});
