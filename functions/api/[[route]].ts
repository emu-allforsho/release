import { handle } from 'hono/cloudflare-pages'
import app from '../../apps/api/src/index'

// Cloudflare Pages Functions の入口。/api/* をすべて apps/api の Hono アプリに渡す。
// サイトと同じドメインで API を動かすため Pages に載せている（CORS や別ドメインが不要）。
// D1 は Pages プロジェクトの設定で DB として接続する。定期処理（Cron）は Pages では動かないので別の Worker で行う
export const onRequest = handle(app)
