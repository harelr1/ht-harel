import { useMemo } from 'preact/hooks'
import { addDays, toISODate, dayOfWeek, formatShortDate } from '../lib/date'
import { isScheduledOn, isDoneOn } from '../lib/streak'

const WEEKS = 14

export default function Heatmap({ habit }) {
  const weeks = useMemo(() => buildWeeks(habit), [habit])

  return (
    <div class="heatmap">
      <div class="heatmap__grid">
        {weeks.map((week, i) => (
          <div class="heatmap__week" key={i}>
            {week.map((cell) =>
              cell ? (
                <div
                  key={cell.date}
                  class={`heatmap__cell heatmap__cell--${cell.state}`}
                  title={`${formatShortDate(cell.date)}: ${cellLabel(cell.state)}`}
                />
              ) : (
                <div class="heatmap__cell heatmap__cell--empty" key={Math.random()} />
              ),
            )}
          </div>
        ))}
      </div>
      <div class="heatmap__legend">
        <span class="heatmap__cell heatmap__cell--missed" /> Missed
        <span class="heatmap__cell heatmap__cell--unscheduled" /> Off day
        <span class="heatmap__cell heatmap__cell--done" /> Done
      </div>
    </div>
  )
}

function cellLabel(state) {
  if (state === 'done') return 'done'
  if (state === 'missed') return 'missed'
  if (state === 'today') return 'not done yet'
  if (state === 'future') return 'upcoming'
  return 'not scheduled'
}

function buildWeeks(habit) {
  const today = toISODate()
  const totalDays = WEEKS * 7
  const start = addDays(today, -(totalDays - 1))
  const startOffset = dayOfWeek(start)

  const days = []
  for (let i = 0; i < startOffset; i++) days.push(null)

  let cursor = start
  while (cursor <= today) {
    let state
    if (cursor > today) state = 'future'
    else if (!isScheduledOn(habit, cursor)) state = 'unscheduled'
    else if (isDoneOn(habit, cursor)) state = 'done'
    else state = cursor === today ? 'today' : 'missed'
    days.push({ date: cursor, state })
    cursor = addDays(cursor, 1)
  }

  while (days.length % 7 !== 0) days.push(null)

  const weeks = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
  return weeks
}
