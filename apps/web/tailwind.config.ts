import type { Config } from 'tailwindcss'

// デザイントークン（色・フォント・角丸）は次のステップでここに定義する
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
