import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ListItem } from '../collectionModel'
import { iconUrl } from '../icons'
import type { KitIconName } from '../icons'
import { Scrollbar } from './Scrollbar'
import './controls.css'

export type ListEntry = ListItem & { detail?: string }

// The viewport scrolls actual DOM rows. The Windows-style scrollbar controls the
// same scrollLeft/scrollTop values as wheel scrolling and keyboard navigation.
export function ListView({ label, items, selected, onSelect, onActivate, width = 260, height = 132,
  disabled = false, active = true, layout = 'list', columnWidth = 244, rowHeight = 16, onSort, descending = false }: {
  label: string; items: ListEntry[]; selected: number; onSelect: (index: number) => void; onActivate?: (index: number) => void
  width?: number; height?: number; disabled?: boolean; active?: boolean
  layout?: 'list' | 'small-icons' | 'details' | 'columns'; columnWidth?: number; rowHeight?: number; onSort?: () => void; descending?: boolean
}) {
  const id = useId()
  const viewport = useRef<HTMLDivElement>(null)
  const search = useRef({ text: '', time: 0 })
  const [offset, setOffset] = useState(0)
  const horizontal = layout === 'columns'
  const header = layout === 'details' ? 20 : 0
  const viewWidth = width - 4 - (horizontal ? 0 : 16)
  const viewHeight = height - 4 - header - (horizontal ? 16 : 0)
  const rows = Math.max(1, Math.floor(viewHeight / rowHeight))
  const total = horizontal ? Math.ceil(items.length / rows) * columnWidth : items.length * rowHeight
  const page = horizontal ? viewWidth : viewHeight
  const maximum = Math.max(0, total - page)
  const scrollTo = (value: number) => {
    const element = viewport.current!
    if (horizontal) element.scrollLeft = Math.max(0, Math.min(maximum, Math.round(value)))
    else element.scrollTop = Math.max(0, Math.min(maximum, Math.round(value)))
    setOffset(horizontal ? element.scrollLeft : element.scrollTop)
  }
  const select = (index: number) => {
    if (!items.length) return
    const next = Math.max(0, Math.min(items.length - 1, index))
    onSelect(next)
    const start = horizontal ? Math.floor(next / rows) * columnWidth : next * rowHeight
    const end = start + (horizontal ? Math.min(columnWidth, viewWidth) : rowHeight)
    const position = horizontal ? viewport.current!.scrollLeft : viewport.current!.scrollTop
    if (start < position) scrollTo(start)
    else if (end > position + page) scrollTo(end - page)
  }
  const selectedLabel = items[selected]?.label
  useLayoutEffect(() => {
    if (selectedLabel === undefined) return
    const element = viewport.current!
    const start = horizontal ? Math.floor(selected / rows) * columnWidth : selected * rowHeight
    const end = start + (horizontal ? Math.min(columnWidth, viewWidth) : rowHeight)
    const position = horizontal ? element.scrollLeft : element.scrollTop
    const next = start < position ? start : end > position + page ? end - page : position
    if (horizontal) element.scrollLeft = next
    else element.scrollTop = next
  }, [selected, selectedLabel, horizontal, rows, columnWidth, viewWidth, page, rowHeight])
  useEffect(() => {
    const element = viewport.current!
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || disabled || maximum === 0) return
      const delta = horizontal ? event.deltaX || event.deltaY : event.deltaY
      if (!delta) return
      event.preventDefault()
      const scale = element.getBoundingClientRect().width / element.clientWidth
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? page : 1 / scale
      if (horizontal) element.scrollLeft += Math.round(delta * unit)
      else element.scrollTop += Math.round(delta * unit)
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => element.removeEventListener('wheel', wheel)
  }, [disabled, horizontal, maximum, page])
  return <div className="w95-list-view w95-inset w95-native-text" style={{ width, height }} data-active={active && !disabled} data-layout={layout}>
    {header > 0 && <div className="w95-list-headers" style={{ width: viewWidth }}>
      <button type="button" className="w95-list-header w95-native-text" aria-label={`Sort ${label.toLowerCase()} by name`} disabled={disabled} onClick={onSort} style={{ width: 156 }}>Name {descending ? '-' : '+'}</button>
      <span className="w95-list-header" style={{ flex: 1 }}>Type</span>
    </div>}
    <div ref={viewport} id={id} role="listbox" aria-label={label} aria-disabled={disabled} aria-activedescendant={items[selected] ? `${id}-${selected}` : undefined}
      tabIndex={disabled ? -1 : 0} className="w95-list-viewport" style={{ width: viewWidth, height: viewHeight, top: 2 + header }}
      onScroll={event => setOffset(horizontal ? event.currentTarget.scrollLeft : event.currentTarget.scrollTop)}
      onKeyDown={event => {
        if (disabled) return
        const movement: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, PageUp: -rows, PageDown: rows, ...(horizontal ? { ArrowLeft: -rows, ArrowRight: rows } : {}) }
        if (event.key in movement || event.key === 'Home' || event.key === 'End') {
          event.preventDefault()
          select(event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : selected + movement[event.key])
        } else if (event.key === 'Enter') { event.preventDefault(); if (items[selected]) onActivate?.(selected) }
        else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault()
          const now = event.timeStamp
          const text = (now - search.current.time < 700 ? search.current.text : '') + event.key.toLowerCase()
          search.current = { text, time: now }
          const prefix = [...text].every(char => char === text[0]) ? text[0] : text
          for (let step = 0; step < items.length; step++) {
            const index = (Math.max(0, selected + (prefix.length === 1 ? 1 : 0)) + step) % items.length
            if (items[index].label.toLowerCase().startsWith(prefix)) { select(index); break }
          }
        }
      }}>
      <div className="w95-list-content" style={horizontal ? { display: 'grid', gridAutoFlow: 'column', gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`, gridAutoColumns: columnWidth, width: Math.max(total, viewWidth) } : undefined}>
        {items.map((item, index) => <div key={`${item.label}-${index}`} id={`${id}-${index}`} role="option" aria-selected={selected === index}
          className="w95-list-row" style={{ height: rowHeight, paddingLeft: horizontal ? 0 : 2 + (item.indent ?? 0) * 8 }}
          onPointerDown={event => { if (event.button === 0) { event.preventDefault(); if (!disabled) viewport.current?.focus({ preventScroll: true }) } }}
          onClick={() => { if (!disabled) select(index) }} onDoubleClick={() => { if (!disabled) onActivate?.(index) }}>
          {item.icon && <img className="w95-list-icon" src={iconUrl(item.icon as KitIconName)} width={16} height={16} alt="" draggable={false} />}
          <span className="w95-list-label" title={item.label}>{item.label}</span>
          {layout === 'details' && <span className="w95-list-detail">{item.detail}</span>}
        </div>)}
      </div>
    </div>
    <div style={{ position: 'absolute', left: horizontal ? 2 : width - 18, top: horizontal ? height - 18 : 2 + header }}>
      <Scrollbar orientation={horizontal ? 'horizontal' : 'vertical'} length={page} total={total} page={page} value={Math.min(offset, maximum)} onChange={scrollTo} scale={1} controls={id} disabled={disabled} />
    </div>
  </div>
}
