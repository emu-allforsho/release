import type { Deadline, Release } from 'shared'

// ホームのカウントダウンは、リリースの進み具合に合わせて1段階ずつ切り替える（docs/plan.md 3.1）
// 発売前 → 発売まで / 発売後 → 集計締切まで / 締切後 → 出さない
export type CountdownPhase =
  | { kind: 'release' }
  | { kind: 'deadlines'; deadlines: Deadline[] }
  | { kind: 'none' }

export function getCountdownPhase(release: Release, deadlines: Deadline[], now: number): CountdownPhase {
  if (new Date(release.releaseAt).getTime() > now) return { kind: 'release' }

  // 発売後は、まだ締切を迎えていない集計締切だけを出す（オリコンと Billboard のように複数ありうる）
  const upcoming = deadlines.filter((d) => new Date(d.deadlineAt).getTime() > now)
  if (upcoming.length > 0) return { kind: 'deadlines', deadlines: upcoming }

  return { kind: 'none' }
}
