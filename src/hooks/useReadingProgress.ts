import { useEffect, useState } from 'react'
import { loadProgress, makeBackup, STORAGE_KEY } from './progressStorage'

export function useReadingProgress() {
  const [completed, setCompleted] = useState<Set<string>>(loadProgress)
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(makeBackup(completed)))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [completed])

  function toggle(id: string) {
    setCompleted((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return { completed, setCompleted, toggle, storageError }
}
