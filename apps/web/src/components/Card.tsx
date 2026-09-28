import type { ReactNode } from 'react'

type Props = {
  // white：白背景の上で目立たせたいとき / soft：まとまりを淡く区切りたいとき
  tone?: 'white' | 'soft'
  as?: 'div' | 'section' | 'article' | 'li'
  children: ReactNode
  className?: string
}

const tones = {
  // 白背景の上の白カードは境界が見えないため、影で浮かせる
  white: 'bg-bg shadow',
  soft: 'bg-bg-soft',
}

export default function Card({ tone = 'white', as: Tag = 'div', children, className = '' }: Props) {
  return <Tag className={`rounded-card p-4 ${tones[tone]} ${className}`}>{children}</Tag>
}
