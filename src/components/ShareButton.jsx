import { useState } from 'react'

export default function ShareButton({ getShareUrl, disabled }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = getShareUrl()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      prompt('このURLをコピーしてください:', url)
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
