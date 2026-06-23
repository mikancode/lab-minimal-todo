import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../public/ogp.png')

const W = 1200
const H = 630

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F7F5F2"/>

  <!-- logo mark -->
  <rect x="96" y="200" width="80" height="80" rx="20" fill="#FF6B6B"/>
  <rect x="112" y="222" width="48" height="9" rx="4.5" fill="white"/>
  <rect x="112" y="240" width="34" height="9" rx="4.5" fill="white"/>
  <rect x="112" y="258" width="22" height="9" rx="4.5" fill="white"/>

  <!-- title -->
  <text x="200" y="265" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="800" letter-spacing="-2" fill="#222222">Minimal Todo</text>

  <!-- description -->
  <text x="96" y="356" font-family="system-ui, -apple-system, sans-serif" font-size="32" fill="#AAAAAA">シンプルなTodoリスト。URLで共有できます。</text>
</svg>`

await sharp(Buffer.from(svg)).png().toFile(outPath)
console.log(`OGP image generated: ${outPath}`)
