import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import { pages } from './lib/navigation'
import ComingSoonPage from './pages/ComingSoonPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

// import.meta.env.DEV は本番ビルドで false に置き換わるため、確認ページは本番に含まれない
const DevComponentsPage = import.meta.env.DEV ? lazy(() => import('./pages/DevComponentsPage')) : null

// まだ作っていないページ。完成したものから個別の Route に置き換えていく
const comingSoonPages = Object.values(pages).filter(({ path }) => path !== pages.home.path)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          {comingSoonPages.map(({ path, label }) => (
            <Route key={path} path={`${path}/*`} element={<ComingSoonPage title={label} />} />
          ))}
          {DevComponentsPage && (
            <Route
              path="/dev/components"
              element={
                <Suspense>
                  <DevComponentsPage />
                </Suspense>
              }
            />
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
