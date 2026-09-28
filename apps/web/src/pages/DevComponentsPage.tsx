import Button from '../components/Button'
import Card from '../components/Card'
import Countdown from '../components/Countdown'
import FreshnessLabel from '../components/FreshnessLabel'
import LinkCard from '../components/LinkCard'
import SectionHeading from '../components/SectionHeading'
import StockBadge from '../components/StockBadge'
import type { StockStatus } from '../lib/stock'

// 開発サーバーでだけ開ける部品の確認ページ（/dev/components）。本番ビルドには含まれない

// 表示確認のため、開いた時刻を基準にサンプルの日時を作る
const at = (offsetMinutes: number) => new Date(Date.now() + offsetMinutes * 60 * 1000).toISOString()

// 3件目は 6時間を過ぎているので「古い情報」になる
const sampleReports: { status: StockStatus; reportedAt: string }[] = [
  { status: 'in_stock', reportedAt: at(0) },
  { status: 'in_stock', reportedAt: at(-42) },
  { status: 'out', reportedAt: at(-7 * 60) },
]

export default function DevComponentsPage() {
  return (
    <main className="mx-auto max-w-md space-y-8 px-4 py-8">
      <h1 className="text-xl font-bold">共通コンポーネント確認</h1>

      <section className="space-y-4">
        <SectionHeading>Button</SectionHeading>
        <div className="flex flex-wrap gap-4">
          <Button>メイン</Button>
          <Button variant="secondary">サブ</Button>
          <Button disabled>無効</Button>
          <Button href="https://example.com" external>
            外部リンク
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading>Card</SectionHeading>
        <Card>白カード（tone="white"）</Card>
        <Card tone="soft">淡いカード（tone="soft"）</Card>
      </section>

      <section className="space-y-4">
        <SectionHeading>SectionHeading</SectionHeading>
        <SectionHeading level={3}>小見出し（level=3）</SectionHeading>
      </section>

      <section className="space-y-4">
        <SectionHeading>LinkCard</SectionHeading>
        {['Spotify', 'Apple Music', 'LINE MUSIC', 'Amazon Music', 'YouTube Music', 'AWA'].map((name) => (
          <LinkCard key={name} name={name} href="https://example.com" />
        ))}
        <LinkCard name="Apple Music" href="https://example.com" description="説明文が入る場合の表示" />
        <LinkCard name="ロゴ未登録のサービス" href="https://example.com" />
      </section>

      <section className="space-y-4">
        <SectionHeading>Countdown</SectionHeading>
        <Card tone="soft">
          <Countdown label="発売まで" target={at(3 * 24 * 60 + 125)} />
        </Card>
        <Card tone="soft">
          <Countdown label="締切まで（1分未満）" target={at(0.5)} />
        </Card>
        <Card tone="soft">
          <Countdown label="締切まで（終了後）" target={at(-10)} />
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeading>StockBadge / FreshnessLabel</SectionHeading>
        {sampleReports.map(({ status, reportedAt }) => (
          <Card key={reportedAt} className="flex flex-wrap items-center justify-between gap-2">
            <StockBadge status={status} />
            <FreshnessLabel reportedAt={reportedAt} />
          </Card>
        ))}
      </section>
    </main>
  )
}
