import {
  BookOpen,
  CalendarDays,
  CirclePlay,
  Disc3,
  Gift,
  Headphones,
  House,
  Info,
  MessageCircle,
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
  listen: { path: '/listen', label: '聴く', icon: Headphones },
  mv: { path: '/mv', label: 'MV', icon: CirclePlay },
  cd: { path: '/cd', label: 'CD', icon: Disc3 },
  shops: { path: '/shops', label: 'お店', icon: Store },
  campaigns: { path: '/campaigns', label: 'キャンペーン', icon: Gift },
  guide: { path: '/guide', label: '応援ガイド', icon: BookOpen },
  schedule: { path: '/schedule', label: 'スケジュール', icon: CalendarDays },
  chat: { path: '/chat', label: 'チャット', icon: MessageCircle },
  about: { path: '/about', label: 'サイトについて', icon: Info },
} satisfies Record<string, NavItem>

// 下部ナビは片手で届く数に絞り、トップページの「クイックリンク」と同じ4つにする
export const bottomNavItems: NavItem[] = [pages.home, pages.listen, pages.shops, pages.campaigns]

export const menuItems: NavItem[] = Object.values(pages)
