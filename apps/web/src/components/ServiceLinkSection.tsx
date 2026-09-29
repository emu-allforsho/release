import type { ServiceLink } from 'shared'
import LinkCard from './LinkCard'
import SectionHeading from './SectionHeading'

type Props = {
  // ページ内リンク（例：#listen）の飛び先にするため
  id: string
  title: string
  links: ServiceLink[]
}

/** 配信・DL サービスへのリンク一覧。リンクがないカテゴリは見出しごと出さない */
export default function ServiceLinkSection({ id, title, links }: Props) {
  if (links.length === 0) return null

  return (
    <section id={id} className="scroll-mt-16 space-y-4">
      <SectionHeading>{title}</SectionHeading>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.id}>
            <LinkCard name={link.platform} href={link.url} />
          </li>
        ))}
      </ul>
    </section>
  )
}
