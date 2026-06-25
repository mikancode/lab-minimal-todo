import { useEffect } from 'react'

const TOAST_DURATION = 4000

export default function UndoToast({ item, onUndo, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [item.item.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__text">「{item.item.text}」を削除しました</span>
      <button className="toast__undo-btn" onClick={onUndo}>
        ↩ 元に戻す
      </button>
    </div>
  )
}
