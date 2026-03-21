import { NextResponse } from "next/server";
import { JoinFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = JoinFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { name, email, year, department, message } = parsed.data;

  // RESEND_API_KEY が未設定の場合は送信をスキップ（開発環境向け）
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ success: true });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "CITechBloom <noreply@citechbloom.example.com>",
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
