// Workers のバインディング。D1 や秘密情報を追加したらここに型を足す
export type Bindings = {
  // wrangler.toml の [[d1_databases]] binding = "DB"
  DB: D1Database
}
