import { useCallback, useEffect, useState } from 'react'
import type { HomeResponse } from 'shared'
import { fetchHome } from '../lib/api'

export type HomeState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; data: HomeResponse }

/** ホームのデータを取得する。失敗したときに画面から再試行できるよう reload を返す */
export function useHome(): { state: HomeState; reload: () => void } {
  const [state, setState] = useState<HomeState>({ status: 'loading' })
  // 値を変えると useEffect が再実行され、再取得になる
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // ページを離れたあとに結果が返ってきても state を更新しないよう中断する
    const controller = new AbortController()
    setState({ status: 'loading' })
    fetchHome(controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error(error)
        setState({ status: 'error' })
      })
    return () => controller.abort()
  }, [attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])
  return { state, reload }
}
