import type { ReactNode } from 'react'

type Props = {
  // ページの h1 の下に来ることが多いので既定は h2
  level?: 2 | 3
  children: ReactNode
  className?: string
}

export default function SectionHeading({ level = 2, children, className = '' }: Props) {
  const Tag = level === 2 ? 'h2' : 'h3'
  const size = level === 2 ? 'text-lg' : 'text-base'

  return (
    <Tag className={`flex items-center gap-2 font-bold ${size} ${className}`}>
      {/* 淡い色は装飾にだけ使うルールなので、ピンクは頭の飾りに使う */}
      <span aria-hidden="true" className="h-5 w-1.5 shrink-0 rounded-pill bg-primary" />
      {children}
    </Tag>
  )
}
