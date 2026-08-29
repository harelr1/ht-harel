import { useMemo } from 'preact/hooks'
import { useHabits } from '../hooks/useHabits'
import { navigate } from '../hooks/useHashRoute'
import { toISODate, addDays, formatShortDate } from '../lib/date'
import { currentStreak, isScheduledOn, isDoneOn } from '../lib/streak'
import { FlameIcon } from '../components/HabitRow'

export default function Stats() {
  const { habits } = useHabits()
  const active = useMemo(() => habits.filter((h) => !h.archived), [habits])
  const today = toISODate()

  const todayScheduled = active.filter((h) => isScheduledOn(h, today))
  const todayDone = todayScheduled.filter((h) => isDoneOn(h, today))
  const todayPct = todayScheduled.length ? Math.round((todayDone.length / todayScheduled.length) * 100) : null

  const ranked = useMemo(
    () => active.map((h) => ({ habit: h, streak: currentStreak(h) })).sort((a, b) => b.streak - a.streak),
    [active],
  )
  const best = ranked[0]

  const week = useMemo(() => buildWeekOverview(active, today), [active, today])

  if (active.length === 0) {
    return (
      <div class="screen">
        <header class="screen__header">
          <h1>Stats</h1>
        </header>
        <div class="empty-state">
          <p>Add a habit to start seeing stats.</p>
          <button class="btn btn--primary" onClick={() => navigate('/new')}>
            + Add a habit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div class="screen">
      <header class="screen__header">
        <h1>Stats</h1>
      </header>

      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-card__value">{active.length}</span>
          <span class="stat-card__label">Active habits</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">{todayPct === null ? '—' : `${todayPct}%`}</span>
          <span class="stat-card__label">Today's completion</span>
        </div>
        <div class="stat-card">
          <FlameIcon lit={!!best && best.streak > 0} size={20} />
          <span class="stat-card__value">{best ? best.streak : 0}</span>
          <span class="stat-card__label">{best ? best.habit.name : 'Best streak'}</span>
        </div>
      </div>

      <h2 class="section-title">Last 7 days</h2>
      <div class="week-chart">
        {week.map((day) => (
          <div class="week-chart__col" key={day.date}>
            <div class="week-chart__track">
              <div class="week-chart__fill" style={{ height: `${day.pct}%` }} />
            </div>
            <span class="week-chart__label">{formatShortDate(day.date).split(' ')[1]}</span>
          </div>
        ))}
      </div>

      <h2 class="section-title">All habits</h2>
      <div class="habit-list">
        {ranked.map(({ habit, streak }) => (
          <button class="habit-row habit-row--link" key={habit.id} onClick={() => navigate(`/habit/${habit.id}`)}>
            <span class="habit-row__emoji">{habit.emoji}</span>
            <span class="habit-row__name">{habit.name}</span>
            <div class="habit-row__streak">
              <FlameIcon lit={streak > 0} />
              <span>{streak}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function buildWeekOverview(habits, today) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = addDays(today, -i)
    const scheduled = habits.filter((h) => isScheduledOn(h, date))
    const done = scheduled.filter((h) => isDoneOn(h, date))
    const pct = scheduled.length ? Math.round((done.length / scheduled.length) * 100) : 0
    days.push({ date, pct })
  }
  return days
}
