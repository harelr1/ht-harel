import TaskRow from './TaskRow'

export default function QuadrantSection({ label, accent, tasks, onToggle }) {
  return (
    <section class={`quadrant quadrant--${accent}`}>
      <header class="quadrant__header">
        <span class="quadrant__label">{label}</span>
        <span class="quadrant__count">{tasks.length}</span>
      </header>
      {tasks.length === 0 ? (
        <p class="quadrant__empty">Nothing here</p>
      ) : (
        <div class="quadrant__list">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={onToggle} />
          ))}
        </div>
      )}
    </section>
  )
}
