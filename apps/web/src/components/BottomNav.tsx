import { Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router'
import { bottomNavItems } from '../lib/navigation'

type Props = {
  onOpenMenu: () => void
}

// 見た目は同じでも、ページ移動はリンク・メニューはボタンと要素を分ける
const itemClass =
  'flex min-h-tap w-full flex-col items-center justify-center gap-0.5 py-1 text-xs text-ink-sub ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink'

function ItemInner({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <>
      {/* 選択中はアイコンの背景をピンクにし、文字も太くして色以外でも区別できるようにする */}
      <span className="flex h-7 w-12 items-center justify-center rounded-pill group-aria-[current=page]:bg-primary">
        {icon}
      </span>
      <span className="group-aria-[current=page]:font-bold group-aria-[current=page]:text-ink">{label}</span>
    </>
  )
}

export default function BottomNav({ onOpenMenu }: Props) {
  return (
    <nav aria-label="メインメニュー" className="fixed inset-x-0 bottom-0 z-10 border-t border-bg-soft bg-bg pb-safe-bottom">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {bottomNavItems.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink to={path} end={path === '/'} className={`group ${itemClass}`}>
              <ItemInner icon={<Icon aria-hidden="true" size={22} strokeWidth={1.75} />} label={label} />
            </NavLink>
          </li>
        ))}
        <li>
          <button type="button" onClick={onOpenMenu} className={`group ${itemClass}`}>
            <ItemInner icon={<Menu aria-hidden="true" size={22} strokeWidth={1.75} />} label="メニュー" />
          </button>
        </li>
      </ul>
    </nav>
  )
}
