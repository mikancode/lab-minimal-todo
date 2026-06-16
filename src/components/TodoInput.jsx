import { useState } from 'react'

export default function TodoInput({ onAdd, todosCount, maxItems, maxLength }) {
  const [text, setText] = useState('')

  const isFull = todosCount >= maxItems
  const isOverLimit = text.length > maxLength
  const canSubmit = text.trim() && !isOverLimit && !isFull

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    onAdd(text)
    setText('')
  }

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
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
        追加
      </button>
    </form>
  )
}
