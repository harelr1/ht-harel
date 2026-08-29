import { useMemo, useState } from 'preact/hooks'
import { useHabits } from '../hooks/useHabits'
import { navigate } from '../hooks/useHashRoute'
import { currentStreak, longestStreak, completionRate } from '../lib/streak'
import BackHeader from '../components/BackHeader'
import Heatmap from '../components/Heatmap'
import EmojiPicker from '../components/EmojiPicker'
import ScheduleEditor from '../components/ScheduleEditor'
import ConfirmDialog from '../components/ConfirmDialog'
import { FlameIcon } from '../components/HabitRow'

export default function HabitDetail({ id }) {
  const { habits, updateHabit, deleteHabit, archiveHabit } = useHabits()
  const habit = habits.find((h) => h.id === id)

  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(habit?.name ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const stats = useMemo(() => {
    if (!habit) return null
    return {
      current: currentStreak(habit),
      longest: longestStreak(habit),
      rate7: completionRate(habit, 7),
      rate30: completionRate(habit, 30),
    }
  }, [habit])

  if (!habit) {
    return (
      <div class="screen">
        <BackHeader title="Habit" onBack={() => navigate('/')} />
        <p class="empty-note">This habit was deleted.</p>
      </div>
    )
  }

  function startEdit() {
    setDraftName(habit.name)
    setEditing(true)
  }

  function saveEdit() {
    const trimmed = draftName.trim()
    if (trimmed) updateHabit(habit.id, { name: trimmed })
    setEditing(false)
  }

  return (
    <div class="screen">
      <BackHeader
        title={editing ? 'Edit habit' : habit.name}
        onBack={() => navigate('/')}
        action={
          editing ? (
            <button class="link-btn" onClick={saveEdit}>
              Done
            </button>
          ) : (
            <button class="link-btn" onClick={startEdit}>
              Edit
            </button>
          )
        }
      />

      {editing ? (
        <div class="form">
          <label class="form__label" htmlFor="edit-name">
            Name
          </label>
          <input
            id="edit-name"
            class="form__input"
            type="text"
            value={draftName}
            maxLength={40}
            onInput={(e) => setDraftName(e.currentTarget.value)}
          />

          <span class="form__label">Icon</span>
          <EmojiPicker value={habit.emoji} onChange={(emoji) => updateHabit(habit.id, { emoji })} />

          <span class="form__label">Repeats on</span>
          <ScheduleEditor schedule={habit.schedule} onChange={(schedule) => updateHabit(habit.id, { schedule })} />

          <button class="btn btn--danger btn--block" onClick={() => setConfirmDelete(true)}>
            Delete habit
          </button>
        </div>
      ) : (
        <>
          <div class="detail-hero">
            <span class="detail-hero__emoji">{habit.emoji}</span>
          </div>

          <div class="stat-grid">
            <div class="stat-card">
              <FlameIcon lit={stats.current > 0} size={20} />
              <span class="stat-card__value">{stats.current}</span>
              <span class="stat-card__label">Current streak</span>
            </div>
            <div class="stat-card">
              <TrophyIcon />
              <span class="stat-card__value">{stats.longest}</span>
              <span class="stat-card__label">Longest streak</span>
            </div>
            <div class="stat-card">
              <span class="stat-card__value">{formatPct(stats.rate7)}</span>
              <span class="stat-card__label">Last 7 days</span>
            </div>
            <div class="stat-card">
              <span class="stat-card__value">{formatPct(stats.rate30)}</span>
              <span class="stat-card__label">Last 30 days</span>
            </div>
          </div>

          <h2 class="section-title">History</h2>
          <Heatmap habit={habit} />
        </>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this habit?"
          message="This permanently removes it and all of its history. This can't be undone."
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            deleteHabit(habit.id)
            navigate('/')
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}

function formatPct(rate) {
  if (rate === null || rate === undefined) return '—'
  return `${Math.round(rate * 100)}%`
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M7 4h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4Z"
        stroke="var(--green)"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path d="M12 13v3M9 20h6M10 20v-2.5M14 20v-2.5" stroke="var(--green)" stroke-width="1.6" stroke-linecap="round" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" stroke="var(--green)" stroke-width="1.6" stroke-linecap="round" />
    </svg>
  )
}
