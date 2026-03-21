import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("テキストを表示する", () => {
    render(<Button>クリック</Button>);
    expect(screen.getByRole("button", { name: "クリック" })).toBeInTheDocument();
  });

  it("クリックハンドラが呼ばれる", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>クリック</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disabled のとき操作できない", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>クリック</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("variantに応じたクラスが付与される", () => {
    const { rerender } = render(<Button variant="primary">ボタン</Button>);
    expect(screen.getByRole("button").className).toContain("bg-gold");

    rerender(<Button variant="secondary">ボタン</Button>);
    expect(screen.getByRole("button").className).toContain("bg-green");

    rerender(<Button variant="outline">ボタン</Button>);
    expect(screen.getByRole("button").className).toContain("border-gold");
  });

  it("typeがsubmitとして機能する", () => {
    render(<Button type="submit">送信</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
