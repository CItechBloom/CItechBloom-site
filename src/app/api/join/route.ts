import { NextResponse } from "next/server";
import { JoinFormSchema } from "@/lib/validations";

// HTMLインジェクション防止
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 簡易レートリミット（IP別、1分間に5回まで）
// ベストエフォート: インメモリのためサーバレス/複数インスタンス間では共有されない
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_MAP_MAX_SIZE = 10_000;

function pruneExpiredEntries(now: number) {
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
  // 期限切れ削除後もサイズ上限を超える場合はDoS対策として一括クリア
  if (rateLimitMap.size > RATE_LIMIT_MAP_MAX_SIZE) {
    rateLimitMap.clear();
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneExpiredEntries(now);
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = JoinFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const name = escapeHtml(parsed.data.name);
  const email = parsed.data.email;
  const year = escapeHtml(parsed.data.year);
  const department = escapeHtml(parsed.data.department);
  const message = parsed.data.message ? escapeHtml(parsed.data.message) : "";

  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    // 開発環境ではメール送信をスキップ
    return NextResponse.json({ success: true });
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ??
    (process.env.NODE_ENV !== "production"
      ? "CITechBloom <noreply@citechbloom.example.com>"
      : undefined);

  if (!fromEmail) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "【CITechBloom】入会申請を受け付けました",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #2d2d2d; font-size: 24px; margin-bottom: 16px;">入会申請を受け付けました</h1>
        <p style="color: #555; line-height: 1.7;">
          ${name} 様、<br><br>
          CITechBloom への入会申請ありがとうございます。<br>
          内容を確認の上、改めてご連絡いたします。
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <h2 style="color: #2d2d2d; font-size: 18px; margin-bottom: 12px;">申請内容</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; width: 120px;">お名前</td>
            <td style="padding: 8px 0; color: #2d2d2d;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">学年</td>
            <td style="padding: 8px 0; color: #2d2d2d;">${year}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">学科・専攻</td>
            <td style="padding: 8px 0; color: #2d2d2d;">${department}</td>
          </tr>
          ${message ? `<tr><td style="padding: 8px 0; color: #888;">メッセージ</td><td style="padding: 8px 0; color: #2d2d2d;">${message}</td></tr>` : ""}
        </table>
        <p style="color: #aaa; font-size: 12px; margin-top: 32px;">
          このメールはCITechBloomから自動送信されています。
        </p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
