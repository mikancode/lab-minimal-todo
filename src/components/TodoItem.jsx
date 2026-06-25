import { useState, useRef, useEffect } from 'react'
import { MAX_TEXT_LENGTH } from '../hooks/useTodos'

export default function TodoItem({ todo, onToggle, onRemove, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  function startEditing() {
    if (todo.done) return
    setDraft(todo.text)
    setIsEditing(true)
  }

  function commit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed.length <= MAX_TEXT_LENGTH) {
      onUpdate(todo.id, trimmed)
    }
    setIsEditing(false)
  }

  function cancel() {
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { e.preventDefault(); cancel() }
  }

  return (
    <li className={`item${todo.done ? ' item--done' : ''}`}>
      <button
        className="check-btn"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.done ? '未完了に戻す' : '完了にする'}
      >
        {todo.done && (
          <svg className="check-icon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <polyline
              points="2,6 5,9 10,3"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      {isEditing ? (
        <input
          ref={inputRef}
          className="item-edit-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          maxLength={MAX_TEXT_LENGTH}
          aria-label="アイテムを編集"
        />
      ) : (
        <span
          className={`item-text${todo.done ? '' : ' item-text--editable'}`}
          onClick={startEditing}
        >
          {todo.text}
        </span>
      )}
      <button
        className="delete-btn"
        onClick={() => onRemove(todo.id)}
        aria-label="削除"
      >
        <svg viewBox="0 0 14 14" fill="none" width="14" height="14" aria-hidden="true">
          <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  )
}
