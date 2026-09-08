import { useState } from 'preact/hooks'
import { useWorkout } from '../hooks/useWorkout'
import { navigate } from '../hooks/useHashRoute'
import { formatFriendlyDate } from '../lib/date'
import { previousPerformance, defaultNextSet, formatSet } from '../lib/workout'
import BackHeader from '../components/BackHeader'
import ConfirmDialog from '../components/ConfirmDialog'

export default function SessionEditor({ id }) {
  const {
    sessions,
    exercises,
    addSet,
    updateSet,
    removeSet,
    addExerciseToSession,
    removeExerciseFromSession,
    deleteSession,
  } = useWorkout()
  const session = sessions.find((s) => s.id === id)
  const [showPicker, setShowPicker] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!session) {
    return (
      <div class="screen">
        <BackHeader title="Workout" onBack={() => navigate('/workout')} />
        <p class="empty-note">This workout was deleted.</p>
      </div>
    )
  }

  const availableExercises = exercises.filter((ex) => !session.entries.some((e) => e.exerciseId === ex.id))

  return (
    <div class="screen">
      <BackHeader
        title={formatFriendlyDate(session.date)}
        onBack={() => navigate('/workout')}
        action={
          <button class="link-btn link-btn--danger" onClick={() => setConfirmDelete(true)}>
            Delete
          </button>
        }
      />
      {session.planName && <p class="screen__subtitle">{session.planName}</p>}

      {session.entries.length === 0 && <p class="empty-note">No exercises yet. Add one below.</p>}

      {session.entries.map((entry) => {
        const previous = previousPerformance(sessions, session.id, entry.exerciseId)
        return (
          <div class="exercise-card" key={entry.exerciseId}>
            <div class="exercise-card__header">
              <span class="exercise-card__name">{entry.exerciseName}</span>
              <button
                class="icon-btn icon-btn--danger"
                onClick={() => removeExerciseFromSession(session.id, entry.exerciseId)}
                aria-label={`Remove ${entry.exerciseName}`}
              >
                ✕
              </button>
            </div>

            {entry.sets.map((set, i) => {
              const prevSet = previous?.sets?.[i]
              return (
                <div class="set-row" key={i}>
                  <div class="set-row__main">
                    <span class="set-row__index">{i + 1}</span>
                    <input
                      class="set-row__input"
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      value={set.weight}
                      onInput={(e) =>
                        updateSet(session.id, entry.exerciseId, i, { weight: Number(e.currentTarget.value) })
                      }
                    />
                    <span class="set-row__unit">kg</span>
                    <span class="set-row__x">×</span>
                    <input
                      class="set-row__input"
                      type="number"
                      inputMode="numeric"
                      step="1"
                      value={set.reps}
                      onInput={(e) =>
                        updateSet(session.id, entry.exerciseId, i, { reps: Number(e.currentTarget.value) })
                      }
                    />
                    <span class="set-row__unit">reps</span>
                    <button
                      class="icon-btn"
                      onClick={() => removeSet(session.id, entry.exerciseId, i)}
                      aria-label="Remove set"
                    >
                      ×
                    </button>
                  </div>
                  {prevSet && <span class="set-row__prev">Last time: {formatSet(prevSet)}</span>}
                </div>
              )
            })}

            <button
              type="button"
              class="chip chip--add-set"
              onClick={() => addSet(session.id, entry.exerciseId, defaultNextSet(entry, previous))}
            >
              + Add set
            </button>
          </div>
        )
      })}

      {availableExercises.length > 0 && (
        <div class="add-exercise">
          {showPicker ? (
            <div class="add-exercise__picker">
              {availableExercises.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  class="chip"
                  onClick={() => {
                    addExerciseToSession(session.id, ex.id)
                    setShowPicker(false)
                  }}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          ) : (
            <button class="btn btn--secondary btn--block" onClick={() => setShowPicker(true)}>
              + Add exercise
            </button>
          )}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this workout?"
          message="This removes the whole session and its logged sets."
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            deleteSession(session.id)
            navigate('/workout')
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}
