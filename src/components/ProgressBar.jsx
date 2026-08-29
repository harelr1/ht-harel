export default function ProgressBar({ done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const complete = total > 0 && done === total

  return (
    <div class="progress-summary">
      <div class="progress-summary__row">
        <span class="progress-summary__label">
          {total === 0 ? 'Nothing scheduled today' : `${done} / ${total} done today`}
        </span>
        {complete && <span class="progress-summary__badge">All done ✓</span>}
      </div>
      <div class="progress-summary__track">
        <div class="progress-summary__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
