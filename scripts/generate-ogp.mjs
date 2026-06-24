import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

// Vercelのビルド環境はCJKフォントがないため、コミット済みのogp.pngをそのまま使う
if (process.env.VERCEL) {
  console.log('Vercel環境のためOGP画像生成をスキップします')
  process.exit(0)
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../public/ogp.png')
const touchIconPath = join(__dirname, '../public/apple-touch-icon.png')

const TOUCH_ICON_SIZE = 180

const W = 1200
const H = 630

// コンテンツを中央 630×630 エリアに収める
const ICON_SIZE = 140
const ICON_X = (W - ICON_SIZE) / 2   // 水平中央
const ICON_Y = 175
const SCALE = ICON_SIZE / 32          // ファビコン(32px)→140px の拡大率

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>

  <!-- アイコン（ファビコンと同デザイン: M+L+チェックマーク） -->
  <rect x="${ICON_X}" y="${ICON_Y}" width="${ICON_SIZE}" height="${ICON_SIZE}" rx="${Math.round(7 * SCALE)}" fill="#FF6B6B"/>
  <g transform="translate(${ICON_X}, ${ICON_Y}) scale(${SCALE})" fill="none" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 5 23 V 9"/>
    <path d="M 5 9 l 7 7 7 -7"/>
    <path d="M 19 9 v 14 h 8"/>
  </g>
  <g transform="translate(${ICON_X}, ${ICON_Y}) scale(${SCALE})">
    <path d="M 8.5 12.5 l 3.5 3.5 7 -7" fill="none" stroke="#FF6B6B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- アプリ名 -->
  <text x="${W / 2}" y="${ICON_Y + ICON_SIZE + 75}" font-family="system-ui, -apple-system, sans-serif" font-size="80" font-weight="800" letter-spacing="-2" fill="#222222" text-anchor="middle">みにまリスト</text>

  <!-- 説明文 -->
  <text x="${W / 2}" y="${ICON_Y + ICON_SIZE + 132}" font-family="system-ui, -apple-system, sans-serif" font-size="30" fill="#888888" text-anchor="middle">シンプルなTodoリスト。URLで共有できます。</text>
</svg>`

await sharp(Buffer.from(svg)).png().toFile(outPath)
console.log(`OGP image generated: ${outPath}`)

// favicon.svg をそのままソースとして TOUCH_ICON_SIZE でレンダリング
const faviconSvg = readFileSync(join(__dirname, '../public/favicon.svg'), 'utf8')
  .replace('<svg ', `<svg width="${TOUCH_ICON_SIZE}" height="${TOUCH_ICON_SIZE}" `)
await sharp(Buffer.from(faviconSvg)).png().toFile(touchIconPath)
console.log(`Apple touch icon generated: ${touchIconPath}`)
