import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import { pages } from './lib/navigation'
import AboutPage from './pages/AboutPage'
import ComingSoonPage from './pages/ComingSoonPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

// import.meta.env.DEV は本番ビルドで false に置き換わるため、確認ページは本番に含まれない
const DevComponentsPage = import.meta.env.DEV ? lazy(() => import('./pages/DevComponentsPage')) : null

// 作成済みのページ。ここに無いものは「準備中」ページを出す
const builtPaths: string[] = [pages.home.path, pages.about.path]
const comingSoonPages = Object.values(pages).filter(({ path }) => !builtPaths.includes(path))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={pages.about.path} element={<AboutPage />} />
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
