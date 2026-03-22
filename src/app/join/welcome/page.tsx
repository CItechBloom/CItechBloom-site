import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "ようこそ CITechBloom へ",
  description: "CITechBloomへの入会申請ありがとうございます。",
};

type StatMap = Record<string, string>;

async function getWelcomeData(): Promise<StatMap> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_stats")
      .select("key, value")
      .in("key", ["next_event_info", "community_invite_url"]);

    if (error || !data) return {};
    return Object.fromEntries(data.map((s) => [s.key, s.value]));
  } catch {
    return {};
  }
}

type Props = {
  searchParams: Promise<{ name?: string }>;
};

export default async function WelcomePage({ searchParams }: Props) {
  const { name } = await searchParams;
  const welcomeData = await getWelcomeData();
  const nextEvent = welcomeData.next_event_info;
  const inviteUrl = welcomeData.community_invite_url;

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-gold font-medium tracking-widest text-sm uppercase mb-3">
          Welcome
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
          ようこそ、CITechBloom へ
        </h1>

        <div className="mt-10 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-8 space-y-8">
          <div>
            <p className="text-5xl mb-4">🌸</p>
            <p className="text-xl font-bold text-foreground mb-2">
              {name ? `${name}さん、` : ""}申請ありがとうございます！
            </p>
            <p className="text-foreground/70 text-sm leading-relaxed">
              内容を確認の上、ご連絡いたします。しばらくお待ちください。
            </p>
          </div>

          {inviteUrl && (
            <div className="bg-gold/5 rounded-xl p-6 border border-gold/20">
              <h2 className="text-lg font-bold text-foreground mb-2">
                コミュニティに参加
              </h2>
              <p className="text-foreground/70 text-sm mb-4">
                サークルの連絡やイベント情報はこちらから共有しています。
              </p>
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold text-white font-medium px-6 py-2.5 rounded-xl text-sm hover:bg-gold/90 transition-colors"
              >
                招待リンクを開く
              </a>
            </div>
          )}

          {nextEvent && (
            <div className="bg-green/5 rounded-xl p-6 border border-green/20">
              <h2 className="text-lg font-bold text-foreground mb-2">
                次回の活動
              </h2>
              <p className="text-foreground/70 text-sm">{nextEvent}</p>
            </div>
          )}

          <div className="pt-4">
            <Link
              href="/"
              className="text-sm text-gold hover:underline"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
