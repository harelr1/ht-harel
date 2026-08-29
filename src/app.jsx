import { HabitsProvider } from './hooks/useHabits'
import { useHashRoute } from './hooks/useHashRoute'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import Stats from './screens/Stats'
import Settings from './screens/Settings'
import AddHabit from './screens/AddHabit'
import HabitDetail from './screens/HabitDetail'

const TAB_ROUTES = ['/', '/stats', '/settings']

export function App() {
  return (
    <HabitsProvider>
      <Shell />
    </HabitsProvider>
  )
}

function Shell() {
  const { path } = useHashRoute()
  const segments = path.split('/').filter(Boolean)
  const showNav = TAB_ROUTES.includes(path)

  let screen
  if (path === '/') screen = <Home />
  else if (path === '/stats') screen = <Stats />
  else if (path === '/settings') screen = <Settings />
  else if (path === '/new') screen = <AddHabit />
  else if (segments[0] === 'habit' && segments[1]) screen = <HabitDetail id={segments[1]} />
  else screen = <Home />

  return (
    <div class="app-shell">
      <main class={`app-content${showNav ? ' app-content--with-nav' : ''}`}>{screen}</main>
      {showNav && <BottomNav current={path} />}
    </div>
  )
}
