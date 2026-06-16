import { useState, useRef } from 'react'

export default function TodoInput({ onAdd, onAddBack, todosCount, maxItems, maxLength }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const isFull = todosCount >= maxItems
  const isOverLimit = text.length > maxLength
  const canSubmit = text.trim() && !isOverLimit && !isFull

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    onAdd(text)
    setText('')
    // iOS含むモバイルでキーボードを維持するため、user gestureの中でfocusを呼ぶ
    inputRef.current?.focus()
  }

  function handleAddBack() {
    if (!canSubmit) return
    onAddBack(text)
    setText('')
    inputRef.current?.focus()
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
          placeholder={isFull ? `上限（${maxItems}件）に達しました` : 'アイテムを追加...'}
          disabled={isFull}
          autoComplete="off"
          autoCorrect="off"
        />
        {text.length > 0 && (
          <span className={`char-counter${isOverLimit ? ' char-counter--over' : ''}`}>
            {text.length} / {maxLength}
          </span>
        )}
      </div>
      <button className="add-btn" type="submit" disabled={!canSubmit}>
        先頭
      </button>
      <button className="add-btn add-btn--secondary" type="button" onClick={handleAddBack} disabled={!canSubmit}>
        末尾
      </button>
    </form>
  )
}
