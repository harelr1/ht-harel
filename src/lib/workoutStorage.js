const WORKOUT_KEY = 'habit-tracker:workout:v1'

const EMPTY = { exercises: [], plans: [], sessions: [] }

export function loadWorkout() {
  try {
    const raw = localStorage.getItem(WORKOUT_KEY)
    if (!raw) return { ...EMPTY }
    return { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    return { ...EMPTY }
  }
}

export function saveWorkout(data) {
  localStorage.setItem(WORKOUT_KEY, JSON.stringify(data))
}
