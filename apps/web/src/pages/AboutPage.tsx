import type { ReactNode } from 'react'
import ExternalLink from '../components/ExternalLink'
import SectionHeading from '../components/SectionHeading'

// サイトについて・免責事項・プライバシー・お問い合わせ（docs/plan.md 9章）。
// プライバシーの項目は「今のサイトで実際に起きていること」だけを書く。機能を足したら必ずここも更新する
const LAST_UPDATED = '2026年9月29日'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <SectionHeading>{title}</SectionHeading>
      <div className="space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export default function AboutPage() {
  return (
    <main className="space-y-8 px-4 py-6">
      <h1 className="text-xl font-bold">サイトについて</h1>

      <Section title="このサイトについて">
        <p>
          このサイトは、Number_i
          の新作リリースを応援するファンが、必要な情報をすぐに見つけて気軽に応援できるようにつくった
          <strong>非公式ファンサイト</strong>です。
        </p>
        <p>ファン有志が個人で運営しており、アーティスト本人・所属事務所・レーベル・各サービスとは一切関係ありません。</p>
      </Section>

      <Section title="リンクと収益について">
        <p>
          当サイトに掲載している通販サイト・配信サービスなどへのリンクは、アフィリエイトリンク（紹介料が発生するリンク）ではありません。
          <strong>リンク先での購入や利用によって、運営者が報酬などの利益を得ることはありません。</strong>
        </p>
        <p>また、当サイトに広告は掲載しておらず、収益を目的とした運営は行っていません。</p>
      </Section>

      <Section title="免責事項">
        <Bullets
          items={[
            '掲載している情報は、できるかぎり正確になるよう努めていますが、正確性・最新性を保証するものではありません。発売日・キャンペーン・特典などの最新情報は、必ず公式の発表をご確認ください。',
            'リンク先の外部サイトの内容や、そこで行う購入・応募などについて、当サイトは責任を負いません。',
            '当サイトの利用によって生じたいかなる損害についても、責任を負いかねます。',
            '掲載内容は、予告なく変更・削除したり、サイトの運営を終了したりすることがあります。',
          ]}
        />
      </Section>

      <Section title="著作権・商標について">
        <Bullets
          items={[
            '楽曲・映像・画像などの著作権その他の権利は、それぞれの権利者に帰属します。',
            '当サイトでは公式の写真やジャケット画像を保存・転載せず、公式ページへのリンクと、YouTube 公式の埋め込みプレーヤーのみを使用しています。',
            '掲載している各サービスの名称・ロゴは、各社の商標または登録商標です。',
            '権利者の方から掲載内容についてご連絡をいただいた場合は、速やかに対応します。',
          ]}
        />
      </Section>

      <Section title="応援にあたって">
        <p>
          チャートの集計方法は、各チャートの運営元が定めており、変更されることがあります。応援の前に、必ず公式サイトで最新のルールをご確認ください。
        </p>
        <ul className="space-y-1">
          <li>
            <ExternalLink href="https://www.oricon.co.jp/">オリコン公式サイト</ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.billboard-japan.com/">Billboard JAPAN 公式サイト</ExternalLink>
          </li>
        </ul>
        <p>当サイトは、各サービスの利用規約に反する方法や、集計の対象外となるおそれのある方法での応援はおすすめしません。</p>
      </Section>

      <Section title="プライバシーについて">
        <Bullets
          items={[
            '当サイトには会員登録はなく、お名前やメールアドレスなどの個人情報を入力していただくことはありません。',
            'サイトの配信に使用している Cloudflare が、安全な運営のためにアクセス元の IP アドレスなどの通信記録を取得することがあります。',
            'MV の表示に YouTube の埋め込みプレーヤーを使用しています。再生時などに、YouTube（Google）が Cookie 等を使用して情報を取得することがあります。',
            '文字の表示に Google Fonts を使用しており、閲覧時にフォントを読み込むため Google のサーバーと通信します。',
            '現在、アクセス解析ツールは使用していません。',
          ]}
        />
        <p>今後、機能の追加などにより取り扱いが変わる場合は、このページでお知らせします。</p>
      </Section>

      <Section title="お問い合わせ">
        <p>お問い合わせ窓口は現在準備中です。</p>
      </Section>

      <p className="text-xs text-ink-sub">最終更新：{LAST_UPDATED}</p>
    </main>
  )
}
