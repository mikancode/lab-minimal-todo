import { useState, useRef, useEffect } from 'react'

export default function AddItemButton({ onAdd, label, todosCount, maxItems, maxLength, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const isFull = todosCount >= maxItems
  const isOverLimit = text.length > maxLength

  // トリガーボタンから開いたときのみフォーカス（初期表示時は自動フォーカスしない）
  useEffect(() => {
    if (isOpen && !defaultOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen, defaultOpen])

  function handleOpen() {
    setIsOpen(true)
  }

  function handleSubmit(e) {
    e?.preventDefault()
    // compositionend のタイミングにより React state が遅れる場合に DOM 値を参照
    const val = inputRef.current?.value ?? text
    if (!val.trim() || val.length > maxLength) return
    onAdd(val)
    setText('')
    // 追加後もフォームを閉じずにフォーカスを維持して連続入力を可能にする
    inputRef.current?.focus()
  }

  function handleClose() {
    // テキストが入力済みの場合は破棄せず自動送信してから閉じる（blur 時の誤操作対策）
    const val = inputRef.current?.value ?? text
    if (val.trim() && val.length <= maxLength) {
      handleSubmit()
    }
    setText('')
    setIsOpen(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleClose()
    }
  }

  if (isFull) {
    return <p className="add-item-full">上限（{maxItems}件）に達しました</p>
  }

  if (!isOpen) {
    return (
      <button className="add-item-trigger" onClick={handleOpen}>
        {label}
      </button>
    )
  }

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          ref={inputRef}
          className="input-field"
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={handleClose}
          onKeyDown={handleKeyDown}
          placeholder="アイテムを追加..."
          autoComplete="off"
          autoCorrect="off"
        />
        {text.length > 0 && (
          <span className={`char-counter${isOverLimit ? ' char-counter--over' : ''}`}>
            {text.length} / {maxLength}
          </span>
        )}
      </div>
    </form>
  )
}
