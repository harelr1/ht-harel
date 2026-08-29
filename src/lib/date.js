export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
export const DAY_LABELS_FULL = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

export function toISODate(d = new Date()) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseISODate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function dayOfWeek(isoDate) {
  return parseISODate(isoDate).getDay()
}

export function addDays(isoDate, delta) {
  const dt = parseISODate(isoDate)
  dt.setDate(dt.getDate() + delta)
  return toISODate(dt)
}

export function formatFriendlyDate(isoDate = toISODate()) {
  const d = parseISODate(isoDate)
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatShortDate(isoDate) {
  const d = parseISODate(isoDate)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
