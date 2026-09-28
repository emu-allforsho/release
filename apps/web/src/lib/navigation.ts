import {
  BookOpen,
  CalendarDays,
  Gift,
  House,
  Info,
  MessageCircle,
  ShoppingCart,
  Store,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  path: string
  label: string
  icon: LucideIcon
}

// 画面構成（docs/plan.md 3章）。ルーティング・下部ナビ・メニューはすべてここから作る
export const pages = {
  home: { path: '/', label: 'ホーム', icon: House },
  // 「通販」はネットで買う場所、「お店」は実店舗。どこで買うかで分ける（docs/plan.md 3章）
  cd: { path: '/cd', label: '通販', icon: ShoppingCart },
  shops: { path: '/shops', label: 'お店', icon: Store },
  campaigns: { path: '/campaigns', label: 'キャンペーン', icon: Gift },
  guide: { path: '/guide', label: '応援ガイド', icon: BookOpen },
  schedule: { path: '/schedule', label: 'スケジュール', icon: CalendarDays },
  chat: { path: '/chat', label: 'チャット', icon: MessageCircle },
  about: { path: '/about', label: 'サイトについて', icon: Info },
} satisfies Record<string, NavItem>

// 下部ナビは片手で届く数に絞る。「どこで買うか」を探す通販・お店を並べて置く（聴く・MV はホームに置く）
export const bottomNavItems: NavItem[] = [pages.home, pages.cd, pages.shops, pages.campaigns]

export const menuItems: NavItem[] = Object.values(pages)
