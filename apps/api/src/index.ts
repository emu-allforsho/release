import { Hono } from 'hono'
import health from './routes/health'
import home from './routes/home'
import type { Bindings } from './types'

// フロントと同じオリジンで /api 配下に載せる想定なので basePath を揃えておく
const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

app.route('/health', health)
app.route('/home', home)

export default app
