import { IconButton } from '../components/IconButton'
import { StatusField } from '../components/StatusBar'
import { useRef } from 'react'
import { ScrollArea } from '../components/ScrollArea'
import { panelLayout } from './panelLayout'
import { panelLabels, panelNames } from './model'
import type { AppWindow } from './model'
import { SizeGrip } from '../components/SizeGrip'

export function ControlPanelView({ window: w, selected, scroll, onScroll, onSelect, onOpen }: {
  window: AppWindow; selected: number; scroll: number; onScroll: (value: number) => void; onSelect: (index: number) => void; onOpen: (index: number) => void
}) {
  const layout = panelLayout(w.width, w.height)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const search = useRef({ text: '', time: 0 })
  const select = (index: number) => {
    const next = Math.max(0, Math.min(panelNames.length - 1, index))
    onSelect(next); buttons.current[next]?.focus({ preventScroll: true })
    const top = Math.floor(next / layout.columns) * 75 + 1
    if (top < scroll) onScroll(top)
    else if (top + 66 > scroll + layout.page) onScroll(Math.min(layout.maximum, top + 66 - layout.page))
  }
  return <>
    <div className="w95-inset" style={{ position: 'absolute', left: 4, top: 42, width: w.width - 8, height: w.height - 65, padding: 2 }}>
      <ScrollArea label="Control Panel icons" width={w.width - 12} height={layout.page} contentWidth={w.width - 12 - (layout.overflow ? 16 : 0)} contentHeight={layout.total} vertical={layout.overflow} y={scroll} onScroll={(_x, y) => onScroll(y)}>
        {panelNames.map((name, index) => <IconButton key={name} icon={`/apps/applet-${index}.png`} ref={element => { buttons.current[index] = element }} aria-label={name} selected={selected === index} tabIndex={index === Math.max(0, selected) ? 0 : -1}
          style={{ position: 'absolute', left: 2 + index % layout.columns * 75, top: 1 + Math.floor(index / layout.columns) * 75 }}
          onClick={() => onSelect(index)} onDoubleClick={() => onOpen(index)} onKeyDown={event => {
            const movement: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -layout.columns, ArrowDown: layout.columns, PageUp: -Math.floor(layout.page / 75) * layout.columns, PageDown: Math.floor(layout.page / 75) * layout.columns }
            if (event.key in movement || event.key === 'Home' || event.key === 'End') { event.preventDefault(); select(event.key === 'Home' ? 0 : event.key === 'End' ? panelNames.length - 1 : index + movement[event.key]) }
            else if (event.key === 'Enter') { event.preventDefault(); onOpen(index) }
            else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
              const text = (event.timeStamp - search.current.time < 700 ? search.current.text : '') + event.key.toLowerCase(); search.current = { text, time: event.timeStamp }
              const match = panelNames.findIndex(name => name.toLowerCase().startsWith(text)); if (match >= 0) { event.preventDefault(); select(match) }
            }
          }}>
          {panelLabels[index].map((line, i) => <span key={i} style={{ display: 'block' }}>{line}</span>)}
        </IconButton>)}
      </ScrollArea>
    </div>
    <StatusField variant="application" style={{ position: 'absolute', left: 4, bottom: 4, width: w.width - 8, height: 17 }}>{selected < 0 ? '20 object(s)' : panelNames[selected]}</StatusField>
    <SizeGrip />
  </>
}
