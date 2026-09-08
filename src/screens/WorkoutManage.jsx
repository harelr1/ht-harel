import { useState } from 'preact/hooks'
import { useWorkout } from '../hooks/useWorkout'
import { navigate } from '../hooks/useHashRoute'
import BackHeader from '../components/BackHeader'
import ConfirmDialog from '../components/ConfirmDialog'

export default function WorkoutManage() {
  const { exercises, plans, addExercise, deleteExercise, deletePlan } = useWorkout()
  const [name, setName] = useState('')
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState(null)
  const [confirmDeletePlan, setConfirmDeletePlan] = useState(null)

  function submit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    addExercise(trimmed)
    setName('')
  }

  return (
    <div class="screen">
      <BackHeader title="Manage" onBack={() => navigate('/workout')} />

      <h2 class="section-title">Exercises</h2>
      <form class="inline-add" onSubmit={submit}>
        <input
          class="form__input"
          type="text"
          placeholder="e.g. Bench Press"
          value={name}
          maxLength={40}
          onInput={(e) => setName(e.currentTarget.value)}
        />
        <button type="submit" class="btn btn--primary" disabled={!name.trim()}>
          Add
        </button>
      </form>
      <div class="habit-list">
        {exercises.length === 0 && <p class="empty-note">No exercises yet.</p>}
        {exercises.map((ex) => (
          <div class="manage-row" key={ex.id}>
            <span class="manage-row__name">{ex.name}</span>
            <div class="manage-row__actions">
              <button
                class="icon-btn icon-btn--danger"
                onClick={() => setConfirmDeleteExercise(ex.id)}
                aria-label={`Delete ${ex.name}`}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 class="section-title">Plans</h2>
      <div class="habit-list">
        {plans.length === 0 && <p class="empty-note">No plans yet.</p>}
        {plans.map((plan) => (
          <div class="manage-row" key={plan.id}>
            <button class="manage-row__name" onClick={() => navigate(`/workout/plan/${plan.id}`)}>
              {plan.name}
            </button>
            <div class="manage-row__actions">
              <button
                class="icon-btn icon-btn--danger"
                onClick={() => setConfirmDeletePlan(plan.id)}
                aria-label={`Delete ${plan.name}`}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        class="btn btn--secondary btn--block"
        onClick={() => navigate('/workout/plan/new')}
        disabled={exercises.length === 0}
      >
        + New plan
      </button>

      {confirmDeleteExercise && (
        <ConfirmDialog
          title="Delete this exercise?"
          message="Past workout history stays intact, but you won't be able to log it again unless you re-add it."
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            deleteExercise(confirmDeleteExercise)
            setConfirmDeleteExercise(null)
          }}
          onCancel={() => setConfirmDeleteExercise(null)}
        />
      )}
      {confirmDeletePlan && (
        <ConfirmDialog
          title="Delete this plan?"
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            deletePlan(confirmDeletePlan)
            setConfirmDeletePlan(null)
          }}
          onCancel={() => setConfirmDeletePlan(null)}
        />
      )}
    </div>
  )
}
