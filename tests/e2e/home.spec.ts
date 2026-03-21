import { test, expect } from "@playwright/test";

test.describe("ホームページ", () => {
  test("主要な要素が表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "CITechBloom" })).toBeVisible();
    await expect(page.getByRole("link", { name: "入会する" }).first()).toBeVisible();
  });

  test("ナビゲーションが機能する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "について" }).first().click();
    await expect(page).toHaveURL("/about");
  });
});

test.describe("aboutページ", () => {
  test("ページが正常に表示される", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "CITechBloomとは" })).toBeVisible();
  });
});

test.describe("membersページ", () => {
  test("ページが正常に表示される", async ({ page }) => {
    await page.goto("/members");
    await expect(page.getByRole("heading", { name: "メンバー" })).toBeVisible();
  });
});

test.describe("joinページ", () => {
  test("フォームが表示される", async ({ page }) => {
    await page.goto("/join");
    await expect(page.getByLabel("お名前")).toBeVisible();
    await expect(page.getByLabel("メールアドレス")).toBeVisible();
    await expect(page.getByRole("button", { name: "入会を申請する" })).toBeVisible();
  });

  test("必須フィールドが空の場合バリデーションエラーが表示される", async ({ page }) => {
    await page.goto("/join");
    await page.getByRole("button", { name: "入会を申請する" }).click();
    await expect(page.getByText("名前を入力してください")).toBeVisible();
    await expect(page.getByText("有効なメールアドレスを入力してください")).toBeVisible();
  });
});
