import type { Metadata } from "next";
import { AboutSection } from "@/components/features/AboutSection";

export const metadata: Metadata = {
  title: "について",
  description:
    "CITechBloomについて - 私たちのミッション、活動、価値観をご紹介します。",
};

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <p className="text-gold font-medium tracking-widest text-sm uppercase mb-3">
          About
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
          CITechBloomとは
        </h1>
      </div>

      <AboutSection title="私たちのミッション" subtitle="Mission">
        <p>
          CITechBloomは「技術で世界を彩る」をテーマに、プログラミング・AI・Webデザインに情熱を持つ学生が集まるサークルです。
        </p>
        <p>
          私たちは単に技術を学ぶだけでなく、それを活かしてリアルな問題を解決し、社会に価値を届けることを目指しています。
        </p>
      </AboutSection>

      <div className="bg-white/40">
        <AboutSection title="活動の特徴" subtitle="Features">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-gold font-bold mt-0.5">01</span>
              <div>
                <strong className="font-medium">学年・経験不問</strong>
                <p className="text-foreground/60 text-sm mt-0.5">
                  入門者から上級者まで、それぞれのペースで成長できます。
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold font-bold mt-0.5">02</span>
              <div>
                <strong className="font-medium">実践重視</strong>
                <p className="text-foreground/60 text-sm mt-0.5">
                  ハッカソン・プロダクト開発を通じて、実際に動くものを作る経験を積めます。
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold font-bold mt-0.5">03</span>
              <div>
                <strong className="font-medium">多様な技術領域</strong>
                <p className="text-foreground/60 text-sm mt-0.5">
                  Web、AI/ML、セキュリティ、デザインなど幅広い分野をカバーしています。
                </p>
              </div>
            </li>
          </ul>
        </AboutSection>
      </div>

      <AboutSection title="活動スケジュール" subtitle="Schedule">
        <div className="space-y-4">
          {[
            { day: "毎週木曜", time: "18:00 〜 20:00", title: "週次勉強会・LT会" },
            { day: "月1回", time: "土曜 13:00 〜", title: "ハンズオンワークショップ" },
            { day: "学期ごと", time: "未定", title: "成果発表会・ハッカソン" },
          ].map(({ day, time, title }) => (
            <div
              key={title}
              className="flex gap-4 p-4 bg-white/60 rounded-xl border border-white/60"
            >
              <div className="text-gold font-medium text-sm min-w-20">{day}</div>
              <div>
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-xs text-foreground/60 mt-0.5">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </AboutSection>
    </div>
  );
}
