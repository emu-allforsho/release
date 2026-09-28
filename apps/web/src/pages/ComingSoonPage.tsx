import Button from '../components/Button'

// 企画書の画面構成にあるが、まだ作っていないページ。ナビから押したときに 404 にしないための仮ページ
export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <main className="px-4 py-8">
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-ink-sub">このページは準備中です。</p>
      <Button to="/" className="mt-6">
        ホームへ戻る
      </Button>
    </main>
  )
}
