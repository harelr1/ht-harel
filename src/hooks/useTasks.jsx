import { createContext } from 'preact'
import { useContext, useEffect, useState, useMemo, useCallback } from 'preact/hooks'
import { loadTasks, saveTasks } from '../lib/taskStorage'

const TasksContext = createContext(null)

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(loadTasks)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((task) => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        done: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        ...task,
      },
    ])
  }, [])

  const updateTask = useCallback((id, changes) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  }, [])

  const toggleDone = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const done = !t.done
        return { ...t, done, completedAt: done ? new Date().toISOString() : null }
      }),
    )
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.done))
  }, [])

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, toggleDone, deleteTask, clearCompleted }),
    [tasks, addTask, updateTask, toggleDone, deleteTask, clearCompleted],
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within TasksProvider')
  return ctx
}
