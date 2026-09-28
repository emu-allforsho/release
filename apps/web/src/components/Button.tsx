import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary'

type CommonProps = {
  variant?: Variant
  children: ReactNode
  className?: string
}

// to ならアプリ内の移動、href なら外部サイトへのリンク、どちらもなければボタンとして描画する
// （見た目は同じでも意味が違うため要素を分ける。アプリ内は Link にして再読み込みを防ぐ）
type ButtonProps = CommonProps & { to?: undefined; href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>
type RouteLinkProps = CommonProps & { to: string; href?: undefined }
type ExternalLinkProps = CommonProps & { to?: undefined; href: string; external?: boolean } & AnchorHTMLAttributes<HTMLAnchorElement>

const base =
  'inline-flex min-h-tap items-center justify-center gap-2 rounded-pill px-6 font-bold ' +
  'transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ' +
  'disabled:cursor-not-allowed disabled:opacity-60'

// 淡い色の上の文字は ink にする（白文字はコントラスト不足）
const variants: Record<Variant, string> = {
  primary: 'bg-primary text-ink',
  secondary: 'border-2 border-primary bg-bg text-ink',
}

export default function Button(props: ButtonProps | RouteLinkProps | ExternalLinkProps) {
  if (props.to !== undefined) {
    const { variant = 'primary', children, className = '', to } = props
    return (
      <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
        {children}
      </Link>
    )
  }

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
