import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Scrollbar } from './Scrollbar'
import { iconUrl } from '../icons'
import type { KitIconName } from '../icons'
import './controls.css'

export type TreeNode = { id: string; label: string; icon: string; children?: TreeNode[] }
type TreeRow = { node: TreeNode; depth: number; parent?: string; last: boolean; ancestors: boolean[]; position: number; siblings: number }
function visibleRows(nodes: TreeNode[], expanded: string[], depth = 0, parent?: string, ancestors: boolean[] = []): TreeRow[] {
  return nodes.flatMap((node, index) => {
    const last = index === nodes.length - 1
    return [{ node, depth, parent, last, ancestors, position: index + 1, siblings: nodes.length }, ...(node.children && expanded.includes(node.id) ? visibleRows(node.children, expanded, depth + 1, node.id, [...ancestors, !last]) : [])]
  })
}

export function TreeView({ label, nodes, expanded, onExpandedChange, selected, onSelect, disabled = false, active = true, width = 260, height = 132 }: {
  label: string; nodes: TreeNode[]; expanded: string[]; onExpandedChange: (ids: string[]) => void; selected: string; onSelect: (id: string) => void
  disabled?: boolean; active?: boolean; width?: number; height?: number
}) {
  const id = useId()
  const viewport = useRef<HTMLDivElement>(null)
  const search = useRef({ text: '', time: 0 })
  const [offset, setOffset] = useState(0)
  const rows = visibleRows(nodes, expanded)
  const index = rows.findIndex(row => row.node.id === selected)
  const page = height - 4
  const total = rows.length * 16
  const maximum = Math.max(0, total - page)
  const scroll = (value: number) => { viewport.current!.scrollTop = Math.max(0, Math.min(maximum, Math.round(value))) }
  const select = (next: number) => {
    const row = rows[Math.max(0, Math.min(rows.length - 1, next))]
    if (row) onSelect(row.node.id)
  }
  const toggle = (row: TreeRow) => {
    if (!row.node.children?.length) return
    const open = expanded.includes(row.node.id)
    if (open) {
      const start = rows.indexOf(row)
      if (index > start && rows.slice(start + 1, index + 1).every(child => child.depth > row.depth)) onSelect(row.node.id)
    }
    onExpandedChange(open ? expanded.filter(value => value !== row.node.id) : [...expanded, row.node.id])
  }
  useLayoutEffect(() => {
    if (index < 0) return
    const element = viewport.current!
    if (index * 16 < element.scrollTop) element.scrollTop = index * 16
    else if ((index + 1) * 16 > element.scrollTop + page) element.scrollTop = (index + 1) * 16 - page
  }, [index, page])
  useEffect(() => {
    const element = viewport.current!
    const wheel = (event: WheelEvent) => {
      if (disabled || event.ctrlKey || !maximum || !event.deltaY) return
      event.preventDefault()
      const scale = element.getBoundingClientRect().height / element.clientHeight
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? page : 1 / scale
      element.scrollTop += Math.round(event.deltaY * unit)
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => element.removeEventListener('wheel', wheel)
  }, [disabled, maximum, page])
  return <div className="w95-list-view w95-inset w95-native-text" data-active={active && !disabled} data-layout="tree" style={{ width, height }}>
    <div ref={viewport} id={id} role="tree" aria-label={label} aria-disabled={disabled} aria-activedescendant={index >= 0 ? `${id}-${index}` : undefined}
      className="w95-list-viewport" tabIndex={disabled ? -1 : 0} style={{ top: 2, width: width - 20, height: page }} onScroll={event => setOffset(event.currentTarget.scrollTop)}
      onKeyDown={event => {
        if (disabled || !rows.length) return
        const row = rows[index]
        const movement: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, PageUp: -Math.floor(page / 16), PageDown: Math.floor(page / 16) }
        if (event.key in movement || event.key === 'Home' || event.key === 'End') {
          event.preventDefault(); select(event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 : index + movement[event.key])
        } else if (['ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(event.key)) {
          event.preventDefault()
          if (!row) { select(0); return }
          const open = expanded.includes(row.node.id)
          if (event.key === 'ArrowRight') { if (row.node.children?.length) { if (open) select(index + 1); else toggle(row) } }
          else if (event.key === 'ArrowLeft') { if (open && row.node.children?.length) toggle(row); else if (row.parent) onSelect(row.parent) }
          else if (event.key === 'Enter') toggle(row)
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault()
          const text = (event.timeStamp - search.current.time < 700 ? search.current.text : '') + event.key.toLowerCase()
          search.current = { text, time: event.timeStamp }
          const prefix = [...text].every(char => char === text[0]) ? text[0] : text
          for (let step = 0; step < rows.length; step++) {
            const next = (Math.max(0, index + (prefix.length === 1 ? 1 : 0)) + step) % rows.length
            if (rows[next].node.label.toLowerCase().startsWith(prefix)) { select(next); break }
          }
        }
      }}>
      {rows.map((row, rowIndex) => <div key={row.node.id} id={`${id}-${rowIndex}`} role="treeitem" aria-level={row.depth + 1} aria-posinset={row.position} aria-setsize={row.siblings}
        aria-expanded={row.node.children?.length ? expanded.includes(row.node.id) : undefined} aria-selected={selected === row.node.id} className="w95-list-row w95-tree-row" style={{ paddingLeft: row.depth * 19 + 19 }}
        onPointerDown={event => { if (event.button === 0) { event.preventDefault(); if (!disabled) viewport.current?.focus({ preventScroll: true }) } }}
        onClick={() => { if (!disabled) onSelect(row.node.id) }} onDoubleClick={() => { if (!disabled) toggle(row) }}>
        {row.ancestors.map((continues, level) => continues && <span key={level} className="w95-tree-vertical" aria-hidden="true" style={{ left: level * 19 + 7 }} />)}
        {row.depth > 0 && <><span className="w95-tree-vertical" aria-hidden="true" style={{ left: row.depth * 19 + 7, height: row.last ? 9 : 16 }} /><span className="w95-tree-horizontal" aria-hidden="true" style={{ left: row.depth * 19 + 7 }} /></>}
        {row.node.children?.length ? <span className="w95-tree-expander" aria-hidden="true" data-expanded={expanded.includes(row.node.id)} style={{ left: row.depth * 19 + 3 }}
          onClick={event => { event.stopPropagation(); if (!disabled) toggle(row) }} onDoubleClick={event => event.stopPropagation()} /> : null}
        <img src={iconUrl(row.node.icon as KitIconName)} width={16} height={16} alt="" draggable={false} className="w95-list-icon" />
        <span className="w95-list-label" title={row.node.label}>{row.node.label}</span>
      </div>)}
    </div>
    <div style={{ position: 'absolute', left: width - 18, top: 2 }}><Scrollbar orientation="vertical" length={page} total={total} page={page} value={Math.min(offset, maximum)} onChange={scroll} scale={1} controls={id} disabled={disabled} /></div>
  </div>
}
