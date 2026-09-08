import { useState } from 'preact/hooks'
import { useTasks } from '../hooks/useTasks'
import { navigate } from '../hooks/useHashRoute'
import { quadrantLabel } from '../lib/tasks'
import BackHeader from '../components/BackHeader'
import ConfirmDialog from '../components/ConfirmDialog'

export default function TaskDetail({ id }) {
  const { tasks, updateTask, deleteTask } = useTasks()
  const task = tasks.find((t) => t.id === id)
  const [title, setTitle] = useState(task?.title ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!task) {
    return (
      <div class="screen">
        <BackHeader title="Task" onBack={() => navigate('/tasks')} />
        <p class="empty-note">This task was deleted.</p>
      </div>
    )
  }

  function save() {
    const trimmed = title.trim()
    if (trimmed) updateTask(task.id, { title: trimmed })
    navigate('/tasks')
  }

  return (
    <div class="screen">
      <BackHeader
        title="Edit task"
        onBack={() => navigate('/tasks')}
        action={
          <button class="link-btn" onClick={save}>
            Done
          </button>
        }
      />

      <div class="form">
        <label class="form__label" htmlFor="edit-task-title">
          Title
        </label>
        <input
          id="edit-task-title"
          class="form__input"
          type="text"
          value={title}
          maxLength={80}
          onInput={(e) => setTitle(e.currentTarget.value)}
        />

        <span class="form__label">Priority</span>
        <div class="toggle-row">
          <button
            type="button"
            class={`chip${task.urgent ? ' chip--active' : ''}`}
            onClick={() => updateTask(task.id, { urgent: !task.urgent })}
          >
            Urgent
          </button>
          <button
            type="button"
            class={`chip${task.important ? ' chip--active' : ''}`}
            onClick={() => updateTask(task.id, { important: !task.important })}
          >
            Important
          </button>
        </div>
        <p class="form__hint">→ {quadrantLabel(task.urgent, task.important)}</p>

        <button class="btn btn--danger btn--block" onClick={() => setConfirmDelete(true)}>
          Delete task
        </button>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this task?"
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            deleteTask(task.id)
            navigate('/tasks')
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}
