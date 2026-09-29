-- 開発用のダミーデータ（ローカル専用。本番には入れない）。npm run db:seed -w apps/api で投入する
-- 作品名・キャンペーンはすべて架空。カウントダウンをいつでも試せるよう、日時は投入した時点からの相対で作る
-- 何度流しても同じ状態になるよう、先にダミーの行を消してから入れ直す（開発用なので物理削除でよい）

DELETE FROM campaigns WHERE release_id IN ('dev-current', 'dev-past');
DELETE FROM links WHERE release_id IN ('dev-current', 'dev-past');
DELETE FROM deadlines WHERE release_id IN ('dev-current', 'dev-past');
UPDATE site_settings SET current_release_id = NULL WHERE id = 1;
DELETE FROM releases WHERE id IN ('dev-current', 'dev-past');

-- 表示中のリリース。発売は約9〜10日後の 0:00（日本時間）。UTC の日付から計算するので、投入した時刻で1日ずれる
INSERT INTO releases (id, title, release_at, official_url, mv_video_id) VALUES
  -- MV は埋め込み確認のため実在の公式動画を使う（Number_i 公式チャンネル「DIGITAL GIRL (Visualizer)」）
  ('dev-current', 'テストシングル（架空）', strftime('%Y-%m-%dT15:00:00.000Z', 'now', '+9 days'), 'https://example.com/release', 'cz9wgp-DU0A'),
  -- 複数リリースの切り替え確認用。site_settings で選ばれていないので表示されないはず
  ('dev-past', '過去のテスト作品（架空）', strftime('%Y-%m-%dT15:00:00.000Z', 'now', '-60 days'), 'https://example.com/past', NULL);

UPDATE site_settings SET current_release_id = 'dev-current', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = 1;

-- 集計締切。URL は各チャートの公式トップ（集計ルールに触れる表示には公式リンクを添えるルール）
INSERT INTO deadlines (id, release_id, label, deadline_at, url, sort_order) VALUES
  ('dev-deadline-oricon', 'dev-current', 'オリコン週間集計締切（テスト）', strftime('%Y-%m-%dT14:59:59.000Z', 'now', '+15 days'), 'https://www.oricon.co.jp/', 1),
  ('dev-deadline-billboard', 'dev-current', 'Billboard JAPAN 集計締切（テスト）', strftime('%Y-%m-%dT14:59:59.000Z', 'now', '+15 days'), 'https://www.billboard-japan.com/', 2),
  ('dev-deadline-past', 'dev-past', '過去作の締切（表示されないはず）', strftime('%Y-%m-%dT14:59:59.000Z', 'now', '-50 days'), 'https://www.oricon.co.jp/', 1);

-- 配信・DL。platform はロゴの対応表（apps/web/src/lib/serviceLogos.ts）と同じ表記にする。URL は各サービスのトップ
INSERT INTO links (id, release_id, category, platform, url, sort_order) VALUES
  ('dev-link-spotify', 'dev-current', 'streaming', 'Spotify', 'https://open.spotify.com/', 1),
  ('dev-link-apple', 'dev-current', 'streaming', 'Apple Music', 'https://music.apple.com/jp/', 2),
  ('dev-link-line', 'dev-current', 'streaming', 'LINE MUSIC', 'https://music.line.me/', 3),
  ('dev-link-amazon', 'dev-current', 'streaming', 'Amazon Music', 'https://music.amazon.co.jp/', 4),
  ('dev-link-ytmusic', 'dev-current', 'streaming', 'YouTube Music', 'https://music.youtube.com/', 5),
  ('dev-link-awa', 'dev-current', 'streaming', 'AWA', 'https://s.awa.fm/', 6),
  ('dev-link-itunes', 'dev-current', 'download', 'iTunes Store', 'https://www.apple.com/jp/itunes/', 1),
  ('dev-link-mora', 'dev-current', 'download', 'mora', 'https://mora.jp/', 2),
  ('dev-link-recochoku', 'dev-current', 'download', 'レコチョク', 'https://recochoku.jp/', 3),
  -- 非表示の確認用。is_hidden = 1 なので表示されないはず
  ('dev-link-hidden', 'dev-current', 'streaming', '非表示テスト', 'https://example.com/hidden', 99),
  ('dev-link-past', 'dev-past', 'streaming', 'Spotify', 'https://open.spotify.com/', 1);
UPDATE links SET is_hidden = 1 WHERE id = 'dev-link-hidden';

-- キャンペーン。締切が近いもの・先のもの・終了済みを1件ずつ
INSERT INTO campaigns (id, release_id, title, description, url, start_at, deadline_at) VALUES
  ('dev-campaign-soon', 'dev-current', '予約キャンペーン（テスト）', '締切が近いキャンペーンの表示確認用です。', 'https://example.com/campaign-soon', strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-5 days'), strftime('%Y-%m-%dT14:59:00.000Z', 'now', '+2 days')),
  ('dev-campaign-later', 'dev-current', '購入者応募キャンペーン（テスト）', '締切が先のキャンペーンの表示確認用です。', 'https://example.com/campaign-later', NULL, strftime('%Y-%m-%dT14:59:00.000Z', 'now', '+30 days')),
  ('dev-campaign-ended', 'dev-current', '終了したキャンペーン（テスト）', '終了済みの表示確認用です。', 'https://example.com/campaign-ended', NULL, strftime('%Y-%m-%dT14:59:00.000Z', 'now', '-1 days'));
