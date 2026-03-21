import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "イベント",
  description: "CITechBloomのイベント情報。勉強会、ハッカソン、ワークショップなど。",
};

export default function EventsPage() {
  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-gold font-medium tracking-widest text-sm uppercase mb-3">
          Events
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
          イベント
        </h1>
        <p className="text-foreground/70 mb-12">
          勉強会・ハッカソン・ワークショップのスケジュールを掲載します。
        </p>

        <div className="text-center py-20 bg-white/50 rounded-2xl border border-white/60">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-xl font-bold text-foreground mb-2">Coming Soon</p>
          <p className="text-foreground/60 text-sm">イベント機能は準備中です。</p>
        </div>
      </div>
    </div>
  );
}
