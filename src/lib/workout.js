// Finds the most recent set of results logged for an exercise, excluding the
// current session, so a session in progress can show "last time" hints.
export function previousPerformance(sessions, currentSessionId, exerciseId) {
  const candidates = sessions
    .filter((s) => s.id !== currentSessionId)
    .filter((s) => s.entries.some((e) => e.exerciseId === exerciseId))
    .sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt))

  if (!candidates.length) return null
  const entry = candidates[0].entries.find((e) => e.exerciseId === exerciseId)
  return { date: candidates[0].date, sets: entry.sets }
}

export function formatSet(set) {
  if (!set) return null
  return `${set.weight}kg × ${set.reps}`
}

// Sensible starting values for a new set: repeat the last set logged today
// for this exercise, or fall back to the first set from last time.
export function defaultNextSet(entry, previous) {
  if (entry.sets.length > 0) {
    const last = entry.sets[entry.sets.length - 1]
    return { weight: last.weight, reps: last.reps }
  }
  if (previous?.sets?.length) {
    const first = previous.sets[0]
    return { weight: first.weight, reps: first.reps }
  }
  return { weight: 0, reps: 0 }
}
