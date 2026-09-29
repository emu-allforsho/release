import Button from '../components/Button'
import CountdownSection from '../components/CountdownSection'
import ReleaseCard from '../components/ReleaseCard'
import ServiceLinkSection from '../components/ServiceLinkSection'
import { useHome } from '../hooks/useHome'

// トップページ（docs/plan.md 3.1）。MV・チェックリスト・新着在庫報告は別のステップで追加する
export default function HomePage() {
  const { state, reload } = useHome()

  return (
    <main className="px-4 py-6">
      {/* 画面上はリリース名が主役なので、サイト名の見出しは読み上げ用にだけ置く。
          space-y の余白が付かないよう、セクションを並べる div の外に置く */}
      <h1 className="sr-only">Number_i リリース応援 ホーム</h1>
      <div className="space-y-8">
        {state.status === 'loading' && (
          <p role="status" className="py-8 text-center text-ink-sub">
            読み込み中…
          </p>
        )}

        {state.status === 'error' && (
          <div role="alert" className="py-8 text-center">
            <p>情報を読み込めませんでした。</p>
            <p className="mt-1 text-sm text-ink-sub">通信状況を確認して、もう一度お試しください。</p>
            <Button onClick={reload} className="mt-4">
              再読み込み
            </Button>
          </div>
        )}

        {state.status === 'success' && !state.data.release && (
          <p className="py-8 text-center text-ink-sub">現在、表示できるリリース情報はありません。</p>
        )}

        {state.status === 'success' && state.data.release && (
          <>
            <ReleaseCard release={state.data.release} />
            <CountdownSection
              release={state.data.release}
              deadlines={state.data.deadlines}
              campaigns={state.data.campaigns}
            />
            <ServiceLinkSection id="listen" title="配信で聴く" links={state.data.links.streaming} />
            <ServiceLinkSection id="download" title="ダウンロードで買う" links={state.data.links.download} />
          </>
        )}
      </div>
    </main>
  )
}
