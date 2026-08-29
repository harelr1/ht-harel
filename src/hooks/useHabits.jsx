import { createContext } from 'preact'
import { useContext, useEffect, useState, useMemo, useCallback } from 'preact/hooks'
import { loadHabits, saveHabits } from '../lib/storage'
import { toggleCompletion } from '../lib/streak'

const HabitsContext = createContext(null)

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState(loadHabits)

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  const addHabit = useCallback((habit) => {
    setHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        completions: {},
        archived: false,
        createdAt: new Date().toISOString(),
        ...habit,
      },
    ])
  }, [])

  const updateHabit = useCallback((id, changes) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...changes } : h)))
  }, [])

  const toggleDone = useCallback((id, isoDate) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? toggleCompletion(h, isoDate) : h)))
  }, [])

  const archiveHabit = useCallback((id, archived = true) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, archived } : h)))
  }, [])

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const reorderHabits = useCallback((orderedIds) => {
    setHabits((prev) => {
      const byId = new Map(prev.map((h) => [h.id, h]))
      return orderedIds.map((id) => byId.get(id)).filter(Boolean)
    })
  }, [])

  const replaceAll = useCallback((next) => {
    setHabits(next)
  }, [])

  const value = useMemo(
    () => ({
      habits,
      addHabit,
      updateHabit,
      toggleDone,
      archiveHabit,
      deleteHabit,
      reorderHabits,
      replaceAll,
    }),
    [habits, addHabit, updateHabit, toggleDone, archiveHabit, deleteHabit, reorderHabits, replaceAll],
  )

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
}

export function useHabits() {
  const ctx = useContext(HabitsContext)
  if (!ctx) throw new Error('useHabits must be used within HabitsProvider')
  return ctx
}
