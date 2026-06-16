export default function TodoItem({ todo, onToggle, onRemove }) {
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
      <span className="item-text">{todo.text}</span>
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
