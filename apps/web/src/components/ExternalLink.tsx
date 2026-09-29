import type { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  className?: string
}

/** 外部サイトへの文字リンク。新しいタブで開くことを見た目と読み上げの両方で伝える */
export default function ExternalLink({ href, children, className = '' }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-tap items-center font-bold underline underline-offset-4 ${className}`}
    >
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  )
}
