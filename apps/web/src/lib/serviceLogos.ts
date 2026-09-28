import amazonMusic from '../assets/services/amazonMusic.svg'
import appleMusic from '../assets/services/appleMusic.svg'
import awa from '../assets/services/awa.svg'
import lineMusic from '../assets/services/lineMusic.svg'
import spotify from '../assets/services/spotify.svg'
import youtubeMusic from '../assets/services/youtubeMusic.svg'

// links.platform（サービス名）からロゴを引く。リリースごとにデータを足すだけで済むよう、名前で対応づける。
// 白抜きだったロゴ（AWA / Amazon Music / Apple Music / YouTube Music の文字）は、白背景で見えるよう ink 色に塗り替えてある
const logos: Record<string, string> = {
  'Amazon Music': amazonMusic,
  'Apple Music': appleMusic,
  AWA: awa,
  'LINE MUSIC': lineMusic,
  Spotify: spotify,
  'YouTube Music': youtubeMusic,
}

/** ロゴがないサービスは undefined を返し、呼び出し側で名前の文字表示にする */
export function getServiceLogo(platform: string): string | undefined {
  return logos[platform]
}
