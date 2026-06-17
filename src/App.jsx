import { useState, useEffect } from 'react'
import { useTodos, parseSharedHash, MAX_TEXT_LENGTH, MAX_ITEMS, MAX_TITLE_LENGTH, DEFAULT_TITLE } from './hooks/useTodos'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import ShareButton from './components/ShareButton'
import ImportBanner from './components/ImportBanner'
import './App.css'

function App() {
  const { todos, add, addToBack, toggle, remove, importTodos, getShareUrl, clearDone, title, setTitle } = useTodos()
  const [pendingImport, setPendingImport] = useState(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  useEffect(() => {
    const shared = parseSharedHash()
    if (shared && shared.items?.length > 0) {
      setPendingImport(shared)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  function handleImport() {
    importTodos(pendingImport.items)
    if (pendingImport.title) setTitle(pendingImport.title)
    setPendingImport(null)
  }

  return (
    <div className="app">
      {pendingImport && (
        <ImportBanner
          count={pendingImport.items.length}
          onAccept={handleImport}
          onDismiss={() => setPendingImport(null)}
        />
      )}
      <header className="header">
        {isEditingTitle ? (
          <input
            className="title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={e => { if (e.key === 'Enter') setIsEditingTitle(false) }}
            maxLength={MAX_TITLE_LENGTH}
            autoFocus
          />
        ) : (
          <h1
            className={`title${title === DEFAULT_TITLE ? ' title--default' : ''}`}
            onClick={() => setIsEditingTitle(true)}
          >
            {title === DEFAULT_TITLE ? `[${title}]` : title}
          </h1>
        )}
        <ShareButton getShareUrl={getShareUrl} disabled={todos.length === 0} />
      </header>
      <main className="main">
        <TodoInput onAdd={add} onAddBack={addToBack} todosCount={todos.length} maxItems={MAX_ITEMS} maxLength={MAX_TEXT_LENGTH} />
        <TodoList todos={todos} onToggle={toggle} onRemove={remove} onClearDone={clearDone} />
      </main>
    </div>
  )
}

export default App
