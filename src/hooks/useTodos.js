import { useState, useEffect } from 'react'
import LZString from 'lz-string'

const STORAGE_KEY = 'todos'

export function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function parseSharedHash() {
  const hash = window.location.hash
  // l= がなければ共有URLではない
  const listMatch = hash.match(/[#&]l=([^&]+)/)
  if (!listMatch) return null
  // t= はオプション（タイトルなしでも共有可）
  const titleMatch = hash.match(/[#&]t=([^&]+)/)
  try {
    const title = titleMatch ? LZString.decompressFromEncodedURIComponent(titleMatch[1]) : null
    const items = JSON.parse(LZString.decompressFromEncodedURIComponent(listMatch[1]))
    if (!Array.isArray(items)) return null
    return { title, items }
  } catch {
    return null
  }
}

export const MAX_TEXT_LENGTH = 50
export const MAX_ITEMS = 50
export const MAX_TITLE_LENGTH = 30
export const DEFAULT_TITLE = 'みにまリスト'

const TITLE_KEY = 'listTitle'
const SORT_DONE_KEY = 'sortDone'

function readTitle() {
  return localStorage.getItem(TITLE_KEY) ?? DEFAULT_TITLE
}

function readSortDone() {
  return localStorage.getItem(SORT_DONE_KEY) === 'true'
}

export function useTodos(seed = null) {
  const [todos, setTodos] = useState(() => {
    const stored = readStorage()
    // ストレージが空のときだけシードデータで初期化（空リスト時の即インポート）
    if (seed && stored.length === 0) {
      return seed.items.map(item => ({
        id: crypto.randomUUID(),
        text: item.text,
        done: item.done ?? false,
        createdAt: Date.now(),
      }))
    }
    return stored
  })
  // seed が渡されるのはストレージが空のときだけなので、title もシードを優先する
  const [title, setTitleState] = useState(() => seed?.title ?? readTitle())
  const [sortDone, setSortDoneState] = useState(readSortDone)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem(TITLE_KEY, title)
  }, [title])

  useEffect(() => {
    localStorage.setItem(SORT_DONE_KEY, sortDone)
  }, [sortDone])

  function setTitle(value) {
    // 空文字でblurした場合はデフォルトに戻す
    const trimmed = value.trim() || DEFAULT_TITLE
    setTitleState(trimmed.slice(0, MAX_TITLE_LENGTH))
  }

  function add(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    if (trimmed.length > MAX_TEXT_LENGTH) return
    if (todos.length >= MAX_ITEMS) return
    setTodos(prev => [{
      id: crypto.randomUUID(),
      text: trimmed,
      done: false,
      createdAt: Date.now(),
    }, ...prev])
  }

  function addToBack(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    if (trimmed.length > MAX_TEXT_LENGTH) return
    if (todos.length >= MAX_ITEMS) return
    setTodos(prev => [...prev, {
      id: crypto.randomUUID(),
      text: trimmed,
      done: false,
      createdAt: Date.now(),
    }])
  }

  function toggle(id) {
    const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTodos(updated)
    if (!sortDone) return
    // 取り消し線アニメーション（0.35s）完走後に末尾移動
    setTimeout(() => {
      setTodos(prev => [
        ...prev.filter(t => !t.done),
        ...prev.filter(t => t.done),
      ])
    }, 400)
  }

  function toggleSortDone() {
    const next = !sortDone
    setSortDoneState(next)
    if (next) {
      // ON に切り替えた瞬間に既存の完了アイテムも末尾へ
      setTodos(prev => [
        ...prev.filter(t => !t.done),
        ...prev.filter(t => t.done),
      ])
    }
  }

  const [removedItem, setRemovedItem] = useState(null) // { item, index }

  function remove(id) {
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) return
    setRemovedItem({ item: todos[index], index })
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function undoRemove() {
    if (!removedItem) return
    setTodos(prev => {
      const next = [...prev]
      next.splice(Math.min(removedItem.index, prev.length), 0, removedItem.item)
      return next
    })
    setRemovedItem(null)
  }

  function commitRemove() {
    setRemovedItem(null)
  }

  function update(id, newText) {
    const trimmed = newText.trim()
    if (!trimmed || trimmed.length > MAX_TEXT_LENGTH) return
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: trimmed } : t))
  }

  function importTodos(items) {
    // 共有元と ID が衝突しないよう新規 ID を振り直す
    setTodos(items.map(item => ({
      id: crypto.randomUUID(),
      text: item.text,
      done: item.done ?? false,
      createdAt: Date.now(),
    })))
  }

  function appendTodos(items) {
    // 既存アイテムを保持しつつ末尾に結合、上限を超える分はカット
    setTodos(prev => {
      const newItems = items.map(item => ({
        id: crypto.randomUUID(),
        text: item.text,
        done: item.done ?? false,
        createdAt: Date.now(),
      }))
      return [...prev, ...newItems].slice(0, MAX_ITEMS)
    })
  }

  function clearDone() {
    setTodos(prev => prev.filter(t => !t.done))
  }

  function getShareUrl() {
    const base = `${window.location.origin}${window.location.pathname}`
    // 空リストはアプリ自体のURLを共有
    if (todos.length === 0) return base
    // id・createdAt はデバイス固有のため共有データには含めない
    const data = todos.map(({ text, done }) => ({ text, done }))
    const encoded = LZString.compressToEncodedURIComponent(JSON.stringify(data))
    // URL形式: #t=<LZString圧縮タイトル>&l=リスト。デフォルトタイトルは含めない
    if (title === DEFAULT_TITLE) return `${base}#l=${encoded}`
    return `${base}#t=${LZString.compressToEncodedURIComponent(title)}&l=${encoded}`
  }

  return { todos, add, addToBack, toggle, remove, undoRemove, commitRemove, removedItem, update, importTodos, appendTodos, getShareUrl, clearDone, title, setTitle, sortDone, toggleSortDone }
}
