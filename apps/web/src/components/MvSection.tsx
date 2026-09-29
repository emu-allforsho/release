import type { MvStats } from 'shared'
import { useNow } from '../hooks/useNow'
import { formatJst, formatRelative } from '../lib/datetime'
import Card from './Card'
import SectionHeading from './SectionHeading'

type Props = {
  videoId: string
  title: string
  // Cron で取得した再生回数。まだ一度も取得できていなければ null
  stats: MvStats | null
}

export default function MvSection({ videoId, title, stats }: Props) {
  const now = useNow()
  const id = encodeURIComponent(videoId)

  return (
    <section id="mv" className="scroll-mt-16 space-y-4">
      <SectionHeading>MV</SectionHeading>

      {/* 権利ルールに従い YouTube 公式の埋め込みプレーヤーを使う。ページを開いただけで読み込まないよう lazy にする */}
      <div className="aspect-video overflow-hidden rounded-card bg-bg-soft">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={`${title} MV（YouTube）`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          // YouTube の埋め込みは参照元の送信が必要（ないと再生できない）
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>

      {stats && (
        <Card>
          <p className="text-sm font-bold">再生回数</p>
          <p className="mt-1 font-bold">
            <span className="text-4xl tabular-nums">{stats.viewCount.toLocaleString('ja-JP')}</span>
            <span className="ml-1 text-sm">回</span>
          </p>
          <p className="mt-1 text-xs text-ink-sub">
            <time dateTime={stats.fetchedAt} title={formatJst(stats.fetchedAt)}>
              {formatRelative(stats.fetchedAt, now)}
            </time>
            に更新（YouTube の公開値。反映まで時間がかかることがあります）
          </p>
        </Card>
      )}

      <a
        href={`https://www.youtube.com/watch?v=${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-tap items-center text-sm font-bold underline underline-offset-4"
      >
        YouTube で見る<span aria-hidden="true"> ↗</span>
        <span className="sr-only">（新しいタブで開きます）</span>
      </a>
    </section>
  )
}
