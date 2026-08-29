import { useState } from 'preact/hooks'
import { useHabits } from '../hooks/useHabits'
import { navigate } from '../hooks/useHashRoute'
import EmojiPicker from '../components/EmojiPicker'
import ScheduleEditor from '../components/ScheduleEditor'
import { SCHEDULE_PRESETS } from '../lib/streak'
import BackHeader from '../components/BackHeader'

export default function AddHabit() {
  const { addHabit } = useHabits()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('✅')
  const [schedule, setSchedule] = useState(SCHEDULE_PRESETS.everyDay)

  function save(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || schedule.length === 0) return
    addHabit({ name: trimmed, emoji: emoji || '✅', schedule })
    navigate('/')
  }

  const canSave = name.trim().length > 0 && schedule.length > 0

  return (
    <div class="screen">
      <BackHeader title="New habit" onBack={() => navigate('/')} />

      <form class="form" onSubmit={save}>
        <label class="form__label" htmlFor="habit-name">
          Name
        </label>
        <input
          id="habit-name"
          class="form__input"
          type="text"
          placeholder="e.g. Take out the trash"
          value={name}
          maxLength={40}
          onInput={(e) => setName(e.currentTarget.value)}
          autoFocus
        />

        <span class="form__label">Icon</span>
        <EmojiPicker value={emoji} onChange={setEmoji} />

        <span class="form__label">Repeats on</span>
        <ScheduleEditor schedule={schedule} onChange={setSchedule} />

        <button type="submit" class="btn btn--primary btn--block" disabled={!canSave}>
          Save habit
        </button>
      </form>
    </div>
  )
}
