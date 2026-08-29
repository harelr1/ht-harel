const HABITS_KEY = 'habit-tracker:habits:v1'

export function loadHabits() {
  try {
    const raw = localStorage.getItem(HABITS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

export function exportData() {
  return JSON.stringify({ version: 1, habits: loadHabits() }, null, 2)
}

export function importData(json) {
  const parsed = JSON.parse(json)
  const habits = Array.isArray(parsed) ? parsed : parsed.habits
  if (!Array.isArray(habits)) throw new Error('Invalid backup file')
  saveHabits(habits)
  return habits
}
