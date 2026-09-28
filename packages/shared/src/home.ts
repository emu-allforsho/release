// GET /api/home のレスポンス。日時はすべて UTC の ISO 8601 文字列で、表示時に日本時間へ変換する

export type Release = {
  id: string
  title: string
  releaseAt: string
  officialUrl: string | null
  mvVideoId: string | null
}

export type Deadline = {
  id: string
  label: string
  deadlineAt: string
  // 集計ルールに触れる表示には公式ページへのリンクを添えるため必須
  url: string
}

export type ServiceLink = {
  id: string
  // フロントのロゴ対応表と同じ表記
  platform: string
  url: string
}

export type Campaign = {
  id: string
  title: string
  description: string | null
  url: string
  startAt: string | null
  deadlineAt: string
}

export type MvStats = {
  viewCount: number
  fetchedAt: string
}

export type HomeResponse = {
  // 表示中のリリースが未設定なら null（リリースの合間など）
  release: Release | null
  deadlines: Deadline[]
  links: {
    streaming: ServiceLink[]
    download: ServiceLink[]
  }
  // 終了済みも含む。ページを開いている間に締切を迎えることがあるため、表示するかはフロントで判断する
  campaigns: Campaign[]
  mv: MvStats | null
}
