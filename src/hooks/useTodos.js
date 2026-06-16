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
  const match = window.location.hash.match(/^#share=(.+)/)
  if (!match) return null
  try {
    return JSON.parse(LZString.decompressFromEncodedURIComponent(match[1]))
  } catch {
    return null
  }
}

export const MAX_TEXT_LENGTH = 50
export const MAX_ITEMS = 50

export function useTodos() {
  const [todos, setTodos] = useState(readStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

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
    setTodos(items.map(item => ({
      id: crypto.randomUUID(),
      text: item.text,
      done: item.done ?? false,
      createdAt: Date.now(),
    })))
  }

  function getShareUrl() {
    const data = todos.map(({ text, done }) => ({ text, done }))
    const encoded = LZString.compressToEncodedURIComponent(JSON.stringify(data))
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`
  }

  return { todos, add, addToBack, toggle, remove, importTodos, getShareUrl }
}
