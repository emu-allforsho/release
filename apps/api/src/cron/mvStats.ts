import type { CronBindings } from '../types'

type VideosResponse = {
  items?: { statistics?: { viewCount?: string } }[]
}

/**
 * 表示中リリースの MV の再生回数を YouTube Data API から取得し、mv_stats を上書きする。
 * videos.list は1回1ユニットなので、10分ごとでも1日144ユニット（無料枠 10,000）に収まる
 */
export async function updateMvStats(env: CronBindings): Promise<void> {
  const release = await env.DB.prepare(
    'SELECT mv_video_id FROM releases WHERE id = (SELECT current_release_id FROM site_settings WHERE id = 1)',
  ).first<{ mv_video_id: string | null }>()

  const videoId = release?.mv_video_id
  // リリースの合間や MV 公開前は何もしない
  if (!videoId) return

  const url = new URL('https://www.googleapis.com/youtube/v3/videos')
  url.searchParams.set('part', 'statistics')
  url.searchParams.set('id', videoId)
  url.searchParams.set('key', env.YOUTUBE_API_KEY)

  const res = await fetch(url)
  // URL には API キーが入っているので、エラーメッセージやログには含めない
  if (!res.ok) throw new Error(`YouTube API の呼び出しに失敗しました（HTTP ${res.status}、動画 ${videoId}）`)

  const json = (await res.json()) as VideosResponse
  const viewCount = Number(json.items?.[0]?.statistics?.viewCount)
  // 非公開・削除・ID の誤りだと items が空になる。0 で上書きしないよう、前回の値を残して終える
  if (!Number.isSafeInteger(viewCount)) throw new Error(`再生回数を取得できませんでした（動画 ${videoId}）`)

  await env.DB.prepare(
    `INSERT INTO mv_stats (video_id, view_count, fetched_at) VALUES (?, ?, ?)
     ON CONFLICT (video_id) DO UPDATE SET view_count = excluded.view_count, fetched_at = excluded.fetched_at`,
  )
    .bind(videoId, viewCount, new Date().toISOString())
    .run()
}
