import type { Metadata } from "next";
import { Hero } from "@/components/features/Hero";
import { AboutSection } from "@/components/features/AboutSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CITechBloom",
  description:
    "CITechBloom - テクノロジーと創造性が交差する学生サークル。プログラミング、AI/ML、Web開発を一緒に学びましょう。",
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="bg-white/40">
        <AboutSection title="CITechBloomとは" subtitle="About us">
          <p>
            CITechBloomは、プログラミング・AI・Webデザインに情熱を持つ学生が集まるサークルです。
            毎週の勉強会から、ハッカソン、プロダクト開発まで、技術を楽しみながら成長できる場を提供しています。
          </p>
          <p>
            学年・経験問わず歓迎します。初心者でも安心して始められる環境が整っています。
          </p>
          <div className="mt-6">
            <Link
              href="/about"
              className="inline-flex items-center text-gold font-medium hover:underline underline-offset-4"
            >
              もっと詳しく →
            </Link>
          </div>
        </AboutSection>
      </div>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold font-medium tracking-widest text-sm uppercase mb-3">
            Activities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-10">
            活動内容
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "💻",
                title: "週次勉強会",
                desc: "毎週テーマを決めて、LT発表や輪読で知識を深めます。",
              },
              {
                icon: "🚀",
                title: "ハッカソン",
                desc: "学内外のハッカソンに参加・主催し、チーム開発を体験します。",
              },
              {
                icon: "🌸",
                title: "プロダクト開発",
                desc: "実際に動くプロダクトを作り、発表・リリースまで目指します。",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-gold/10 to-green/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
            一緒に咲き誇ろう
          </h2>
          <p className="text-foreground/70 leading-relaxed mb-8">
            あなたの情熱と好奇心を歓迎します。
            <br />
            技術を通じて、仲間とともに成長しましょう。
          </p>
          <Link
            href="/join"
            className="inline-flex items-center justify-center rounded-full bg-gold text-white px-8 py-3 text-base font-medium hover:bg-[#b8943e] transition-colors duration-200 shadow-sm"
          >
            入会申請はこちら
          </Link>
        </div>
      </section>
    </>
  );
}
