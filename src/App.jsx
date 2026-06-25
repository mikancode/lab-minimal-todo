import { useState } from 'react'
import { useTodos, parseSharedHash, readStorage, MAX_TEXT_LENGTH, MAX_ITEMS, MAX_TITLE_LENGTH, DEFAULT_TITLE } from './hooks/useTodos'
import AddItemButton from './components/AddItemButton'
import TodoList from './components/TodoList'
import ShareButton from './components/ShareButton'
import ImportBanner from './components/ImportBanner'
import HelpModal from './components/HelpModal'
import TemplateSection from './components/TemplateSection'
import UndoToast from './components/UndoToast'
import './App.css'

function App() {
  // 共有URLの解析とストレージ確認を初期化時に一括実施
  // 空リスト時はバナー不要のため seed として useTodos に渡し、pendingImport は null にする
  const [{ seed, pendingImportInit }] = useState(() => {
    const shared = parseSharedHash()
    if (!shared?.items?.length) return { seed: null, pendingImportInit: null }
    window.history.replaceState(null, '', window.location.pathname)
    if (readStorage().length === 0) return { seed: shared, pendingImportInit: null }
    return { seed: null, pendingImportInit: shared }
  })

  const { todos, add, addToBack, toggle, remove, undoRemove, commitRemove, removedItem, update, importTodos, appendTodos, getShareUrl, clearDone, title, setTitle, sortDone, setSortDone } = useTodos(seed)
  const [pendingImport, setPendingImport] = useState(pendingImportInit)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  function handleReplace() {
    importTodos(pendingImport.items)
    if (pendingImport.title) setTitle(pendingImport.title)
    setPendingImport(null)
  }

  function handleAppend() {
    appendTodos(pendingImport.items)
    setPendingImport(null)
  }

  return (
    <div className="app">
      {pendingImport && (
        <ImportBanner
          count={pendingImport.items.length}
          onAppend={handleAppend}
          onReplace={handleReplace}
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
        <ShareButton getShareUrl={getShareUrl} title={title} />
      </header>
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
      <main className="main">
        <TodoList
          todos={todos}
          onToggle={toggle}
          onRemove={remove}
          onUpdate={update}
          onClearDone={clearDone}
          sortDone={sortDone}
          onSortDoneToggle={() => setSortDone(!sortDone)}
          topSlot={<AddItemButton onAdd={add} label="＋ 先頭に追加" todosCount={todos.length} maxItems={MAX_ITEMS} maxLength={MAX_TEXT_LENGTH} />}
        >
          <AddItemButton onAdd={addToBack} label="＋ 末尾に追加" todosCount={todos.length} maxItems={MAX_ITEMS} maxLength={MAX_TEXT_LENGTH} />
        </TodoList>
        {todos.length === 0 && title === DEFAULT_TITLE && (
          <TemplateSection onApply={({ title: tTitle, items }) => {
            importTodos(items.map(text => ({ text, done: false })))
            setTitle(tTitle)
          }} />
        )}
      </main>
      {removedItem && (
        <UndoToast
          item={removedItem}
          onUndo={undoRemove}
          onDismiss={commitRemove}
        />
      )}
    </div>
  )
}

export default App
