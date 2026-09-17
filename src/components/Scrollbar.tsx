import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { scrollbarGeometry } from '../collectionModel'
import type { Orientation, ScrollPart } from '../collectionModel'
import { PixelScale } from './PixelScale'
import './controls.css'

export function Scrollbar({ orientation, length, total, page, value, scale, controls, onChange, disabled = false }: {
  orientation: Orientation; length: number; total: number; page: number; value: number
  scale: number; controls: string; onChange: (value: number) => void; disabled?: boolean
}) {
  const [pressed, setPressed] = useState<ScrollPart>()
  const drag = useRef<{ origin: number; value: number } | null>(null)
  const repeat = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const vertical = orientation === 'vertical'
  const width = vertical ? 16 : length
  const height = vertical ? length : 16
  const geometry = scrollbarGeometry({ x: 0, y: 0, width, height }, orientation, { value, total, page })
  const current = useRef(value)
  useEffect(() => { current.current = value }, [value])
  useEffect(() => () => clearTimeout(repeat.current), [])
  useEffect(() => { if (disabled) { clearTimeout(repeat.current); drag.current = null } }, [disabled])
  const change = (next: number) => {
    current.current = Math.max(0, Math.min(geometry.maximum, Math.round(next)))
    onChange(current.current)
  }
  const coordinate = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return (vertical ? (event.clientY - bounds.top) / bounds.height : (event.clientX - bounds.left) / bounds.width) * length
  }
  const release = () => { clearTimeout(repeat.current); drag.current = null; setPressed(undefined) }
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || geometry.maximum === 0 || event.button !== 0) return
    event.preventDefault()
    event.currentTarget.focus()
    event.currentTarget.setPointerCapture(event.pointerId)
    const position = coordinate(event)
    const thumbStart = vertical ? geometry.thumb.y : geometry.thumb.x
    const thumbLength = vertical ? geometry.thumb.height : geometry.thumb.width
    const part: ScrollPart = position < 16 ? 'start' : position >= length - 16 ? 'end'
      : position < thumbStart ? 'before' : position >= thumbStart + thumbLength ? 'after' : 'thumb'
    setPressed(part)
    if (part === 'thumb') drag.current = { origin: position, value }
    else {
      const delta = (part === 'start' || part === 'before' ? -1 : 1) * (part === 'start' || part === 'end' ? 16 : page)
      const step = () => {
        // A held track click stops when the thumb reaches the pointer.
        const updated = scrollbarGeometry({ x: 0, y: 0, width, height }, orientation, { value: current.current, total, page })
        const start = vertical ? updated.thumb.y : updated.thumb.x
        const end = start + (vertical ? updated.thumb.height : updated.thumb.width)
        if (part === 'before' && position >= start || part === 'after' && position < end) return
        change(current.current + delta)
        repeat.current = setTimeout(step, 60)
      }
      change(value + delta)
      repeat.current = setTimeout(step, 350)
    }
  }
  return <div className="bitmap-scrollbar w95-scrollbar" role="scrollbar" tabIndex={disabled || geometry.maximum === 0 ? -1 : 0} aria-disabled={disabled || geometry.maximum === 0} aria-label={`${orientation} scrollbar`}
    aria-controls={controls} aria-orientation={orientation} aria-valuemin={0} aria-valuemax={geometry.maximum} aria-valuenow={value}
    style={{ width: width * scale, height: height * scale }}
    onPointerDown={pointerDown} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
    onPointerMove={event => {
      if (drag.current && geometry.travel) change(drag.current.value + (coordinate(event) - drag.current.origin) * geometry.maximum / geometry.travel)
    }}
    onKeyDown={event => {
      if (disabled) return
      const deltas: Record<string, number> = { ArrowUp: -16, ArrowLeft: -16, ArrowDown: 16, ArrowRight: 16, PageUp: -page, PageDown: page }
      if (event.key in deltas || event.key === 'Home' || event.key === 'End') {
        event.preventDefault()
        change(event.key === 'Home' ? 0 : event.key === 'End' ? geometry.maximum : value + deltas[event.key])
      }
    }}>
    <PixelScale scale={scale} width={width} height={height}>
      <div className="w95-scroll-track" style={{ width, height }}>
        {!disabled && (pressed === 'before' || pressed === 'after') && <span className="w95-scroll-track w95-scroll-track-pressed" style={rectStyle(geometry[pressed])} />}
        {(['start', 'end'] as const).map(part => <span key={part} className={`w95-button w95-scroll-arrow w95-scroll-${vertical ? part === 'start' ? 'up' : 'down' : part === 'start' ? 'left' : 'right'}`}
          data-state={!disabled && pressed === part ? 'pressed' : 'normal'} data-disabled={disabled || geometry.maximum === 0} style={rectStyle(geometry[part])} aria-hidden="true">
          <span className="w95-button-frame" /><ScrollGlyph direction={vertical ? part === 'start' ? 'up' : 'down' : part === 'start' ? 'left' : 'right'} disabled={disabled || geometry.maximum === 0} />
        </span>)}
        {!disabled && geometry.maximum > 0 && <span className="w95-button w95-scroll-thumb" style={rectStyle(geometry.thumb)} aria-hidden="true"><span className="w95-button-frame" /></span>}
      </div>
    </PixelScale>
  </div>
}

function rectStyle(rect: { x: number; y: number; width: number; height: number }) {
  return { position: 'absolute' as const, left: rect.x, top: rect.y, width: rect.width, height: rect.height }
}

const arrowPixels = {
  up: ['0001000', '0011100', '0111110', '1111111'],
  down: ['1111111', '0111110', '0011100', '0001000'],
  left: ['0001', '0011', '0111', '1111', '0111', '0011', '0001'],
  right: ['1000', '1100', '1110', '1111', '1110', '1100', '1000'],
}
function ScrollGlyph({ direction, disabled }: { direction: keyof typeof arrowPixels; disabled: boolean }) {
  const rows = arrowPixels[direction]
  const path = rows.flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === '1' ? [`M${x} ${y}h1v1h-1z`] : [])).join('')
  return <svg className="w95-scroll-glyph" width={rows[0].length + 1} height={rows.length + 1} style={{ left: Math.floor((16 - rows[0].length) / 2), top: Math.floor((16 - rows.length) / 2) }} shapeRendering="crispEdges">
    {disabled && <path d={path} fill="#fff" transform="translate(1 1)" />}
    <path d={path} fill={disabled ? '#808080' : '#000'} />
  </svg>
}
