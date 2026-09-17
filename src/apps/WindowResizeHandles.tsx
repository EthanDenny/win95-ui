import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import type { AppWindow } from './model'
import type { Rect } from '../theme'
import { canResize, resizeEdges, resizeLabels, resizeWindow } from './windowSizing'
import type { ResizeEdge } from './windowSizing'
import { useResizeCursor } from '../useResizeCursor'
import { edgeCursors } from '../resizeCursor'

type Props = {
  window: AppWindow
  point: (event: PointerEvent) => { x: number; y: number }
  onResize: (bounds: Rect) => void
  onPreview: (bounds: Rect | null) => void
}

export function WindowResizeHandles({ window: w, point, onResize, onPreview }: Props) {
  const drag = useRef<{ pointer: number; x: number; y: number; window: AppWindow; edge: ResizeEdge; bounds: Rect } | null>(null)
  const cursor = useResizeCursor()
  const cancel = () => { cursor.stop(); drag.current = null; onPreview(null) }
  useEffect(() => {
    const cancelOnBlur = () => { if (drag.current) cancel() }
    window.addEventListener('blur', cancelOnBlur)
    return () => window.removeEventListener('blur', cancelOnBlur)
  })
  if (!canResize(w)) return null
  const stop = () => {
    if (drag.current) onResize(drag.current.bounds)
    cancel()
  }
  return resizeEdges.map(edge => <div key={edge} className={`resize-hit-target resize-${edge}`} role="group" tabIndex={0} aria-label={`Resize ${resizeLabels[edge]} edge`} onPointerDown={event => {
    if (event.button !== 0) return
    event.preventDefault()
    event.currentTarget.focus()
    const p = point(event)
    drag.current = { pointer: event.pointerId, ...p, window: w, edge, bounds: w }
    onPreview(w)
    event.currentTarget.setPointerCapture(event.pointerId)
    cursor.start(edgeCursors[edge])
  }} onPointerMove={event => {
    const d = drag.current
    if (!d || d.pointer !== event.pointerId) return
    const p = point(event)
    d.bounds = resizeWindow(d.window, d.edge, p.x - d.x, p.y - d.y)
    onPreview(d.bounds)
  }} onPointerUp={stop} onPointerCancel={cancel} onLostPointerCapture={cancel} onBlur={() => { if (drag.current?.pointer === -1) cancel() }} onKeyDown={event => {
    if (event.key === 'Escape') { event.stopPropagation(); cancel(); return }
    if (event.key === 'Enter' && drag.current) { event.preventDefault(); stop(); return }
    const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    event.stopPropagation()
    const step = event.shiftKey ? 10 : 1
    const d = drag.current ?? { pointer: -1, x: 0, y: 0, window: w, edge, bounds: w }
    d.bounds = resizeWindow({ ...w, ...d.bounds }, edge, direction[0] * step, direction[1] * step)
    drag.current = d
    onPreview(d.bounds)
  }} />)
}
