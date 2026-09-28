import { Hono } from 'hono'
import type { Campaign, Deadline, HomeResponse, MvStats, Release, ServiceLink } from 'shared'
import type { Bindings } from '../types'

// D1 から返る行（カラム名は snake_case）
type ReleaseRow = { id: string; title: string; release_at: string; official_url: string | null; mv_video_id: string | null }
type DeadlineRow = { id: string; label: string; deadline_at: string; url: string }
type LinkRow = { id: string; category: 'streaming' | 'download' | 'cd'; platform: string; url: string }
type CampaignRow = { id: string; title: string; description: string | null; url: string; start_at: string | null; deadline_at: string }
type MvStatsRow = { view_count: number; fetched_at: string }

// 表示中のリリースはコードに固定せず、毎回 site_settings から引く
const CURRENT_RELEASE = '(SELECT current_release_id FROM site_settings WHERE id = 1)'

const home = new Hono<{ Bindings: Bindings }>()

home.get('/', async (c) => {
  const db = c.env.DB

  // 1回の往復で済むよう batch でまとめて問い合わせる
  const [releases, deadlines, links, campaigns, mvStats] = await db.batch([
    db.prepare(
      `SELECT id, title, release_at, official_url, mv_video_id FROM releases WHERE id = ${CURRENT_RELEASE}`,
    ),
    db.prepare(
      `SELECT id, label, deadline_at, url FROM deadlines
       WHERE release_id = ${CURRENT_RELEASE} AND is_hidden = 0
       ORDER BY deadline_at, sort_order`,
    ),
    // 通販（cd）は後回しの方針なので、ホームでは配信と DL だけ返す
    db.prepare(
      `SELECT id, category, platform, url FROM links
       WHERE release_id = ${CURRENT_RELEASE} AND is_hidden = 0 AND category IN ('streaming', 'download')
       ORDER BY sort_order`,
    ),
    db.prepare(
      `SELECT id, title, description, url, start_at, deadline_at FROM campaigns
       WHERE release_id = ${CURRENT_RELEASE} AND is_hidden = 0
       ORDER BY deadline_at`,
    ),
    db.prepare(
      `SELECT m.view_count, m.fetched_at FROM mv_stats m
       JOIN releases r ON r.mv_video_id = m.video_id
       WHERE r.id = ${CURRENT_RELEASE}`,
    ),
  ])

  const releaseRow = (releases?.results as ReleaseRow[] | undefined)?.[0]
  const release: Release | null = releaseRow
    ? {
        id: releaseRow.id,
        title: releaseRow.title,
        releaseAt: releaseRow.release_at,
        officialUrl: releaseRow.official_url,
        mvVideoId: releaseRow.mv_video_id,
      }
    : null

  const linkRows = (links?.results ?? []) as LinkRow[]
  const toServiceLink = ({ id, platform, url }: LinkRow): ServiceLink => ({ id, platform, url })

  const mvRow = (mvStats?.results as MvStatsRow[] | undefined)?.[0]
  const mv: MvStats | null = mvRow ? { viewCount: mvRow.view_count, fetchedAt: mvRow.fetched_at } : null

  const body: HomeResponse = {
    release,
    deadlines: ((deadlines?.results ?? []) as DeadlineRow[]).map(
      (r): Deadline => ({ id: r.id, label: r.label, deadlineAt: r.deadline_at, url: r.url }),
    ),
    links: {
      streaming: linkRows.filter((r) => r.category === 'streaming').map(toServiceLink),
      download: linkRows.filter((r) => r.category === 'download').map(toServiceLink),
    },
    campaigns: ((campaigns?.results ?? []) as CampaignRow[]).map(
      (r): Campaign => ({
        id: r.id,
        title: r.title,
        description: r.description,
        url: r.url,
        startAt: r.start_at,
        deadlineAt: r.deadline_at,
      }),
    ),
    mv,
  }

  // 管理者が更新する情報なので、1分程度の遅れは許容して D1 への問い合わせを減らす
  c.header('Cache-Control', 'public, max-age=60')
  return c.json(body)
})

export default home
