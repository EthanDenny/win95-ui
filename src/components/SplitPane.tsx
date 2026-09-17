import { useState } from 'react'
import type { ReactNode } from 'react'
import { useResizeCursor } from '../useResizeCursor'
import './controls.css'

export function SplitPane({ first, second, width = 280, height = 100, defaultSplit = 120, split, onSplitChange, minPaneSize = 60, minSecondPaneSize = minPaneSize, disabled = false, label = 'Pane divider' }: {
  first: ReactNode; second: ReactNode; width?: number; height?: number; defaultSplit?: number
  split?: number; onSplitChange?: (value: number) => void; minPaneSize?: number; minSecondPaneSize?: number; disabled?: boolean; label?: string
}) {
  const [internal, setInternal] = useState(defaultSplit)
  const cursor = useResizeCursor()
  const minimum = Math.min(minPaneSize, Math.floor((width - 4) / 2))
  const maximum = width - Math.min(minSecondPaneSize, width - minimum - 4) - 4
  const clamp = (value: number) => Math.max(minimum, Math.min(maximum, Math.round(value)))
  const position = clamp(split ?? internal)
  const change = (value: number) => { const next = clamp(value); setInternal(next); onSplitChange?.(next) }
  return <div className="w95-native-text" style={{ position: 'relative', width, height, background: '#c0c0c0' }}>
    <div style={{ position: 'absolute', left: 0, width: position, height, overflow: 'hidden' }}>{first}</div>
    <div style={{ position: 'absolute', left: position + 4, width: width - position - 4, height, overflow: 'hidden' }}>{second}</div>
    <div className="w95-splitter" style={{ position: 'absolute', left: position, top: 0, width: 4, height }} role="separator" aria-label={label} aria-orientation="vertical"
      aria-valuemin={minimum} aria-valuemax={maximum} aria-valuenow={position} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
      onPointerDown={event => { if (!disabled && event.button === 0) { event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); cursor.start('sizewe') } }}
      onPointerMove={event => { if (!disabled && event.currentTarget.hasPointerCapture(event.pointerId)) { const rect = event.currentTarget.parentElement!.getBoundingClientRect(); change((event.clientX - rect.left) * width / rect.width) } }}
      onPointerUp={event => { cursor.stop(); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }}
      onPointerCancel={cursor.stop} onLostPointerCapture={cursor.stop}
      onKeyDown={event => {
        if (disabled) return
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault(); change(event.key === 'Home' ? minimum : event.key === 'End' ? maximum : position + (event.key === 'ArrowLeft' ? -1 : 1) * (event.shiftKey ? 10 : 1))
        }
      }} />
  </div>
}
