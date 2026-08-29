export default function BackHeader({ title, onBack, action }) {
  return (
    <header class="back-header">
      <button class="back-header__btn" onClick={onBack} aria-label="Back">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <h1 class="back-header__title">{title}</h1>
      <div class="back-header__action">{action}</div>
    </header>
  )
}
