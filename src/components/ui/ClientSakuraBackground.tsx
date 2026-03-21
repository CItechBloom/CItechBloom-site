"use client";

import dynamic from "next/dynamic";

// tsParticlesはブラウザAPIが必要なためSSRを無効化
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
