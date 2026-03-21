import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メンバー",
  description: "CITechBloomのメンバーを紹介します。",
};

export default function MembersPage() {
  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-gold font-medium tracking-widest text-sm uppercase mb-3">
          Members
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
          メンバー
        </h1>
        <p className="text-foreground/70 mb-12">
          CITechBloomのメンバーを紹介します。
        </p>

        <div className="text-center py-20 bg-white/50 rounded-2xl border border-white/60">
          <p className="text-5xl mb-4">👥</p>
          <p className="text-xl font-bold text-foreground mb-2">Coming Soon</p>
          <p className="text-foreground/60 text-sm">メンバー紹介は準備中です。</p>
        </div>
      </div>
    </div>
  );
}
