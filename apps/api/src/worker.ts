import { updateMvStats } from './cron/mvStats'
import app from './index'
import type { CronBindings } from './types'

// wrangler で動かす Worker の入口。
// 本番の API は Pages Functions（functions/api）が担当し、この Worker は定期処理だけを本番で使う。
// fetch はローカル開発（npm run dev:api）で API を動かすために残している（本番の workers.dev は無効）
export default {
  fetch: app.fetch,
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(updateMvStats(env))
  },
} satisfies ExportedHandler<CronBindings>
