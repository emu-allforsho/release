import { useState } from 'react'
import { Outlet } from 'react-router'
import BottomNav from './BottomNav'
import Footer from './Footer'
import Header from './Header'
import MenuSheet from './MenuSheet'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    // 下部ナビは固定表示なので、その高さ（約 64px + セーフエリア）ぶん下に余白を空けて最後の要素が隠れないようにする
    <div className="flex min-h-dvh flex-col pb-safe-nav">
      <Header />
      <div className="mx-auto w-full max-w-md flex-1">
        <Outlet />
      </div>
      <Footer />
      <BottomNav onOpenMenu={() => setMenuOpen(true)} />
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
