const PRESET_EMOJI = [
  '💪', '🏃', '🧘', '💧', '🥗', '🛏️', '🪥', '🧹',
  '📚', '✍️', '🎯', '🎸', '🎨', '🐕', '💊', '☀️',
  '🚭', '📵', '🧺', '🧾',
]

export default function EmojiPicker({ value, onChange }) {
  return (
    <div class="emoji-picker">
      <div class="emoji-picker__grid">
        {PRESET_EMOJI.map((emoji) => (
          <button
            key={emoji}
            type="button"
            class={`emoji-picker__option${value === emoji ? ' emoji-picker__option--active' : ''}`}
            onClick={() => onChange(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <input
        class="emoji-picker__custom"
        type="text"
        maxLength={4}
        placeholder="or type your own"
        value={PRESET_EMOJI.includes(value) ? '' : value}
        onInput={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  )
}
