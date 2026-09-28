import type { Config } from 'tailwindcss'

// 値の正は docs/plan.md 4章。ここ以外に色・フォントの値を書かない
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // extend ではなく置き換えにして、トークン以外の色（gray-600 など）を使えなくする
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      bg: '#FFFFFF',
      'bg-soft': '#FFF7FA',
      primary: '#FF8FB1',
      lavender: '#B8A4F4',
      mint: '#8FD9C4',
      accent: '#FFD66B',
      ink: '#3A3A4A',
      // 企画書の当初案 #8A8A99 はコントラスト比 3.40 で基準未達のため濃くした
      'ink-sub': '#6E6E7E',
      'stock-in': '#FFD66B',
      'stock-out': '#C4C4CC',
    },
    fontFamily: {
      // 見出し・本文とも同じフォントなので、デフォルト（font-sans）だけを定義する
      sans: ['"M PLUS 1p"', 'system-ui', 'sans-serif'],
    },
    extend: {
      borderRadius: {
        card: '16px',
        pill: '9999px',
      },
      // 余白は Tailwind 標準の 4px 刻みを使い、偶数の値（2, 4, 6…）で 8px グリッドに揃える
      spacing: {
        // タップ領域の最小サイズ。min-h-tap / min-w-tap で使う
        tap: '44px',
      },
    },
  },
  plugins: [],
} satisfies Config
