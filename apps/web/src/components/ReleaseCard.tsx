import type { Release } from 'shared'
import { formatJstDate } from '../lib/datetime'
import Button from './Button'
import Card from './Card'

/** ホーム最上部のリリース情報。ジャケット画像は権利ルール上載せず、公式ページへ誘導する */
export default function ReleaseCard({ release }: { release: Release }) {
  return (
    <Card tone="soft" as="section">
      <p className="text-sm font-bold text-ink-sub">最新リリース</p>
      <h2 className="mt-1 text-2xl font-bold">{release.title}</h2>
      <p className="mt-2">
        <time dateTime={release.releaseAt}>{formatJstDate(release.releaseAt)}</time> 発売
      </p>
      {release.officialUrl && (
        <Button href={release.officialUrl} external className="mt-4 w-full">
          公式ページを見る<span aria-hidden="true">↗</span>
        </Button>
      )}
    </Card>
  )
}
