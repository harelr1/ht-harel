import { useState } from 'preact/hooks'
import { useTasks } from '../hooks/useTasks'
import { navigate } from '../hooks/useHashRoute'
import { quadrantLabel } from '../lib/tasks'
import BackHeader from '../components/BackHeader'

export default function AddTask() {
  const { addTask } = useTasks()
  const [title, setTitle] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [important, setImportant] = useState(false)

  function save(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    addTask({ title: trimmed, urgent, important })
    navigate('/tasks')
  }

  return (
    <div class="screen">
      <BackHeader title="New task" onBack={() => navigate('/tasks')} />

      <form class="form" onSubmit={save}>
        <label class="form__label" htmlFor="task-title">
          Title
        </label>
        <input
          id="task-title"
          class="form__input"
          type="text"
          placeholder="e.g. Reply to landlord"
          value={title}
          maxLength={80}
          onInput={(e) => setTitle(e.currentTarget.value)}
          autoFocus
        />

        <span class="form__label">Priority</span>
        <div class="toggle-row">
          <button type="button" class={`chip${urgent ? ' chip--active' : ''}`} onClick={() => setUrgent((v) => !v)}>
            Urgent
          </button>
          <button
            type="button"
            class={`chip${important ? ' chip--active' : ''}`}
            onClick={() => setImportant((v) => !v)}
          >
            Important
          </button>
        </div>
        <p class="form__hint">→ {quadrantLabel(urgent, important)}</p>

        <button type="submit" class="btn btn--primary btn--block" disabled={!title.trim()}>
          Save task
        </button>
      </form>
    </div>
  )
}
