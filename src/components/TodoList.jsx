import { useState, useRef } from 'react'
import TodoItem from './TodoItem'

export default function TodoList({ todos, onToggle, onRemove, onClearDone, children }) {
  const [pendingClear, setPendingClear] = useState(false)
  const timerRef = useRef(null)

  function handleClearClick() {
    if (!pendingClear) {
      setPendingClear(true)
      timerRef.current = setTimeout(() => setPendingClear(false), 3000)
      return
    }
    clearTimeout(timerRef.current)
    onClearDone()
    setPendingClear(false)
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="8" y="10" width="32" height="34" rx="4" stroke="currentColor" strokeWidth="2.5" />
          <line x1="16" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="27" x2="28" y2="27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="34" x2="24" y2="34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <p className="empty-text">リストは空です</p>
        <p className="empty-sub">上のフォームからアイテムを追加してください</p>
      </div>
    )
  }

  const remaining = todos.filter(t => !t.done).length
  // filter の二重呼び出しを避けるため減算で算出
  const doneCount = todos.length - remaining
  const allDone = remaining === 0

  return (
    <section className="list-section">
      <div className="list-header">
        <p className={`list-meta${allDone ? ' list-meta--all-done' : ''}`}>
          {doneCount} / {todos.length} 完了
        </p>
      </div>
      <ul className="list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove} />
        ))}
      </ul>
      {children}
      {doneCount > 0 && (
        <button
          className={`clear-done-btn${pendingClear ? ' clear-done-btn--pending' : ''}`}
          onClick={handleClearClick}
        >
          {pendingClear ? 'もう一度タップで削除' : '完了をクリア'}
        </button>
      )}
    </section>
  )
}
