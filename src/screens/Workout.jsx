import { useMemo } from 'preact/hooks'
import { useWorkout } from '../hooks/useWorkout'
import { navigate } from '../hooks/useHashRoute'
import { formatFriendlyDate } from '../lib/date'

export default function Workout() {
  const { exercises, plans, sessions, startSession } = useWorkout()

  const history = useMemo(
    () => [...sessions].sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt)),
    [sessions],
  )

  function start(planId) {
    const id = startSession(planId ?? null)
    navigate(`/workout/session/${id}`)
  }

  return (
    <div class="screen">
      <header class="screen__header">
        <h1>Workout</h1>
      </header>

      {exercises.length === 0 ? (
        <div class="empty-state">
          <p>Add some exercises first to start logging workouts.</p>
          <button class="btn btn--primary" onClick={() => navigate('/workout/manage')}>
            + Set up exercises
          </button>
        </div>
      ) : (
        <>
          <h2 class="section-title">Start a workout</h2>
          <div class="workout-start-list">
            <button class="workout-start-card" onClick={() => start(null)}>
              <span class="workout-start-card__title">Freestyle</span>
              <span class="workout-start-card__sub">Log exercises as you go</span>
            </button>
            {plans.map((plan) => (
              <button class="workout-start-card" key={plan.id} onClick={() => start(plan.id)}>
                <span class="workout-start-card__title">{plan.name}</span>
                <span class="workout-start-card__sub">{plan.exerciseIds.length} exercises</span>
              </button>
            ))}
          </div>

          <button class="link-btn" onClick={() => navigate('/workout/manage')}>
            Manage exercises &amp; plans
          </button>

          <h2 class="section-title">History</h2>
          {history.length === 0 ? (
            <p class="empty-note">No workouts logged yet.</p>
          ) : (
            <div class="habit-list">
              {history.map((s) => (
                <button class="session-row" key={s.id} onClick={() => navigate(`/workout/session/${s.id}`)}>
                  <span class="session-row__date">{formatFriendlyDate(s.date)}</span>
                  <span class="session-row__meta">
                    {s.planName ?? 'Freestyle'} · {s.entries.length} exercise{s.entries.length === 1 ? '' : 's'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
