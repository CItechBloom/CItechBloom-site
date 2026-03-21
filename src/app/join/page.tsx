import type { Metadata } from "next";
import { JoinForm } from "@/components/forms/JoinForm";

export const metadata: Metadata = {
  title: "入会する",
  description:
    "CITechBloomへの入会申請フォームです。学年・経験問わず、技術が好きな方を歓迎します。",
};

export default function JoinPage() {
  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-gold font-medium tracking-widest text-sm uppercase mb-3">
          Join us
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
          入会する
        </h1>
        <p className="text-foreground/70 leading-relaxed mb-10">
          CITechBloomでは、学年・経験を問わず、テクノロジーへの情熱を持つ仲間を歓迎します。
          下記フォームよりお気軽にお申し込みください。
        </p>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-8">
          <JoinForm />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { label: "メンバー数", value: "30+" },
            { label: "活動年数", value: "3年" },
            { label: "ハッカソン参加", value: "10+" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/60 rounded-xl p-4 border border-white/60"
            >
              <p className="text-2xl font-bold text-gold">{value}</p>
              <p className="text-xs text-foreground/60 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
