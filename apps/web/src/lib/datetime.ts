// 日時は UTC の ISO 8601 で受け取り、表示だけ日本時間にする（CLAUDE.md データのルール）

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

// 端末のタイムゾーンが海外でも日本時間で表示するため、timeZone を固定する
const jstFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

/** 例：2026/10/15(木) 0:00 */
export function formatJst(iso: string): string {
  return jstFormatter.format(new Date(iso))
}

const jstDateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
})

/** 例：2026/10/15(木)。発売日のように時刻が要らない表示に使う */
export function formatJstDate(iso: string): string {
  return jstDateFormatter.format(new Date(iso))
}

export type Remaining = {
  isOver: boolean
  days: number
  hours: number
  minutes: number
}

/** 締切までの残り時間。表示は分単位なので、秒は切り上げて「あと0分」にならないようにする */
export function getRemaining(targetIso: string, now: number): Remaining {
  const diff = new Date(targetIso).getTime() - now
  if (diff <= 0) return { isOver: true, days: 0, hours: 0, minutes: 0 }

  const totalMinutes = Math.ceil(diff / MINUTE_MS)
  return {
    isOver: false,
    days: Math.floor(totalMinutes / (24 * 60)),
    hours: Math.floor((totalMinutes % (24 * 60)) / 60),
    minutes: totalMinutes % 60,
  }
}

/** 例：たった今 / 5分前 / 3時間前 / 2日前 */
export function formatRelative(iso: string, now: number): string {
  // 端末の時計が少しずれていると未来の日時になることがあるため、0 未満は「たった今」に丸める
  const diff = Math.max(0, now - new Date(iso).getTime())
  if (diff < MINUTE_MS) return 'たった今'
  if (diff < HOUR_MS) return `${Math.floor(diff / MINUTE_MS)}分前`
  if (diff < DAY_MS) return `${Math.floor(diff / HOUR_MS)}時間前`
  return `${Math.floor(diff / DAY_MS)}日前`
}

export function isOlderThan(iso: string, now: number, minutes: number): boolean {
  return now - new Date(iso).getTime() > minutes * MINUTE_MS
}
