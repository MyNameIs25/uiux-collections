import { useCallback, useEffect, useState } from 'react'

/**
 * Fired whenever any `useUrlParam` writer updates the URL. `pushState` does not
 * emit `popstate`, so we broadcast our own event to keep every hook instance
 * (sidebar, gallery, future components) in sync — the URL is the global store.
 */
const URL_PARAM_EVENT = 'urlparam:change'

/**
 * Router-free URL query-param state. Reads `?key=...` and writes back via
 * `history.pushState`, staying in sync with browser back/forward (`popstate`)
 * and with other `useUrlParam` instances on the page.
 *
 * Setting the value to `defaultValue` (or an empty string) removes the param
 * so the URL stays clean.
 */
export function useUrlParam(
  key: string,
  defaultValue = '',
): readonly [string, (next: string) => void] {
  const read = useCallback(() => {
    if (typeof window === 'undefined') return defaultValue
    return new URLSearchParams(window.location.search).get(key) ?? defaultValue
  }, [key, defaultValue])

  const [value, setValue] = useState(read)

  useEffect(() => {
    const sync = () => setValue(read())
    window.addEventListener('popstate', sync)
    window.addEventListener(URL_PARAM_EVENT, sync)
    // Re-read on mount in case the URL changed before this instance subscribed.
    sync()
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener(URL_PARAM_EVENT, sync)
    }
  }, [read])

  const set = useCallback(
    (next: string) => {
      const params = new URLSearchParams(window.location.search)
      if (!next || next === defaultValue) params.delete(key)
      else params.set(key, next)

      const qs = params.toString()
      const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`
      window.history.pushState({}, '', url)
      window.dispatchEvent(new Event(URL_PARAM_EVENT))
    },
    [key, defaultValue],
  )

  return [value, set] as const
}
