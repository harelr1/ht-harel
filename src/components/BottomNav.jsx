import { navigate } from '../hooks/useHashRoute'

const TABS = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/tasks', label: 'Tasks', icon: TasksIcon },
  { path: '/workout', label: 'Workout', icon: WorkoutIcon },
  { path: '/stats', label: 'Stats', icon: StatsIcon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function BottomNav({ current }) {
  return (
    <nav class="bottom-nav">
      {TABS.map(({ path, label, icon: Icon }) => {
        const active = current === path
        return (
          <button
            key={path}
            class={`bottom-nav__item${active ? ' bottom-nav__item--active' : ''}`}
            onClick={() => navigate(path)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon active={active} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function HomeIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M4 11.5 12 4l8 7.5M6 9.5V19a1 1 0 0 0 1 1h3v-5a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2v5h3a1 1 0 0 0 1-1V9.5"
        stroke={active ? 'var(--green)' : 'currentColor'}
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

function TasksIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke={active ? 'var(--green)' : 'currentColor'} stroke-width="1.6" />
      <path
        d="M9 3.5h6a1 1 0 0 1 1 1V6H8V4.5a1 1 0 0 1 1-1Z"
        stroke={active ? 'var(--green)' : 'currentColor'}
        stroke-width="1.6"
      />
      <path d="M9 12h6M9 16h4" stroke={active ? 'var(--green)' : 'currentColor'} stroke-width="1.6" stroke-linecap="round" />
    </svg>
  )
}

function WorkoutIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M6.5 9v6M4 10.5v3M17.5 9v6M20 10.5v3M6.5 12h11"
        stroke={active ? 'var(--green)' : 'currentColor'}
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>
  )
}

function StatsIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M4 20V10M10 20V4M16 20v-7M20 20H4"
        stroke={active ? 'var(--green)' : 'currentColor'}
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

function SettingsIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke={active ? 'var(--green)' : 'currentColor'}
        stroke-width="1.8"
      />
      <path
        d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H4.5a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.04 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.5a1.7 1.7 0 0 0 1.04-1.56V4.5a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.5a1.7 1.7 0 0 0 1.56 1.04h.09a2 2 0 1 1 0 4H19.5a1.7 1.7 0 0 0-1.56 1.04Z"
        stroke={active ? 'var(--green)' : 'currentColor'}
        stroke-width="1.4"
        stroke-linejoin="round"
      />
    </svg>
  )
}
