import { createContext } from 'preact'
import { useContext, useEffect, useState, useMemo, useCallback } from 'preact/hooks'
import { loadWorkout, saveWorkout } from '../lib/workoutStorage'
import { toISODate } from '../lib/date'

const WorkoutContext = createContext(null)

export function WorkoutProvider({ children }) {
  const [data, setData] = useState(loadWorkout)

  useEffect(() => {
    saveWorkout(data)
  }, [data])

  const addExercise = useCallback((name) => {
    const exercise = { id: crypto.randomUUID(), name }
    setData((d) => ({ ...d, exercises: [...d.exercises, exercise] }))
    return exercise.id
  }, [])

  const deleteExercise = useCallback((id) => {
    setData((d) => ({ ...d, exercises: d.exercises.filter((e) => e.id !== id) }))
  }, [])

  const addPlan = useCallback((plan) => {
    const newPlan = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...plan }
    setData((d) => ({ ...d, plans: [...d.plans, newPlan] }))
    return newPlan.id
  }, [])

  const updatePlan = useCallback((id, changes) => {
    setData((d) => ({ ...d, plans: d.plans.map((p) => (p.id === id ? { ...p, ...changes } : p)) }))
  }, [])

  const deletePlan = useCallback((id) => {
    setData((d) => ({ ...d, plans: d.plans.filter((p) => p.id !== id) }))
  }, [])

  const startSession = useCallback((planId) => {
    const id = crypto.randomUUID()
    setData((d) => {
      const plan = planId ? d.plans.find((p) => p.id === planId) : null
      const entries = plan
        ? plan.exerciseIds
            .map((exId) => d.exercises.find((e) => e.id === exId))
            .filter(Boolean)
            .map((ex) => ({ exerciseId: ex.id, exerciseName: ex.name, sets: [] }))
        : []
      const session = {
        id,
        date: toISODate(),
        planId: plan?.id ?? null,
        planName: plan?.name ?? null,
        entries,
        createdAt: new Date().toISOString(),
      }
      return { ...d, sessions: [...d.sessions, session] }
    })
    return id
  }, [])

  const addExerciseToSession = useCallback((sessionId, exerciseId) => {
    setData((d) => {
      const exercise = d.exercises.find((e) => e.id === exerciseId)
      if (!exercise) return d
      return {
        ...d,
        sessions: d.sessions.map((s) => {
          if (s.id !== sessionId) return s
          if (s.entries.some((e) => e.exerciseId === exerciseId)) return s
          return { ...s, entries: [...s.entries, { exerciseId, exerciseName: exercise.name, sets: [] }] }
        }),
      }
    })
  }, [])

  const removeExerciseFromSession = useCallback((sessionId, exerciseId) => {
    setData((d) => ({
      ...d,
      sessions: d.sessions.map((s) =>
        s.id === sessionId ? { ...s, entries: s.entries.filter((e) => e.exerciseId !== exerciseId) } : s,
      ),
    }))
  }, [])

  const addSet = useCallback((sessionId, exerciseId, set) => {
    setData((d) => ({
      ...d,
      sessions: d.sessions.map((s) => {
        if (s.id !== sessionId) return s
        return {
          ...s,
          entries: s.entries.map((e) => (e.exerciseId === exerciseId ? { ...e, sets: [...e.sets, set] } : e)),
        }
      }),
    }))
  }, [])

  const updateSet = useCallback((sessionId, exerciseId, index, changes) => {
    setData((d) => ({
      ...d,
      sessions: d.sessions.map((s) => {
        if (s.id !== sessionId) return s
        return {
          ...s,
          entries: s.entries.map((e) =>
            e.exerciseId === exerciseId
              ? { ...e, sets: e.sets.map((set, i) => (i === index ? { ...set, ...changes } : set)) }
              : e,
          ),
        }
      }),
    }))
  }, [])

  const removeSet = useCallback((sessionId, exerciseId, index) => {
    setData((d) => ({
      ...d,
      sessions: d.sessions.map((s) => {
        if (s.id !== sessionId) return s
        return {
          ...s,
          entries: s.entries.map((e) =>
            e.exerciseId === exerciseId ? { ...e, sets: e.sets.filter((_, i) => i !== index) } : e,
          ),
        }
      }),
    }))
  }, [])

  const deleteSession = useCallback((id) => {
    setData((d) => ({ ...d, sessions: d.sessions.filter((s) => s.id !== id) }))
  }, [])

  const value = useMemo(
    () => ({
      ...data,
      addExercise,
      deleteExercise,
      addPlan,
      updatePlan,
      deletePlan,
      startSession,
      addExerciseToSession,
      removeExerciseFromSession,
      addSet,
      updateSet,
      removeSet,
      deleteSession,
    }),
    [
      data,
      addExercise,
      deleteExercise,
      addPlan,
      updatePlan,
      deletePlan,
      startSession,
      addExerciseToSession,
      removeExerciseFromSession,
      addSet,
      updateSet,
      removeSet,
      deleteSession,
    ],
  )

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext)
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider')
  return ctx
}
