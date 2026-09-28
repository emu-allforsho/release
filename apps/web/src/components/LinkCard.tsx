import { getServiceLogo } from '../lib/serviceLogos'

type Props = {
  // サービス名。ロゴが登録されていればロゴで、なければ文字で表示する
  name: string
  href: string
  description?: string
}

/** 配信・購入サービスなど、外部サイトへのリンク1件 */
export default function LinkCard({ name, href, description }: Props) {
  const logo = getServiceLogo(name)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-tap items-center justify-between gap-4 rounded-card bg-bg px-4 py-3 shadow transition-colors hover:bg-bg-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <span className="min-w-0">
        {/* ロゴ自体がサービス名なので、読み上げ用に alt へ名前を入れる */}
        {logo ? <img src={logo} alt={name} className="h-6 w-auto" /> : <span className="block font-bold">{name}</span>}
        {description && <span className="mt-1 block text-sm text-ink-sub">{description}</span>}
      </span>
      <span className="shrink-0 rounded-pill bg-primary px-4 py-1 text-sm font-bold">
        開く<span aria-hidden="true"> ↗</span>
      </span>
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  )
}
