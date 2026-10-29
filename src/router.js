import { useEffect, useState } from 'react'

const read = () => (typeof location === 'undefined' ? '/' : location.hash.slice(1) || '/')

export const go = (path) => {
  location.hash = path
}

export function useRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
