import { useState, useRef, useEffect } from 'react'

export default function AddItemButton({ onAdd, label, todosCount, maxItems, maxLength, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const isFull = todosCount >= maxItems
  const isOverLimit = text.length > maxLength

  // トリガーボタンから開いたときのみフォーカス（マウント時は自動フォーカスしない）
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
    // compositionend のタイミングにより React state が遅れる場合にDOM値を参照
    const val = inputRef.current?.value ?? text
    if (!val.trim() || val.length > maxLength) return
    onAdd(val)
    setText('')
    if (defaultOpen) {
      // 常時表示フォームはフォームを閉じずにフォーカスを維持
      inputRef.current?.focus()
    } else {
      setIsOpen(false)
    }
  }

  function handleBlur() {
    // トリガーから開いたフォームはテキストが空なら閉じる
    if (!defaultOpen && !text.trim()) setIsOpen(false)
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
          onBlur={handleBlur}
          placeholder={isFull ? `上限（${maxItems}件）に達しました` : 'アイテムを追加...'}
          autoComplete="off"
          autoCorrect="off"
        />
        {text.length > 0 && (
          <span className={`char-counter${isOverLimit ? ' char-counter--over' : ''}`}>
            {text.length} / {maxLength}
          </span>
        )}
      </div>
      {!defaultOpen && (
        <>
          <button
            className="add-btn"
            type="submit"
            disabled={!text.trim() || isOverLimit}
            onMouseDown={e => e.preventDefault()}
          >
            追加
          </button>
          <button
            className="add-btn add-btn--secondary"
            type="button"
            onClick={() => setIsOpen(false)}
            onMouseDown={e => e.preventDefault()}
          >
            ×
          </button>
        </>
      )}
    </form>
  )
}
