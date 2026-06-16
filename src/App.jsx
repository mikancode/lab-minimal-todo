import { useState, useEffect } from 'react'
import { useTodos, parseSharedHash } from './hooks/useTodos'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import ShareButton from './components/ShareButton'
import ImportBanner from './components/ImportBanner'
import './App.css'

function App() {
  const { todos, add, toggle, remove, importTodos, getShareUrl } = useTodos()
  const [pendingImport, setPendingImport] = useState(null)

  useEffect(() => {
    const shared = parseSharedHash()
    if (shared && shared.length > 0) {
      setPendingImport(shared)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  function handleImport() {
    importTodos(pendingImport)
    setPendingImport(null)
  }

  return (
    <div className="app">
      {pendingImport && (
        <ImportBanner
          count={pendingImport.length}
          onAccept={handleImport}
          onDismiss={() => setPendingImport(null)}
        />
      )}
      <header className="header">
        <h1 className="title">My List</h1>
        <ShareButton getShareUrl={getShareUrl} disabled={todos.length === 0} />
      </header>
      <main className="main">
        <TodoInput onAdd={add} />
        <TodoList todos={todos} onToggle={toggle} onRemove={remove} />
      </main>
    </div>
  )
}

export default App
