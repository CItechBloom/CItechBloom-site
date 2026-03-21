"use client";

import dynamic from "next/dynamic";

// CSSアニメーションがwindowサイズに依存するためSSRを無効化
const SakuraBackground = dynamic(
  () =>
    import("@/components/ui/SakuraBackground").then(
      (mod) => mod.SakuraBackground
    ),
  { ssr: false }
);

export function ClientSakuraBackground() {
  return <SakuraBackground />;
}
