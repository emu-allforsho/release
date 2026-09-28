import type { StockStatus } from '../lib/stock'

// 色だけで区別しないルールのため、記号と文字を必ず併記する
const styles: Record<StockStatus, { label: string; mark: string; className: string }> = {
  in_stock: { label: '在庫あり', mark: '●', className: 'bg-stock-in' },
  out: { label: '在庫なし', mark: '×', className: 'bg-stock-out' },
}

export default function StockBadge({ status }: { status: StockStatus }) {
  const { label, mark, className } = styles[status]

  return (
    <span className={`inline-flex items-center gap-1 rounded-pill px-3 py-1 text-sm font-bold text-ink ${className}`}>
      <span aria-hidden="true">{mark}</span>
      {label}
    </span>
  )
}
