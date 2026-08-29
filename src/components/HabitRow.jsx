import { navigate } from '../hooks/useHashRoute'
import { currentStreak, isDoneOn } from '../lib/streak'
import { toISODate } from '../lib/date'

export default function HabitRow({ habit, onToggle, date = toISODate() }) {
  const done = isDoneOn(habit, date)
  const streak = currentStreak(habit)

  return (
    <div class="habit-row">
      <button
        class={`habit-row__check${done ? ' habit-row__check--done' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onToggle(habit.id, date)
        }}
        aria-label={done ? `Mark ${habit.name} not done` : `Mark ${habit.name} done`}
      >
        {done && (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#04140b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        )}
      </button>

      <button class="habit-row__body" onClick={() => navigate(`/habit/${habit.id}`)}>
        <span class="habit-row__emoji">{habit.emoji}</span>
        <span class={`habit-row__name${done ? ' habit-row__name--done' : ''}`}>{habit.name}</span>
      </button>

      <div class="habit-row__streak" title="Current streak">
        <FlameIcon lit={streak > 0} />
        <span>{streak}</span>
      </div>
    </div>
  )
}

export function FlameIcon({ lit = true, size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path
        d="M12 2c1 3-3 4-3 7.5A3.5 3.5 0 0 0 12.5 13c1.5 0 2-1 1.7-2 2 1 2.8 3 2.8 4.5A5 5 0 0 1 12 20a5 5 0 0 1-5-5c0-1.6.7-2.6 1.3-3.6.4.6 1.2 1 1.9.8-1-1.2-1.2-2.6-.7-4.2C10 5.8 11.3 4 12 2Z"
        fill={lit ? 'var(--flame)' : 'none'}
        stroke={lit ? 'var(--flame)' : 'var(--text-muted)'}
        stroke-width="1.4"
        stroke-linejoin="round"
      />
    </svg>
  )
}
