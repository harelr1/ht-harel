import { useMemo, useState } from 'preact/hooks'
import { useTasks } from '../hooks/useTasks'
import { navigate } from '../hooks/useHashRoute'
import { QUADRANTS, quadrantOf } from '../lib/tasks'
import QuadrantSection from '../components/QuadrantSection'
import TaskRow from '../components/TaskRow'

export default function Tasks() {
  const { tasks, toggleDone, clearCompleted } = useTasks()
  const [showCompleted, setShowCompleted] = useState(false)

  const active = useMemo(() => tasks.filter((t) => !t.done), [tasks])
  const completed = useMemo(
    () => tasks.filter((t) => t.done).sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || '')),
    [tasks],
  )

  const grouped = useMemo(() => {
    const map = { doFirst: [], schedule: [], quick: [], someday: [] }
    for (const t of active) map[quadrantOf(t)].push(t)
    return map
  }, [active])

  const hasAny = tasks.length > 0

  return (
    <div class="screen">
      <header class="screen__header">
        <h1>Tasks</h1>
      </header>

      {!hasAny && (
        <div class="empty-state">
          <p>No tasks yet.</p>
          <button class="btn btn--primary" onClick={() => navigate('/tasks/new')}>
            + Add your first task
          </button>
        </div>
      )}

      {hasAny &&
        QUADRANTS.map((q) => (
          <QuadrantSection key={q.key} label={q.label} accent={q.accent} tasks={grouped[q.key]} onToggle={toggleDone} />
        ))}

      {completed.length > 0 && (
        <section class="quadrant quadrant--muted">
          <header class="quadrant__header quadrant__header--clickable" onClick={() => setShowCompleted((s) => !s)}>
            <span class="quadrant__label">Completed</span>
            <span class="quadrant__count">{completed.length}</span>
            <span class={`quadrant__chevron${showCompleted ? ' quadrant__chevron--open' : ''}`}>⌄</span>
          </header>
          {showCompleted && (
            <>
              <div class="quadrant__list">
                {completed.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={toggleDone} />
                ))}
              </div>
              <button class="link-btn link-btn--danger" onClick={clearCompleted}>
                Clear completed
              </button>
            </>
          )}
        </section>
      )}

      {hasAny && (
        <button class="fab" onClick={() => navigate('/tasks/new')} aria-label="Add task">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#04140b" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
