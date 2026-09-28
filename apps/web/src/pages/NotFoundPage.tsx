import Button from '../components/Button'

export default function NotFoundPage() {
  return (
    <main className="px-4 py-8">
      <h1 className="text-xl font-bold">ページが見つかりません</h1>
      <p className="mt-2 text-sm text-ink-sub">URL が間違っているか、ページが移動した可能性があります。</p>
      <Button to="/" className="mt-6">
        ホームへ戻る
      </Button>
    </main>
  )
}
