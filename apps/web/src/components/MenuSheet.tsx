import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router'
import { menuItems } from '../lib/navigation'

type Props = {
  open: boolean
  onClose: () => void
}

/** 全ページへのメニュー。画面下から出すことで、開く・選ぶ・閉じるを片手で完結させる */
export default function MenuSheet({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  // showModal() を使うと、背面の操作禁止・フォーカスの閉じ込め・Esc で閉じるをブラウザが担ってくれる
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label="メニュー"
      onClose={onClose}
      // 背景（::backdrop）を押したときも閉じる。中身のクリックは target が dialog にならない
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="mb-0 mt-auto w-full max-w-md rounded-t-card bg-bg p-0 text-ink backdrop:bg-ink/40"
    >
      <div className="px-4 pb-safe-bottom pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">メニュー</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-tap min-w-tap items-center justify-center rounded-pill focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
          >
            <X aria-hidden="true" strokeWidth={1.75} />
            <span className="sr-only">閉じる</span>
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-2 pb-4">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                // ホームだけ完全一致にする（/shops/:id を開いているときも「お店」を選択中にするため）
                end={path === '/'}
                onClick={onClose}
                className="flex min-h-tap items-center gap-2 rounded-card bg-bg-soft px-4 py-3 text-sm font-bold aria-[current=page]:bg-primary"
              >
                <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  )
}
