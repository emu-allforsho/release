import { Link } from 'react-router'
import type { Campaign, Deadline, Release } from 'shared'
import { useNow } from '../hooks/useNow'
import { pages } from '../lib/navigation'
import Card from './Card'
import Countdown from './Countdown'
import SectionHeading from './SectionHeading'

type Props = {
  release: Release
  deadlines: Deadline[]
  campaigns: Campaign[]
}

const linkClass = 'mt-2 inline-flex min-h-tap items-center text-sm font-bold underline underline-offset-4'

export default function CountdownSection({ release, deadlines, campaigns }: Props) {
  const now = useNow()
  // ホームには締切がいちばん近いキャンペーンだけ出す。一覧はキャンペーンページで見る
  // （API は締切順で返すので、終了していない最初の1件が直近）
  const nextCampaign = campaigns.find((c) => new Date(c.deadlineAt).getTime() > now)

  return (
    <section className="space-y-4">
      <SectionHeading>カウントダウン</SectionHeading>

      <Card>
        <Countdown label="発売まで" target={release.releaseAt} endedText="発売中！" />
      </Card>

      {deadlines.map((deadline) => (
        <Card key={deadline.id}>
          <Countdown label={`${deadline.label}まで`} target={deadline.deadlineAt} endedText="集計期間は終了しました" />
          {/* 集計ルールに触れる表示には公式ページへのリンクを添える（CLAUDE.md） */}
          <a href={deadline.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            集計ルールを公式ページで確認<span aria-hidden="true"> ↗</span>
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </Card>
      ))}

      {nextCampaign && (
        <Card>
          <Countdown label={`${nextCampaign.title} 締切まで`} target={nextCampaign.deadlineAt} />
          <Link to={pages.campaigns.path} className={linkClass}>
            キャンペーン一覧を見る
          </Link>
        </Card>
      )}
    </section>
  )
}
