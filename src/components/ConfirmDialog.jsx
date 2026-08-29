export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }) {
  return (
    <div class="dialog-overlay" onClick={onCancel}>
      <div class="dialog" onClick={(e) => e.stopPropagation()}>
        <h3 class="dialog__title">{title}</h3>
        {message && <p class="dialog__message">{message}</p>}
        <div class="dialog__actions">
          <button class="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button class={`btn ${danger ? 'btn--danger' : 'btn--primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
