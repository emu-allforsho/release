-- 初期スキーマ（docs/plan.md 6章）。マイグレーションは追加のみで、このファイルは今後書き換えない
-- 日時はすべて UTC の ISO 8601 文字列。既定値もミリ秒付きの同じ形式にそろえる

CREATE TABLE releases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  release_at TEXT NOT NULL,
  -- ジャケット画像は保存しない（権利ルール）。公式ページへのリンクだけ持つ
  official_url TEXT,
  mv_video_id TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- 表示中のリリースをコードに固定しないための設定。1行だけにするため id を 1 に制限する
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  current_release_id TEXT REFERENCES releases (id),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
-- 常に存在する前提で読めるよう、空の設定行を最初から入れておく
INSERT INTO site_settings (id, current_release_id) VALUES (1, NULL);

-- 在庫報告の形態を自由入力にすると表記ゆれで集計できないため、リリースごとに選択肢を持つ
CREATE TABLE editions (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL REFERENCES releases (id),
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (release_id, name)
);

-- チャート集計締切などのカウントダウン。集計ルールに触れるので公式ページの URL を必須にする
CREATE TABLE deadlines (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL REFERENCES releases (id),
  label TEXT NOT NULL,
  deadline_at TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_hidden INTEGER NOT NULL DEFAULT 0 CHECK (is_hidden IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_deadlines_release ON deadlines (release_id, deadline_at);

-- 店舗はリリース共通なので release_id を持たない。リリースごとに変わる特典は benefits に分ける
CREATE TABLE stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  -- benefits.seller と同じ表記にして、チェーン単位の特典を店舗詳細に出す
  chain TEXT,
  -- 位置情報を許可しない人向けに都道府県で絞り込むため必須にする
  prefecture TEXT NOT NULL,
  address TEXT,
  lat REAL,
  lng REAL,
  is_billboard INTEGER NOT NULL DEFAULT 0 CHECK (is_billboard IN (0, 1)),
  is_oricon INTEGER NOT NULL DEFAULT 0 CHECK (is_oricon IN (0, 1)),
  sns_x TEXT,
  sns_instagram TEXT,
  hours TEXT,
  is_hidden INTEGER NOT NULL DEFAULT 0 CHECK (is_hidden IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_stores_prefecture ON stores (prefecture);
CREATE INDEX idx_stores_chain ON stores (chain);

-- 特典はチェーン・通販サイト単位で登録する。全店舗ぶん入力しなくて済むようにするため
CREATE TABLE benefits (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL REFERENCES releases (id),
  seller TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_hidden INTEGER NOT NULL DEFAULT 0 CHECK (is_hidden IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_benefits_release ON benefits (release_id, seller);

CREATE TABLE links (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL REFERENCES releases (id),
  category TEXT NOT NULL CHECK (category IN ('streaming', 'download', 'cd')),
  -- フロントのロゴ対応表（apps/web/src/lib/serviceLogos.ts）と同じ表記にする
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_hidden INTEGER NOT NULL DEFAULT 0 CHECK (is_hidden IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_links_release ON links (release_id, category, sort_order);

CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL REFERENCES releases (id),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  start_at TEXT,
  deadline_at TEXT NOT NULL,
  is_hidden INTEGER NOT NULL DEFAULT 0 CHECK (is_hidden IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_campaigns_release ON campaigns (release_id, deadline_at);

-- ユーザーの投稿なので編集はさせず updated_at は持たない。
-- コメントの文字数上限などの検証は API 側で行う（ここで制限すると上限変更のたびにテーブル作り直しになるため）
CREATE TABLE stock_reports (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL REFERENCES releases (id),
  store_id TEXT NOT NULL REFERENCES stores (id),
  edition_id TEXT NOT NULL REFERENCES editions (id),
  status TEXT NOT NULL CHECK (status IN ('in_stock', 'out')),
  comment TEXT,
  nickname TEXT,
  is_hidden INTEGER NOT NULL DEFAULT 0 CHECK (is_hidden IN (0, 1)),
  report_count INTEGER NOT NULL DEFAULT 0 CHECK (report_count >= 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
-- 店舗ごとの最新報告と、トップページの新着報告を速く引くため
CREATE INDEX idx_stock_reports_store ON stock_reports (release_id, store_id, created_at DESC);
CREATE INDEX idx_stock_reports_recent ON stock_reports (release_id, created_at DESC);

-- 推移グラフはやらないため履歴は持たず、動画ごとに最新値を上書きする
CREATE TABLE mv_stats (
  video_id TEXT PRIMARY KEY,
  view_count INTEGER NOT NULL CHECK (view_count >= 0),
  fetched_at TEXT NOT NULL
);
