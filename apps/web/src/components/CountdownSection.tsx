import { Link } from 'react-router'
import type { Campaign, Deadline, Release } from 'shared'
import { useNow } from '../hooks/useNow'
import { getCountdownPhase } from '../lib/countdownPhase'
import { pages } from '../lib/navigation'
import Card from './Card'
import Countdown from './Countdown'
import ExternalLink from './ExternalLink'
import SectionHeading from './SectionHeading'

type Props = {
  release: Release
  deadlines: Deadline[]
  campaigns: Campaign[]
}

// アプリ内リンク（キャンペーン一覧へ）も外部リンクと見た目をそろえる
const linkClass = 'mt-2 inline-flex min-h-tap items-center text-sm font-bold underline underline-offset-4'

export default function CountdownSection({ release, deadlines, campaigns }: Props) {
  // 毎分更新されるので、ページを開いたまま発売時刻を過ぎても次の段階に切り替わる
  const now = useNow()
  const phase = getCountdownPhase(release, deadlines, now)
  // キャンペーンは段階とは別枠で、締切がいちばん近いものを出し続ける
  // （API は締切順で返すので、終了していない最初の1件が直近）
  const nextCampaign = campaigns.find((c) => new Date(c.deadlineAt).getTime() > now)

  if (phase.kind === 'none' && !nextCampaign) return null

  return (
    <section className="space-y-4">
      <SectionHeading>カウントダウン</SectionHeading>

      {phase.kind === 'release' && (
        <Card>
          <Countdown label="発売まで" target={release.releaseAt} endedText="発売中！" />
        </Card>
      )}

      {phase.kind === 'deadlines' &&
        phase.deadlines.map((deadline) => (
          <Card key={deadline.id}>
            <Countdown label={`${deadline.label}まで`} target={deadline.deadlineAt} endedText="集計期間は終了しました" />
            {/* 集計ルールに触れる表示には公式ページへのリンクを添える（CLAUDE.md） */}
            <ExternalLink href={deadline.url} className="mt-2 text-sm">
              集計ルールを公式ページで確認
            </ExternalLink>
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
