import { DAY_LABELS } from '../lib/date'
import { SCHEDULE_PRESETS, matchPresetName } from '../lib/streak'

const PRESET_BUTTONS = [
  { name: 'everyDay', label: 'Every day' },
  { name: 'weekdays', label: 'Weekdays' },
  { name: 'weekends', label: 'Weekends' },
]

export default function ScheduleEditor({ schedule, onChange }) {
  const activePreset = matchPresetName(schedule)

  function toggleDay(day) {
    const has = schedule.includes(day)
    const next = has ? schedule.filter((d) => d !== day) : [...schedule, day]
    onChange(next.sort())
  }

  return (
    <div class="schedule-editor">
      <div class="schedule-editor__presets">
        {PRESET_BUTTONS.map(({ name, label }) => (
          <button
            key={name}
            type="button"
            class={`chip${activePreset === name ? ' chip--active' : ''}`}
            onClick={() => onChange(SCHEDULE_PRESETS[name])}
          >
            {label}
          </button>
        ))}
      </div>
      <div class="schedule-editor__days">
        {DAY_LABELS.map((label, day) => (
          <button
            key={day}
            type="button"
            class={`day-toggle${schedule.includes(day) ? ' day-toggle--active' : ''}`}
            onClick={() => toggleDay(day)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
