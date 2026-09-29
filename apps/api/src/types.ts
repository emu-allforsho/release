// Workers のバインディング。D1 や秘密情報を追加したらここに型を足す
export type Bindings = {
  // wrangler.toml の [[d1_databases]] binding = "DB"（本番の Pages でも同じ名前で接続する）
  DB: D1Database
}

// 定期処理用 Worker だけが持つ秘密情報。Pages Functions（API）には渡さないので型を分ける
export type CronBindings = Bindings & {
  // wrangler secret put YOUTUBE_API_KEY で登録（ローカルは .dev.vars）
  YOUTUBE_API_KEY: string
}
