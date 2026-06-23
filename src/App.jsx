import { useState } from 'react'
import { useTodos, parseSharedHash, MAX_TEXT_LENGTH, MAX_ITEMS, MAX_TITLE_LENGTH, DEFAULT_TITLE } from './hooks/useTodos'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import ShareButton from './components/ShareButton'
import ImportBanner from './components/ImportBanner'
import HelpModal from './components/HelpModal'
import TemplateSection from './components/TemplateSection'
import './App.css'

function App() {
  const { todos, add, addToBack, toggle, remove, importTodos, getShareUrl, clearDone, title, setTitle } = useTodos()
  const [pendingImport, setPendingImport] = useState(() => {
    const shared = parseSharedHash()
    if (shared && shared.items?.length > 0) {
      window.history.replaceState(null, '', window.location.pathname)
      return shared
    }
    return null
  })
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [isHelpOpen, setIsHelpOpen] = useState(false)

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
          // draftTitle で入力中の値を管理し、確定時（blur/Enter）のみ永続化する
          // onChange で直接 setTitle を呼ぶと空欄のたびにデフォルトタイトルが入るため
          <input
            className="title-input"
            value={draftTitle}
            onChange={e => setDraftTitle(e.target.value)}
            onBlur={() => { setTitle(draftTitle); setIsEditingTitle(false) }}
            onKeyDown={e => { if (e.key === 'Enter') { setTitle(draftTitle); setIsEditingTitle(false) } }}
            maxLength={MAX_TITLE_LENGTH}
            placeholder={DEFAULT_TITLE}
            autoFocus
          />
        ) : (
          // デフォルトタイトルの場合は空欄から入力できるよう draftTitle を '' で初期化
          <h1
            className="title"
            onClick={() => { setDraftTitle(title === DEFAULT_TITLE ? '' : title); setIsEditingTitle(true) }}
          >
            {/* デフォルト時はすみカッコで「編集可能なプレースホルダー」として表示 */}
            {title === DEFAULT_TITLE ? `[${title}]` : title}
          </h1>
        )}
        <button className="help-btn" onClick={() => setIsHelpOpen(true)} aria-label="使い方">?</button>
        <ShareButton getShareUrl={getShareUrl} disabled={todos.length === 0} />
      </header>
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
      <main className="main">
        <TodoInput onAdd={add} onAddBack={addToBack} todosCount={todos.length} maxItems={MAX_ITEMS} maxLength={MAX_TEXT_LENGTH} />
        <TodoList todos={todos} onToggle={toggle} onRemove={remove} onClearDone={clearDone} />
        {todos.length === 0 && title === DEFAULT_TITLE && (
          <TemplateSection onApply={({ title: tTitle, items }) => {
            importTodos(items.map(text => ({ text, done: false })))
            setTitle(tTitle)
          }} />
        )}
      </main>
    </div>
  )
}

export default App
