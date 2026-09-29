import type { HomeResponse } from 'shared'

// API は同じオリジンの /api 配下（開発時は vite の proxy で wrangler dev へ転送）

export async function fetchHome(signal?: AbortSignal): Promise<HomeResponse> {
  const res = await fetch('/api/home', { signal })
  if (!res.ok) throw new Error(`/api/home の取得に失敗しました（HTTP ${res.status}）`)
  return (await res.json()) as HomeResponse
}
