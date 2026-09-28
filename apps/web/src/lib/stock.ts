// 値は docs/plan.md 6.2 stock_reports.status に合わせる。
// API のレスポンス型を作るときに apps/web と apps/api の共有型へ移す
export type StockStatus = 'in_stock' | 'out'

/** この時間を過ぎた在庫報告は「古い情報」としてグレー表示にする（docs/plan.md 2.3） */
export const STOCK_REPORT_STALE_MINUTES = 6 * 60
