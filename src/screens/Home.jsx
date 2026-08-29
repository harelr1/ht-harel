import { useMemo } from 'preact/hooks'
import { useHabits } from '../hooks/useHabits'
import { navigate } from '../hooks/useHashRoute'
import { toISODate, formatFriendlyDate } from '../lib/date'
import { isScheduledOn, isDoneOn } from '../lib/streak'
import HabitRow from '../components/HabitRow'
import ProgressBar from '../components/ProgressBar'

export default function Home() {
  const { habits, toggleDone } = useHabits()
  const today = toISODate()

  const todaysHabits = useMemo(
    () => habits.filter((h) => !h.archived && isScheduledOn(h, today)),
    [habits, today],
  )
  const doneCount = todaysHabits.filter((h) => isDoneOn(h, today)).length
  const hasAnyHabits = habits.some((h) => !h.archived)

  return (
    <div class="screen">
      <header class="screen__header">
        <h1>Habits</h1>
        <p class="screen__subtitle">{formatFriendlyDate(today)}</p>
      </header>

      <ProgressBar done={doneCount} total={todaysHabits.length} />

      <div class="habit-list">
        {todaysHabits.length === 0 && hasAnyHabits && (
          <p class="empty-note">Nothing scheduled for today. Enjoy the day off 🌿</p>
        )}
        {!hasAnyHabits && (
          <div class="empty-state">
            <p>No habits yet.</p>
            <button class="btn btn--primary" onClick={() => navigate('/new')}>
              + Add your first habit
            </button>
          </div>
        )}
        {todaysHabits
          .slice()
          .sort((a, b) => Number(isDoneOn(a, today)) - Number(isDoneOn(b, today)))
          .map((habit) => (
            <HabitRow key={habit.id} habit={habit} date={today} onToggle={toggleDone} />
          ))}
      </div>

      {hasAnyHabits && (
        <button class="fab" onClick={() => navigate('/new')} aria-label="Add habit">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#04140b" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
