"use client";

import dynamic from "next/dynamic";

// Math.random()による花びら生成はSSRとクライアントで値が異なるためSSRを無効化
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
