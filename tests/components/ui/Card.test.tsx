import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "@/components/ui/Card";

describe("Card", () => {
  it("childrenを表示する", () => {
    render(<Card>カード内容</Card>);
    expect(screen.getByText("カード内容")).toBeInTheDocument();
  });

  it("追加のclassNameを受け入れる", () => {
    const { container } = render(<Card className="custom-class">内容</Card>);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
