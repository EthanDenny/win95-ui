import { useCallback, useEffect, useRef } from 'react'
import { holdResizeCursor } from './resizeCursor'
import type { ResizeCursor } from './resizeCursor'

export function useResizeCursor() {
  const release = useRef<(() => void) | null>(null)
  const stop = useCallback(() => { release.current?.(); release.current = null }, [])
  const start = useCallback((cursor: ResizeCursor) => {
    stop()
    release.current = holdResizeCursor(document.documentElement, window, cursor)
  }, [stop])
  useEffect(() => stop, [stop])
  return { start, stop }
}
