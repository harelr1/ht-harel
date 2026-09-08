export const QUADRANTS = [
  { key: 'doFirst', label: 'Do First', accent: 'danger', urgent: true, important: true },
  { key: 'schedule', label: 'Schedule', accent: 'green', urgent: false, important: true },
  { key: 'quick', label: 'Quick Tasks', accent: 'gold', urgent: true, important: false },
  { key: 'someday', label: 'Someday', accent: 'muted', urgent: false, important: false },
]

export function quadrantOf(task) {
  if (task.urgent && task.important) return 'doFirst'
  if (task.important) return 'schedule'
  if (task.urgent) return 'quick'
  return 'someday'
}

export function quadrantLabel(urgent, important) {
  return QUADRANTS.find((q) => q.urgent === urgent && q.important === important).label
}
