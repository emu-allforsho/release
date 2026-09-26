import { Hono } from 'hono'
import health from './routes/health'
import type { Bindings } from './types'

// フロントと同じオリジンで /api 配下に載せる想定なので basePath を揃えておく
const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

app.route('/health', health)

export default app
