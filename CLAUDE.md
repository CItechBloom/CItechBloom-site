# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## 絶対に守るルール

### アーキテクチャ

- **3層コンポーネント設計**: Page → Component → UI
  - `app/` : ルーティング・ページ（ロジックは持たない）
  - `components/` : 機能別の再利用可能なコンポーネント（`features/`, `layout/`, `forms/`）
  - `components/ui/` : ボタン・カード等の最小単位UI（shadcn/ui準拠）
- **Server / Client 分離**: データフェッチは Server Component、インタラクションは `"use client"`
- **型安全**: `any` 禁止。外部データは必ず Zod でバリデーション

### コード品質

- **DRY原則**: 同一ロジックの重複禁止。`lib/` に共通化
- **ファイル分割**: 1ファイル300行超は機能別に分割
- **class禁止**: 原則使用禁止（Error継承・型定義は許可）
- **コメントのルール**:
  - WHY を書く（なぜこの実装か）
  - WHAT は複数行にまたがる等、可読性に影響する場合のみ
  - 余計なコメントは書かない

### 開発環境

- **テスト・lint・型チェックは必ず Docker 内で実行**
- **禁止**: ホスト側で直接 `npm run test` / `npm run lint` を実行すること
- **コード変更は自動反映**（Next.js HMR）。ただし `next.config.ts` 変更後はコンテナ再起動が必要

```bash
# 設定ファイル変更時のみ再起動
docker compose restart app
```

### Git

- **main への直接コミット・プッシュ禁止**: 必ずフィーチャーブランチを作成してPR経由でマージ
- ブランチ命名規則: `feat/`, `fix/`, `refactor/`, `docs/`, `test/` など
- コミットメッセージは Conventional Commits 形式

### テスト

- 実装前に失敗するテストを書く（TDD推奨）
- バグ修正・新機能・リファクタリング全てにテストを書いてから完了とする
- **テスト実行は関連ファイルのみ**: フルテストは最終確認時のみ
- コンポーネントのprops・インターフェース変更時は、対応するテストも同じコミットで更新

---

## TDD ワークフロー

1. **赤フェーズ**: 失敗するテストを書く
2. **テスト実行**: テストが落ちることを確認
3. **緑フェーズ**: テストを通す最小限の実装を行う
4. **テスト成功確認**: テストが通ることを確認
5. **リファクタリング**: コードを整理・改善

### テスト作成のルール

- テストデータはテスト関数内に直接記述（`fixtures` は副作用のないデータのみ許可）
- モックはなるべく使わない。Supabase・外部APIなど外部依存がある時だけ許可

### 要件・仕様分析のベストプラクティス

最初の理解が間違っている可能性を常に念頭に置き、必ず一次情報で検証する。

**情報の優先順位**: 実装コード > Figma/デザイン > 仕様書

矛盾がある場合は自己判断で解決せず、必ずユーザーに提示して判断を仰ぐ。

---

## Commands

### Docker Commands（必須）

```bash
# 開発環境起動
docker compose up -d

# コード品質チェック
docker compose exec app npm run lint
docker compose exec app npm run lint -- --fix
docker compose exec app npm run type-check

# テスト
docker compose exec app npm run test              # Vitestで単体・コンポーネントテスト
docker compose exec app npm run test -- --run     # CI向け（watch無効）
docker compose exec app npm run test -- path/to/test.test.ts
docker compose exec app npm run test:e2e          # Playwright E2E

# ビルド確認
docker compose exec app npm run build

# 設定変更後の再起動（next.config.ts等）
docker compose restart app
```

### よく使うコマンド

```bash
# ログ確認
docker compose logs app -f

# コンテナに入る
docker compose exec app sh

# 依存パッケージ追加
docker compose exec app npm install <package>
docker compose exec app npm install -D <package>  # devDependencies
```

---

## Architecture

### 概要

Next.js 16 (App Router) ベースの学生団体向けWebサイト:

- **静的生成中心 (SSG)**: コンテンツはビルド時に生成、パフォーマンス優先
- **MDXブログ**: Contentlayerでマークダウン記事を型安全に管理
- **段階的認証**: Phase 1はフォームのみ、Phase 2でSupabase認証追加

### ディレクトリ構成

```
citechbloom/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # 共通レイアウト（星エフェクト・フォント）
│   │   ├── page.tsx                # トップページ
│   │   ├── about/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── members/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── join/page.tsx
│   │   ├── news/page.tsx
│   │   └── api/                    # API Routes（フォーム送信等）
│   │       ├── contact/route.ts
│   │       └── join/route.ts
│   ├── components/
│   │   ├── layout/                 # ページ共通レイアウト
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── features/               # 機能・ページ固有のコンポーネント
│   │   │   ├── Hero.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── MemberCard.tsx
│   │   │   └── BlogCard.tsx
│   │   ├── forms/                  # フォーム関連
│   │   │   ├── JoinForm.tsx
│   │   │   └── ContactForm.tsx
│   │   └── ui/                     # 最小単位（shadcn/ui準拠）
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── StarBackground.tsx  # 星エフェクト（tsParticles）
│   ├── content/
│   │   └── blog/                   # MDXブログ記事
│   │       └── *.mdx
│   └── lib/
│       ├── supabase.ts             # Supabaseクライアント（Phase 2）
│       ├── validations.ts          # Zodスキーマ
│       └── utils.ts                # 共通ユーティリティ
├── tests/
│   ├── components/                 # コンポーネントテスト（Vitest + RTL）
│   └── e2e/                        # E2Eテスト（Playwright）
├── public/
├── docker-compose.yml
├── Dockerfile
├── next.config.ts
└── tailwind.config.ts
```

### デザイン仕様

| 項目 | 値 |
|------|---|
| 背景色 | `#fdf8f2`（薄いベージュ） |
| アクセント | `#c9a84c`（ゴールド）/ `#4a7c59`（グリーン） |
| 星エフェクト | tsParticles、全ページ共通、ゆっくり静かに降る |
| フォント | `Noto Sans JP`（日本語）+ `Inter`（英数字） |

---

## 開発フェーズ

| Phase | 内容 | 状態 |
|-------|------|------|
| Phase 1 | 静的サイト公開（認証なし） | 開発中 |
| Phase 2 | ブログ・イベント機能 | 未着手 |
| Phase 3 | Supabase認証・会員管理 | 未着手 |

---

## External Dependencies

| サービス | 用途 | Phase |
|---------|------|-------|
| Vercel | ホスティング・デプロイ | 1〜 |
| Cloudflare | ドメイン・メール転送 | 1〜 |
| Resend | フォーム自動返信メール | 1〜 |
| Contentlayer | MDXブログ管理 | 2〜 |
| Supabase | 認証・データベース | 3〜 |

---

## Testing

```bash
# 単体・コンポーネントテスト（Vitest + React Testing Library）
docker compose exec app npm run test

# カバレッジ
docker compose exec app npm run test -- --coverage

# E2Eテスト（Playwright）
docker compose exec app npm run test:e2e

# 特定ファイルのみ
docker compose exec app npm run test -- src/components/ui/Button.test.tsx
```

### 外部サービスのモック

Supabase・Resend等の外部サービスを使用するコードは必ずモックすること。

```typescript
import { vi } from 'vitest'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}))
```

---

## PRマージ後のブランチ操作

```bash
# 1. mainに移動して最新取得
git checkout main
git pull origin main

# 2. マージ済みブランチ削除
git branch -d <merged-branch-name>

# 3. 次の作業ブランチを作成
git checkout -b feat/<next-feature>
```
