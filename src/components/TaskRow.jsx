import { useState } from 'preact/hooks'
import { navigate } from '../hooks/useHashRoute'

export default function TaskRow({ task, onToggle }) {
  const [justCompleted, setJustCompleted] = useState(false)

  function handleToggle(e) {
    e.stopPropagation()
    if (!task.done) {
      setJustCompleted(true)
      setTimeout(() => setJustCompleted(false), 450)
    }
    onToggle(task.id)
  }

  return (
    <div class="task-row">
      <button
        class={`habit-row__check${task.done ? ' habit-row__check--done' : ''}${justCompleted ? ' habit-row__check--pop' : ''}`}
        onClick={handleToggle}
        aria-label={task.done ? `Mark ${task.title} not done` : `Mark ${task.title} done`}
      >
        {task.done && (
          <svg class="habit-row__check-icon" viewBox="0 0 24 24" width="14" height="14" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#04140b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        )}
      </button>

      <button
        class={`task-row__title${task.done ? ' task-row__title--done' : ''}`}
        onClick={() => navigate(`/tasks/${task.id}`)}
      >
        {task.title}
      </button>
    </div>
  )
}
