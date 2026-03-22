import type { Metadata } from "next";
import { AboutSection } from "@/components/features/AboutSection";
import { createClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "について",
  description:
    "CITechBloomについて - 私たちのミッション、活動、価値観をご紹介します。",
};

type SectionContent = {
  title?: string;
  body?: string;
};

async function getAboutSections(): Promise<Record<string, SectionContent>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("about_sections")
      .select("section_key, content");

    if (error || !data) return {};
    return Object.fromEntries(
      data.map((s) => [s.section_key, s.content as SectionContent])
    );
  } catch {
    return {};
  }
}

// フォールバック用のデフォルトコンテンツ
const DEFAULTS: Record<string, SectionContent> = {
  mission: {
    title: "私たちのミッション",
    body: "CITechBloomは「技術で世界を彩る」をテーマに、プログラミング・AI・Webデザインに情熱を持つ学生が集まるサークルです。\n\n私たちは単に技術を学ぶだけでなく、それを活かしてリアルな問題を解決し、社会に価値を届けることを目指しています。",
  },
  features: {
    title: "活動の特徴",
    body: "01. 学年・経験不問\n入門者から上級者まで、それぞれのペースで成長できます。\n\n02. 実践重視\nハッカソン・プロダクト開発を通じて、実際に動くものを作る経験を積めます。\n\n03. 多様な技術領域\nWeb、AI/ML、セキュリティ、デザインなど幅広い分野をカバーしています。",
  },
  schedule: {
    title: "活動スケジュール",
    body: "毎週木曜 18:00〜20:00 — 週次勉強会・LT会\n月1回 土曜 13:00〜 — ハンズオンワークショップ\n学期ごと — 成果発表会・ハッカソン",
  },
};

export default async function AboutPage() {
  const sections = await getAboutSections();

  const mission = sections.mission ?? DEFAULTS.mission;
  const features = sections.features ?? DEFAULTS.features;
  const schedule = sections.schedule ?? DEFAULTS.schedule;

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

      <AboutSection title={mission.title ?? "私たちのミッション"} subtitle="Mission">
        {(mission.body ?? "").split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </AboutSection>

      <div className="bg-white/40">
        <AboutSection title={features.title ?? "活動の特徴"} subtitle="Features">
          <div className="space-y-3">
            {(features.body ?? "").split("\n\n").map((item, i) => {
              const lines = item.split("\n");
              const heading = lines[0];
              const description = lines.slice(1).join("\n");
              return (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong className="font-medium">{heading}</strong>
                    {description && (
                      <p className="text-foreground/60 text-sm mt-0.5">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </AboutSection>
      </div>

      <AboutSection title={schedule.title ?? "活動スケジュール"} subtitle="Schedule">
        <div className="space-y-4">
          {(schedule.body ?? "").split("\n").filter(Boolean).map((line, i) => {
            const parts = line.split(" — ");
            const timeInfo = parts[0] ?? "";
            const title = parts[1] ?? line;
            const timeParts = timeInfo.split(" ");
            const day = timeParts[0] ?? "";
            const time = timeParts.slice(1).join(" ");

            return (
              <div
                key={i}
                className="flex gap-4 p-4 bg-white/60 rounded-xl border border-white/60"
              >
                <div className="text-gold font-medium text-sm min-w-20">{day}</div>
                <div>
                  <p className="font-medium text-foreground">{title}</p>
                  {time && <p className="text-xs text-foreground/60 mt-0.5">{time}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </AboutSection>
    </div>
  );
}
