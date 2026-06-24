import { useState, useEffect } from 'react'
import LZString from 'lz-string'

const STORAGE_KEY = 'todos'

function readStorage() {
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

function readTitle() {
  return localStorage.getItem(TITLE_KEY) ?? DEFAULT_TITLE
}

export function useTodos() {
  // 関数参照を渡すことでマウント時のみ localStorage を読む（遅延初期化）
  const [todos, setTodos] = useState(readStorage)
  const [title, setTitleState] = useState(readTitle)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem(TITLE_KEY, title)
  }, [title])

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
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function remove(id) {
    setTodos(prev => prev.filter(t => t.id !== id))
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

  return { todos, add, addToBack, toggle, remove, importTodos, getShareUrl, clearDone, title, setTitle }
}
