import { addDays, toISODate, dayOfWeek } from './date'

export function isScheduledOn(habit, isoDate) {
  return habit.schedule.includes(dayOfWeek(isoDate))
}

export function isDoneOn(habit, isoDate) {
  return !!habit.completions[isoDate]
}

// Streak ending today. If today is scheduled but not yet done, we don't let
// that break the streak until the day is actually over — count from yesterday.
export function currentStreak(habit, today = toISODate()) {
  let cursor = today
  if (isScheduledOn(habit, cursor) && !isDoneOn(habit, cursor)) {
    cursor = addDays(cursor, -1)
  }

  let streak = 0
  let safety = 0
  while (safety < 3660) {
    safety++
    if (isScheduledOn(habit, cursor)) {
      if (isDoneOn(habit, cursor)) {
        streak++
      } else {
        break
      }
    }
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function longestStreak(habit, today = toISODate()) {
  const completedDates = Object.keys(habit.completions).filter((d) => habit.completions[d])
  if (!completedDates.length) return 0

  let cursor = completedDates.sort()[0]
  let run = 0
  let max = 0
  while (cursor <= today) {
    if (isScheduledOn(habit, cursor)) {
      if (isDoneOn(habit, cursor)) {
        run++
        if (run > max) max = run
      } else {
        run = 0
      }
    }
    cursor = addDays(cursor, 1)
  }
  return max
}

// Fraction (0-1) of scheduled days completed over the last `days` days, or
// null if the habit wasn't scheduled at all in that window.
export function completionRate(habit, days, today = toISODate()) {
  let scheduled = 0
  let done = 0
  let cursor = today
  for (let i = 0; i < days; i++) {
    if (isScheduledOn(habit, cursor)) {
      scheduled++
      if (isDoneOn(habit, cursor)) done++
    }
    cursor = addDays(cursor, -1)
  }
  return scheduled ? done / scheduled : null
}

export function toggleCompletion(habit, isoDate) {
  const completions = { ...habit.completions }
  if (completions[isoDate]) delete completions[isoDate]
  else completions[isoDate] = true
  return { ...habit, completions }
}

export const SCHEDULE_PRESETS = {
  everyDay: [0, 1, 2, 3, 4, 5, 6],
  weekdays: [1, 2, 3, 4, 5],
  weekends: [0, 6],
}

export function matchPresetName(schedule) {
  const sorted = [...schedule].sort().join(',')
  for (const [name, days] of Object.entries(SCHEDULE_PRESETS)) {
    if ([...days].sort().join(',') === sorted) return name
  }
  return 'custom'
}
