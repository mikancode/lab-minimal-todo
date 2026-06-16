import { useState } from 'react'

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onAdd(text)
    setText('')
  }

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <input
        className="input-field"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="アイテムを追加..."
        autoComplete="off"
        autoCorrect="off"
      />
      <button className="add-btn" type="submit" disabled={!text.trim()}>
        追加
      </button>
    </form>
  )
}
