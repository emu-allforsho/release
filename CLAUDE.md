# CLAUDE.md

Number_i のリリース応援 Web アプリ（非公式ファンサイト）の開発ルール。
作業前に必ずこのファイルを読み、詳細は `docs/plan.md`（企画書）を参照すること。

---

## プロジェクト概要

- Number_i の新作リリース時に、ファンが気軽に楽しく応援でき、必要な情報をすぐ手に入れられる Web アプリ
- **複数リリース対応**：新作が出たらデータを追加するだけで立ち上げられる仕組みにする。1作品専用のコードは書かない
- 開発中は架空のダミーデータ（`apps/api/src/db/seed/dev.sql`、`npm run db:seed -w apps/api` でローカルに投入）を使う。過去作のデータは必要になったら追加する
- 対象ユーザーはスマホ中心の国内ファン。UI の文言はすべて日本語

---

## 技術構成

| 領域 | 使用技術 |
|---|---|
| フロントエンド | Vite + React + TypeScript |
| スタイリング | Tailwind CSS |
| ホスティング | Cloudflare Pages |
| API | Hono（本番は Cloudflare Pages Functions で同じドメインの `/api/*` に載せる） |
| データベース | Cloudflare D1 |
| 定期処理 | Workers Cron Triggers（Pages Functions では動かないため別の Worker） |
| 地図 | Leaflet + OpenStreetMap |
| 通知 | Web Push（VAPID） |
| パッケージ管理 | npm workspaces |

新しいライブラリを追加する前に、理由を説明して確認を取ること。

---

## ディレクトリ構成

```
/
├── apps/
│   ├── web/                    # フロントエンド
│   │   └── src/
│   │       ├── components/     # 共通コンポーネント
│   │       ├── pages/          # ページ（ルートごと）
│   │       ├── admin/          # 管理画面
│   │       ├── hooks/
│   │       ├── lib/            # API クライアント・ユーティリティ
│   │       ├── styles/
│   │       └── data/           # 開発用シードデータ
│   └── api/                    # API（Hono）。本番は functions/ から呼ばれる
│       ├── src/
│       │   ├── routes/         # API エンドポイント
│       │   ├── cron/           # 定期処理
│       │   └── db/
│       │       ├── migrations/ # D1 スキーマ
│       │       └── seed/       # テストデータ
│       └── wrangler.toml
├── functions/
│   └── api/[[route]].ts        # Pages Functions の入口（/api/* を apps/api に渡すだけ）
├── packages/
│   └── shared/                 # web と api で共有する API の型（型のみ）
├── docs/
│   └── plan.md                 # 企画書
└── CLAUDE.md
```

---

## よく使うコマンド

```bash
# 依存関係のインストール（ルートで実行）
npm install

# フロントエンド開発サーバー（http://localhost:5173、/api は 8787 へプロキシ）
npm run dev

# API 開発サーバー（http://localhost:8787）
npm run dev:api

# ビルド（フロントエンド）
npm run build

# D1 マイグレーション・テストデータ投入（ローカル）
npm run db:migrate -w apps/api
npm run db:seed -w apps/api

# 本番と同じ構成（Pages + Functions + D1）でローカル確認（http://localhost:8788、先に npm run build）
npx wrangler pages dev apps/web/dist --port 8788 --d1 DB=5f498bb5-1787-408b-b2df-cb2c39208e1a --persist-to apps/api/.wrangler/state

# 型チェック・Lint
npm run typecheck
npm run lint
```

---

## コーディング規約

- TypeScript は `strict: true`。`any` は使わない
- React は関数コンポーネント + Hooks
- ファイル名：コンポーネントは `PascalCase.tsx`、それ以外は `camelCase.ts`
- 1コンポーネント1ファイル。200行を超えたら分割を検討
- API のレスポンス型は `apps/web` と `apps/api` で共有する型定義（`packages/shared`、`import type { … } from 'shared'`）を使う
- コメントは「なぜそうしたか」を日本語で書く
- 変更は小さく分けて行い、1回の作業で複数の機能をまたがない

---

## デザインルール

### 方針
- **白背景 + 可愛い色味**、**見やすさ最優先**
- スマホファースト（幅 375px 基準で作り、PC は後から調整）
- 片手で操作しやすい配置（主要ボタンは画面下寄り）

### デザイントークン
色・フォント・角丸・余白は `tailwind.config` に定義したトークンのみ使う。
コンポーネント内に HEX 値を直接書かない。

| トークン | 値 | 用途 |
|---|---|---|
| `bg` | `#FFFFFF` | 背景 |
| `bg-soft` | `#FFF7FA` | サブ背景 |
| `primary` | `#FF8FB1` | メイン（ピンク） |
| `lavender` | `#B8A4F4` | サブ |
| `mint` | `#8FD9C4` | サブ |
| `accent` | `#FFD66B` | アクセント |
| `ink` | `#3A3A4A` | 本文テキスト |
| `ink-sub` | `#6E6E7E` | 補助テキスト |
| `stock-in` | `#FFD66B` | 在庫あり |
| `stock-out` | `#C4C4CC` | 在庫なし |

### ルール
- 淡い色（primary / lavender / mint / accent）は背景・装飾に使い、**文字色には使わない**
- 淡い色・在庫色の上に載せる文字は `ink` にする（白文字はコントラスト不足）
- 文字と背景のコントラスト比は 4.5:1 以上
- 角丸：カード `16px`、ボタンはピル型
- 余白は 8px グリッド
- タップ領域は最小 44×44px
- フォントは見出し・本文とも M PLUS 1p
- 数字（再生回数・カウントダウン）は大きく太く、等幅数字（`tabular-nums`）
- アニメーションは控えめ。`prefers-reduced-motion` に対応する
- 在庫状況は色だけで区別せず、必ずテキストやアイコンを併記する

---

## データのルール

- スキーマの正は `docs/plan.md` の6章。変更する場合は先に企画書を更新する
- **リリースに属するデータは必ず `release_id` を持つ**。店舗（`stores`）はリリース共通
- 表示中のリリースは `site_settings.current_release_id` で決まる。コード内でリリースを固定しない
- 日時は ISO 8601（UTC）で保存し、表示時に日本時間（Asia/Tokyo）へ変換する
- 削除は原則 `is_hidden` などのフラグで行い、物理削除しない
- マイグレーションは追加のみ。既存のマイグレーションファイルは書き換えない
- スキーマを変更する前に、変更内容を説明して確認を取ること

---

## セキュリティ

- **API キー・秘密情報をフロントエンドに置かない**。YouTube Data API などは Workers 経由で呼ぶ
- 秘密情報は `wrangler secret` で管理し、リポジトリにコミットしない（`.dev.vars` は `.gitignore` に入れる）
- ユーザー入力（在庫報告・チャット・申請）はサーバー側で必ず検証する（文字数・形式・NG ワード）
- 書き込み系 API にはレート制限と Cloudflare Turnstile を入れる
- 位置情報はサーバーに送らず、端末内で距離計算する
- 管理画面 `/admin` は認証必須（Cloudflare Access を想定）

---

## コンテンツ・権利のルール

- すべてのページのフッターに「非公式ファンサイト」と明記する
- 公式写真・ジャケット画像を保存・転載しない。公式ページへのリンクか公式の埋め込みのみ使う
- MV は YouTube 公式の埋め込みプレーヤーを使う
- 不自然なループ再生など、規約違反や集計除外につながる応援方法を推奨する文言を書かない
- チャートの集計ルールに触れる文言には、公式ページへのリンクを添える
- 開発用のダミー文言でもメンバーや関係者を揶揄する内容を書かない

---

## 作業の進め方

- 作業を始める前に、何をどう変えるかを短く説明する
- 企画書の方針と違う実装が必要になったら、実装前に相談する
- 決定事項が変わったら `docs/plan.md` を更新する
- 作業が終わったら、変更したファイルと確認方法を簡潔に報告する
- 不明点は推測で進めず質問する

---

## 現在の状況

- 対象リリースは未定。今後のために先行して開発中
- 現在：ロードマップ Phase 1（MVP）。土台は完了し、ページ作成に入っている
- 雛形作成：済
- GitHub：https://github.com/emu-allforsho/release（`main`）
- Cloudflare Pages へのデプロイ：済（https://number-i-release.pages.dev/ 、GitHub 連携で `main` への push 時に自動デプロイ）
  - ビルド設定：コマンド `npm run build`、出力 `apps/web/dist`、ルートはリポジトリ直下、`NODE_VERSION=22`
  - API は Pages Functions（`functions/api/[[route]].ts`）で同じドメインの `/api/*` に公開済み。D1 は Pages の設定で `DB` として接続（Production）
- デザイントークン定義：済（`apps/web/tailwind.config.ts`）
- 共通コンポーネント第1弾：済（Button / Card / SectionHeading / LinkCard / Countdown / StockBadge / FreshnessLabel。確認ページは開発サーバーの `/dev/components`）
- 共通コンポーネント第2弾：済（Header / BottomNav / MenuSheet / Layout。`lucide-react`・`react-router` を導入。ページ一覧は `apps/web/src/lib/navigation.ts`）
- D1 スキーマ：済（`apps/api/src/db/migrations/0001_initial.sql`、定義は `docs/plan.md` 6章）。本番 D1 `number-i-release`（APAC）にも適用済み
  - 本番への適用：`cd apps/api && npx wrangler d1 migrations apply number-i-release --remote`
- **店舗・通販は後回し**（既存の在庫報告サイトとの役割分担が未定のため。`docs/plan.md` 10章）
- ホーム：済（リリース情報・カウントダウン・配信/DL リンク・MV 埋め込み。API は `GET /api/home`）
- MV 再生回数の定期取得：コードは済（`apps/api/src/cron/mvStats.ts`、10分ごと）。**未完了**：YouTube API キーの取得、Worker `number-i-release-api` の本番デプロイと `wrangler secret put YOUTUBE_API_KEY`
- 本番 D1 にはまだリリースのデータがない（本番へのデータ投入方法・管理画面は未定）
- 次のタスク：MV 再生回数の本番化 → キャンペーン一覧 / 応援ガイド / サイトについて
