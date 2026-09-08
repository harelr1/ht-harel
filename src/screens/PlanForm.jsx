import { useState } from 'preact/hooks'
import { useWorkout } from '../hooks/useWorkout'
import { navigate } from '../hooks/useHashRoute'
import BackHeader from '../components/BackHeader'

export default function PlanForm({ id }) {
  const { exercises, plans, addPlan, updatePlan } = useWorkout()
  const existing = id ? plans.find((p) => p.id === id) : null
  const [name, setName] = useState(existing?.name ?? '')
  const [selected, setSelected] = useState(existing?.exerciseIds ?? [])

  if (id && !existing) {
    return (
      <div class="screen">
        <BackHeader title="Plan" onBack={() => navigate('/workout/manage')} />
        <p class="empty-note">This plan was deleted.</p>
      </div>
    )
  }

  function toggle(exId) {
    setSelected((prev) => (prev.includes(exId) ? prev.filter((x) => x !== exId) : [...prev, exId]))
  }

  function save(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || selected.length === 0) return
    if (existing) updatePlan(existing.id, { name: trimmed, exerciseIds: selected })
    else addPlan({ name: trimmed, exerciseIds: selected })
    navigate('/workout/manage')
  }

  const canSave = name.trim().length > 0 && selected.length > 0

  return (
    <div class="screen">
      <BackHeader title={existing ? 'Edit plan' : 'New plan'} onBack={() => navigate('/workout/manage')} />

      <form class="form" onSubmit={save}>
        <label class="form__label" htmlFor="plan-name">
          Name
        </label>
        <input
          id="plan-name"
          class="form__input"
          type="text"
          placeholder="e.g. Push Day"
          value={name}
          maxLength={40}
          onInput={(e) => setName(e.currentTarget.value)}
          autoFocus
        />

        <span class="form__label">Exercises</span>
        <div class="checkbox-list">
          {exercises.map((ex) => (
            <button
              type="button"
              key={ex.id}
              class={`chip${selected.includes(ex.id) ? ' chip--active' : ''}`}
              onClick={() => toggle(ex.id)}
            >
              {ex.name}
            </button>
          ))}
        </div>

        <button type="submit" class="btn btn--primary btn--block" disabled={!canSave}>
          Save plan
        </button>
      </form>
    </div>
  )
}
