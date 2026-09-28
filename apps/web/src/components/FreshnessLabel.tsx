import { useNow } from '../hooks/useNow'
import { formatJst, formatRelative, isOlderThan } from '../lib/datetime'
import { STOCK_REPORT_STALE_MINUTES } from '../lib/stock'

type Props = {
  reportedAt: string
  staleAfterMinutes?: number
}

/** 「○分前に報告」。古い報告は色を薄くし、色だけに頼らず「古い情報」とも書く */
export default function FreshnessLabel({ reportedAt, staleAfterMinutes = STOCK_REPORT_STALE_MINUTES }: Props) {
  const now = useNow()
  const stale = isOlderThan(reportedAt, now, staleAfterMinutes)

  return (
    <span className={`text-sm ${stale ? 'text-ink-sub' : 'text-ink'}`}>
      {/* 相対表記だけだと正確な時刻がわからないため、title と dateTime に絶対時刻を持たせる */}
      <time dateTime={reportedAt} title={formatJst(reportedAt)}>
        {formatRelative(reportedAt, now)}に報告
      </time>
      {stale && <span className="ml-2 rounded-pill bg-bg-soft px-2 py-0.5 text-xs">古い情報</span>}
    </span>
  )
}
