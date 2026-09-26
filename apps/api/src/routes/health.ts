import { Hono } from 'hono'
import type { Bindings } from '../types'

const health = new Hono<{ Bindings: Bindings }>()

health.get('/', (c) => c.json({ ok: true }))

export default health
