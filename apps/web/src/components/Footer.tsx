// 権利ルール上、すべてのページに非公式である旨を表示する必要があるため共通化している
export default function Footer() {
  return (
    <footer className="px-4 py-6 text-center text-xs text-ink-sub">
      <p>このサイトは非公式ファンサイトです。</p>
      <p className="mt-1">公式とは一切関係ありません。</p>
    </footer>
  )
}
