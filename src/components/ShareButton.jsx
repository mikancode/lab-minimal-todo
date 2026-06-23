import { useState } from 'react'

export default function ShareButton({ getShareUrl, disabled }) {
  const [copied, setCopied] = useState(false)

  async function copyToClipboard(url) {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      prompt('このURLをコピーしてください:', url)
    }
  }

  async function handleShare() {
    const url = getShareUrl()
    if (navigator.share) {
      try {
        await navigator.share({ url })
      } catch (e) {
        // キャンセル（AbortError）は無視、その他はクリップボードにフォールバック
        if (e.name !== 'AbortError') {
          await copyToClipboard(url)
        }
      }
    } else {
      await copyToClipboard(url)
    }
  }

  return (
    <button
      className={`share-btn${copied ? ' share-btn--copied' : ''}`}
      onClick={handleShare}
      disabled={disabled}
    >
      {copied ? '✓ コピーしました' : '共有'}
    </button>
  )
}
