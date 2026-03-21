# CITechBloom

学生サークル **CITechBloom** の公式Webサイトです。プログラミング・AI・Webデザインに情熱を持つ学生が集まる場を提供します。

## Tech Stack

| 用途 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| フォーム | React Hook Form + Zod |
| メール送信 | Resend |
| テスト | Vitest + Testing Library + Playwright |
| コンテナ | Docker |

## Getting Started

```bash
# Docker で起動
docker compose up --build

# ブラウザで http://localhost:3000 を開く
```

`.env.local.example` をコピーして `.env.local` を作成してください。

```bash
cp .env.local.example .env.local
```

## Commands

```bash
# lint / 型チェック / テスト（全て Docker 内で実行）
docker compose exec app npm run lint
docker compose exec app npm run type-check
docker compose exec app npm run test -- --run

# ビルド確認
docker compose run --rm -e NODE_ENV=production app npm run build
```

## Docs

- [CLAUDE.md](./CLAUDE.md) - 開発規約・アーキテクチャ・コマンドリファレンス
- [CITechBloom_WebPlan.md](./CITechBloom_WebPlan.md) - 技術設計書・実装プラン

## Project Structure

```
src/
├── app/          # Next.js App Router（ページ・API）
├── components/
│   ├── ui/       # 最小単位UI（Button, Card, SakuraBackground）
│   ├── layout/   # Header, Footer, NavLinks
│   ├── features/ # Hero, AboutSection, MemberCard
│   └── forms/    # JoinForm
├── lib/          # ユーティリティ・バリデーション
└── types/        # 型定義
tests/
├── components/   # コンポーネントテスト
├── api/          # APIルートテスト
├── lib/          # ユーティリティテスト
└── e2e/          # E2Eテスト（Playwright）
```

## License

Private
