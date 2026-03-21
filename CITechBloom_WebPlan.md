# CITechBloom Webサイト 開発プラン

---

## 技術スタック

| 役割 | 技術 | 備考 |
|------|------|------|
| フレームワーク | Next.js 14（App Router） | 現場標準、SSG/SSR両対応 |
| 言語 | TypeScript | 型安全、現場ではほぼ必須 |
| スタイリング | Tailwind CSS | クラスベース、現場標準 |
| 星エフェクト | tsParticles | パーティクルアニメーション |
| ブログ | Contentlayer + MDX | Markdownで記事管理 |
| フォーム | React Hook Form + Zod | バリデーション込み |
| 認証・DB | Supabase | Phase 2で追加 |
| ホスティング | Vercel | 無料枠で運用可能 |
| バージョン管理 | GitHub | チーム開発の基本 |

---

## ページ構成

```
/                    トップページ
/about               団体紹介・理念
/events              イベント一覧・申し込み
/events/[id]         イベント詳細
/members             幹部メンバー紹介
/blog                ブログ一覧
/blog/[slug]         ブログ記事個別
/join                入会フォーム・Q&A
/news                お知らせ一覧
```

---

## デザイン仕様

- **背景色**: `#fdf8f2`（薄いベージュ）
- **アクセントカラー**: ゴールド系 `#c9a84c` ／ グリーン系 `#4a7c59`（Bloomイメージ）
- **星エフェクト**: tsParticlesで全ページ共通、ゆっくり静かに降る
- **フォント**: `Noto Sans JP`（日本語）+ `Inter`（英数字）
- **レイアウト**: レスポンシブ対応（スマホ・PC）

---

## コンポーネント設計

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 共通レイアウト（星エフェクト含む）
│   ├── page.tsx              # トップページ
│   ├── about/page.tsx
│   ├── events/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── members/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── join/page.tsx
│   └── news/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # ナビゲーション
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── StarBackground.tsx  # 星エフェクト
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── sections/
│   │   ├── Hero.tsx          # トップのメインビジュアル
│   │   ├── AboutSection.tsx
│   │   ├── EventCard.tsx
│   │   └── MemberCard.tsx
│   └── forms/
│       ├── JoinForm.tsx      # 入会フォーム
│       └── ContactForm.tsx
├── content/
│   └── blog/                 # MDXブログ記事
│       └── *.mdx
└── lib/
    ├── supabase.ts           # Phase 2
    └── utils.ts
```

---

## 開発フェーズ

### Phase 1 ─ 公開版（〜1ヶ月目）

**目標**: まずサイトを公開する

- [ ] Next.js プロジェクトセットアップ
- [ ] 共通レイアウト（Header・Footer・星エフェクト）
- [ ] トップページ（Hero・団体紹介・イベント予告）
- [ ] Aboutページ（理念・活動内容）
- [ ] Membersページ（幹部紹介）
- [ ] Joinページ（Googleフォーム埋め込み＋Q&A）
- [ ] Vercelにデプロイ

### Phase 2 ─ コンテンツ充実（〜2ヶ月目）

**目標**: ブログ・イベント機能を追加

- [ ] ブログ機能（Contentlayer + MDX）
- [ ] イベント一覧・詳細ページ
- [ ] お知らせ機能
- [ ] React Hook Form でフォームを本格実装
- [ ] OGP設定（SNSシェア時のサムネイル）
- [ ] SEO対応（メタタグ・sitemap）

### Phase 3 ─ バックエンド追加（〜3ヶ月目〜）

**目標**: 会員管理・管理画面を追加

- [ ] Supabase セットアップ（認証・DB）
- [ ] 会員登録・ログイン機能
- [ ] イベント申し込み機能（DB連携）
- [ ] 管理者ダッシュボード（お知らせ投稿・イベント管理）

---

## 開発環境セットアップ手順

```bash
# プロジェクト作成
npx create-next-app@latest citechbloom --typescript --tailwind --app

# 必要パッケージインストール
cd citechbloom
npm install @tsparticles/react @tsparticles/slim
npm install react-hook-form zod @hookform/resolvers
npm install contentlayer next-contentlayer  # Phase 2
npm install @supabase/supabase-js           # Phase 3
```

---

## チーム開発のルール（推奨）

- **ブランチ戦略**: `main`（本番）/ `develop`（開発）/ `feature/xxx`（機能別）
- **コミットメッセージ**: `feat:`, `fix:`, `docs:` などのプレフィックスをつける
- **レビュー**: Pull Requestを使ってメンバー同士でコードレビュー
- **デプロイ**: `main`へのマージで自動デプロイ（Vercel連携）

---

## 参考リソース

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS 公式](https://tailwindcss.com/docs)
- [tsParticles](https://particles.js.org/)
- [Supabase 公式](https://supabase.com/docs)
- [Vercel デプロイガイド](https://vercel.com/docs)
