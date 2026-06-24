import { useState, useRef } from 'react'

export default function AddItemButton({ onAdd, label, todosCount, maxItems, maxLength }) {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const isFull = todosCount >= maxItems
  const isOverLimit = text.length > maxLength
  const canSubmit = text.trim().length > 0 && !isOverLimit

  function handleOpen() {
    setIsOpen(true)
    // ユーザーイベント内でfocusを呼ぶことでiOSのキーボードを開く
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function handleSubmit(e) {
    e?.preventDefault()
    // compositionendのタイミングによりReact stateが遅れる場合にDOM値を参照
    const val = inputRef.current?.value ?? text
    if (!val.trim() || val.length > maxLength) return
    onAdd(val)
    setText('')
    setIsOpen(false)
  }

  function handleCancel() {
    setText('')
    setIsOpen(false)
  }

  function handleBlur() {
    // 入力が空のまま離れた場合のみ閉じる
    if (!text.trim()) handleCancel()
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
      <button
        className="add-btn"
        type="submit"
        disabled={!canSubmit}
        onMouseDown={e => e.preventDefault()}
      >
        追加
      </button>
      <button
        className="add-btn add-btn--secondary"
        type="button"
        onClick={handleCancel}
        onMouseDown={e => e.preventDefault()}
      >
        ×
      </button>
    </form>
  )
}
