import { useEffect, useRef, useState } from 'preact/hooks'

const CONFETTI_PIECES = 12

export default function ProgressBar({ done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const complete = total > 0 && done === total

  const wasComplete = useRef(complete)
  const [celebrate, setCelebrate] = useState(false)

  useEffect(() => {
    const justCompleted = complete && !wasComplete.current
    wasComplete.current = complete
    if (justCompleted) {
      setCelebrate(true)
      const t = setTimeout(() => setCelebrate(false), 900)
      return () => clearTimeout(t)
    }
  }, [complete])

  return (
    <div class="progress-summary">
      <div class="progress-summary__row">
        <span class="progress-summary__label">
          {total === 0 ? 'Nothing scheduled today' : `${done} / ${total} done today`}
        </span>
        {complete && <span class="progress-summary__badge progress-summary__badge--gold">All done ✓</span>}
      </div>
      <div class="progress-summary__track">
        <div
          class={`progress-summary__fill${complete ? ' progress-summary__fill--complete' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {celebrate && (
        <div class="confetti" aria-hidden="true">
          {Array.from({ length: CONFETTI_PIECES }).map((_, i) => (
            <span class="confetti__piece" key={i} />
          ))}
        </div>
      )}
    </div>
  )
}
