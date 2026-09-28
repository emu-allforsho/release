import { useEffect, useState } from 'react'

/**
 * 現在時刻を一定間隔で更新して返す。カウントダウンと「○分前」表示で共用する。
 * 表示が分単位なので、既定では毎分0秒ちょうどに更新して表示のずれを防ぐ。
 */
export function useNow(intervalMs = 60 * 1000): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      const current = Date.now()
      setNow(current)
      timer = setTimeout(tick, intervalMs - (current % intervalMs))
    }

    // バックグラウンドのタブではタイマーが間引かれるため、戻ってきたときにすぐ更新する
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      clearTimeout(timer)
      tick()
    }

    timer = setTimeout(tick, intervalMs - (Date.now() % intervalMs))
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [intervalMs])

  return now
}
