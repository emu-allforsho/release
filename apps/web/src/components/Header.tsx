import { Link } from 'react-router'

// メニューは片手で押せるよう下部ナビに置いているので、ヘッダーはサイト名だけにする
export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-bg-soft bg-bg">
      <div className="mx-auto flex max-w-md items-center px-4">
        <Link to="/" className="flex min-h-tap items-center text-lg font-bold">
          Number_i リリース応援
        </Link>
      </div>
    </header>
  )
}
