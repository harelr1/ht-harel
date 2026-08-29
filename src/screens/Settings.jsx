import { useMemo, useRef, useState } from 'preact/hooks'
import { useHabits } from '../hooks/useHabits'
import { navigate } from '../hooks/useHashRoute'
import { exportData, importData } from '../lib/storage'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Settings() {
  const { habits, archiveHabit, deleteHabit, reorderHabits, replaceAll } = useHabits()
  const active = useMemo(() => habits.filter((h) => !h.archived), [habits])
  const archived = useMemo(() => habits.filter((h) => h.archived), [habits])
  const fileInputRef = useRef(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importError, setImportError] = useState('')

  function move(index, delta) {
    const ids = active.map((h) => h.id)
    const target = index + delta
    if (target < 0 || target >= ids.length) return
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    reorderHabits([...ids, ...archived.map((h) => h.id)])
  }

  function handleExport() {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habits-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e) {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    setImportError('')
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const next = importData(String(reader.result))
        replaceAll(next)
      } catch (err) {
        setImportError('That file could not be read as a habits backup.')
      }
    }
    reader.readAsText(file)
    e.currentTarget.value = ''
  }

  return (
    <div class="screen">
      <header class="screen__header">
        <h1>Settings</h1>
      </header>

      <h2 class="section-title">Your habits</h2>
      <div class="habit-list">
        {active.length === 0 && <p class="empty-note">No habits yet.</p>}
        {active.map((habit, i) => (
          <div class="manage-row" key={habit.id}>
            <span class="manage-row__emoji">{habit.emoji}</span>
            <button class="manage-row__name" onClick={() => navigate(`/habit/${habit.id}`)}>
              {habit.name}
            </button>
            <div class="manage-row__actions">
              <button class="icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                ↑
              </button>
              <button class="icon-btn" disabled={i === active.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                ↓
              </button>
              <button class="icon-btn" onClick={() => archiveHabit(habit.id, true)} aria-label="Archive">
                🗄
              </button>
            </div>
          </div>
        ))}
      </div>
      <button class="btn btn--secondary btn--block" onClick={() => navigate('/new')}>
        + Add habit
      </button>

      {archived.length > 0 && (
        <>
          <h2 class="section-title">Archived</h2>
          <div class="habit-list">
            {archived.map((habit) => (
              <div class="manage-row" key={habit.id}>
                <span class="manage-row__emoji">{habit.emoji}</span>
                <span class="manage-row__name manage-row__name--muted">{habit.name}</span>
                <div class="manage-row__actions">
                  <button class="icon-btn" onClick={() => archiveHabit(habit.id, false)} aria-label="Restore">
                    ↩
                  </button>
                  <button class="icon-btn icon-btn--danger" onClick={() => deleteHabit(habit.id)} aria-label="Delete permanently">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 class="section-title">Data</h2>
      <div class="settings-actions">
        <button class="btn btn--secondary btn--block" onClick={handleExport}>
          Export backup (.json)
        </button>
        <button class="btn btn--secondary btn--block" onClick={() => fileInputRef.current?.click()}>
          Import backup
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleImportFile}
        />
        {importError && <p class="form__error">{importError}</p>}
        <button class="btn btn--danger btn--block" onClick={() => setConfirmClear(true)}>
          Clear all data
        </button>
      </div>

      <p class="settings-footer">Habit Tracker · your data stays on this device</p>

      {confirmClear && (
        <ConfirmDialog
          title="Clear all data?"
          message="This deletes every habit and all history from this device permanently."
          confirmLabel="Clear everything"
          danger
          onConfirm={() => {
            replaceAll([])
            setConfirmClear(false)
          }}
          onCancel={() => setConfirmClear(false)}
        />
      )}
    </div>
  )
}
