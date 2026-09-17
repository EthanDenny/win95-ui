import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Scrollbar } from './Scrollbar'

export function ScrollArea({ label, width, height, contentWidth, contentHeight, horizontal = false, vertical = false, disabled = false, x, y, onScroll, children }: {
  label: string; width: number; height: number; contentWidth: number; contentHeight: number; horizontal?: boolean; vertical?: boolean; disabled?: boolean
  x?: number; y?: number; onScroll?: (x: number, y: number) => void; children: ReactNode
}) {
  const id = useId()
  const viewport = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: x ?? 0, y: y ?? 0 })
  const viewWidth = width - (vertical ? 16 : 0), viewHeight = height - (horizontal ? 16 : 0)
  useLayoutEffect(() => {
    const element = viewport.current!
    if (x !== undefined && element.scrollLeft !== x) element.scrollLeft = x
    if (y !== undefined && element.scrollTop !== y) element.scrollTop = y
  }, [x, y])
  useEffect(() => {
    const element = viewport.current!
    const wheel = (event: WheelEvent) => {
      if (disabled || event.ctrlKey) return
      const scale = element.getBoundingClientRect().width / element.clientWidth
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewHeight : 1 / scale
      const dx = horizontal ? event.shiftKey || !vertical ? event.deltaX || event.deltaY : event.deltaX : 0
      const dy = vertical && !event.shiftKey ? event.deltaY : 0
      if (!dx && !dy) return
      event.preventDefault(); element.scrollLeft += Math.round(dx * unit); element.scrollTop += Math.round(dy * unit)
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => element.removeEventListener('wheel', wheel)
  }, [disabled, horizontal, vertical, viewHeight])
  return <div className="w95-scroll-area" style={{ position: 'relative', width, height }}>
    <div ref={viewport} id={id} aria-label={label}
      className="w95-scroll-viewport" style={{ width: viewWidth, height: viewHeight, overflow: disabled ? 'hidden' : 'auto' }}
      onScroll={event => { const { scrollLeft: x, scrollTop: y } = event.currentTarget; setPosition({ x, y }); onScroll?.(x, y) }}>
      <div style={{ position: 'relative', width: Math.max(contentWidth, viewWidth), height: Math.max(contentHeight, viewHeight) }}>{children}</div>
    </div>
    {vertical && <div style={{ position: 'absolute', left: viewWidth, top: 0 }}><Scrollbar orientation="vertical" scale={1} length={viewHeight} total={contentHeight} page={viewHeight} value={position.y} disabled={disabled} controls={id} onChange={value => { viewport.current!.scrollTop = value }} /></div>}
    {horizontal && <div style={{ position: 'absolute', left: 0, top: viewHeight }}><Scrollbar orientation="horizontal" scale={1} length={viewWidth} total={contentWidth} page={viewWidth} value={position.x} disabled={disabled} controls={id} onChange={value => { viewport.current!.scrollLeft = value }} /></div>}
    {horizontal && vertical && <span style={{ position: 'absolute', left: viewWidth, top: viewHeight, width: 16, height: 16, background: '#c0c0c0' }} />}
  </div>
}
