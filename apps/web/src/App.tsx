import { lazy, Suspense } from 'react'
import Footer from './components/Footer'

// import.meta.env.DEV は本番ビルドで false に置き換わるため、確認ページは本番に含まれない
const DevComponentsPage = import.meta.env.DEV ? lazy(() => import('./pages/DevComponentsPage')) : null

export default function App() {
  // ルーター導入（共通コンポーネント第2弾）までの仮の分岐
  const showDevPage = DevComponentsPage && window.location.pathname === '/dev/components'

  return (
    <div className="flex min-h-dvh flex-col">
      {showDevPage ? (
        <Suspense>
          <DevComponentsPage />
        </Suspense>
      ) : (
        <main className="flex-1 px-4 py-8">
          <h1 className="text-xl font-bold">Number_i リリース応援</h1>
          <p className="mt-2 text-sm text-ink-sub">準備中です。</p>
        </main>
      )}
      <Footer />
    </div>
  )
}
