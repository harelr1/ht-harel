import { useEffect, useState } from 'preact/hooks'

function readHash() {
  const hash = window.location.hash.replace(/^#/, '') || '/'
  const [path, query] = hash.split('?')
  const params = Object.fromEntries(new URLSearchParams(query))
  return { path: path || '/', params }
}

export function useHashRoute() {
  const [route, setRoute] = useState(readHash)

  useEffect(() => {
    const onHashChange = () => setRoute(readHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route
}

export function navigate(path) {
  window.location.hash = path
}
