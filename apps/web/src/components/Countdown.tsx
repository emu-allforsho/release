import { useNow } from '../hooks/useNow'
import { formatJst, getRemaining } from '../lib/datetime'

type Props = {
  // 例：「発売まで」「オリコン集計締切まで」
  label: string
  target: string
  endedText?: string
}

export default function Countdown({ label, target, endedText = '終了しました' }: Props) {
  const now = useNow()
  const { isOver, days, hours, minutes } = getRemaining(target, now)

  const units = [
    { value: days, unit: '日' },
    { value: hours, unit: '時間' },
    { value: minutes, unit: '分' },
  ]

  return (
    <div>
      <p className="text-sm font-bold">{label}</p>
      {isOver ? (
        <p className="mt-1 text-2xl font-bold">{endedText}</p>
      ) : (
        // 毎分読み上げられると邪魔なので aria-live は付けない
        <p className="mt-1 flex items-baseline gap-1 font-bold">
          <span className="text-sm">あと</span>
          {units.map(({ value, unit }) => (
            <span key={unit} className="flex items-baseline">
              <span className="text-4xl tabular-nums">{value}</span>
              <span className="ml-0.5 text-sm">{unit}</span>
            </span>
          ))}
        </p>
      )}
      <p className="mt-1 text-xs text-ink-sub">
        <time dateTime={target}>{formatJst(target)}</time> まで（日本時間）
      </p>
    </div>
  )
}
