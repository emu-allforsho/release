import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary'

type CommonProps = {
  variant?: Variant
  children: ReactNode
  className?: string
}

// href があればリンク、なければボタンとして描画する（見た目は同じでも意味が違うため要素を分ける）
type ButtonProps = CommonProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>
type LinkProps = CommonProps & { href: string; external?: boolean } & AnchorHTMLAttributes<HTMLAnchorElement>

const base =
  'inline-flex min-h-tap items-center justify-center gap-2 rounded-pill px-6 font-bold ' +
  'transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ' +
  'disabled:cursor-not-allowed disabled:opacity-60'

// 淡い色の上の文字は ink にする（白文字はコントラスト不足）
const variants: Record<Variant, string> = {
  primary: 'bg-primary text-ink',
  secondary: 'border-2 border-primary bg-bg text-ink',
}

export default function Button(props: ButtonProps | LinkProps) {
  if (props.href !== undefined) {
    const { variant = 'primary', children, className = '', external = false, ...rest } = props
    return (
      <a
        className={`${base} ${variants[variant]} ${className}`}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        {...rest}
      >
        {children}
        {external && <span className="sr-only">（新しいタブで開きます）</span>}
      </a>
    )
  }

  const { variant = 'primary', children, className = '', type = 'button', ...rest } = props
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
