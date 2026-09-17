import { useId, useRef, useState } from 'react'
import './controls.css'

export function Dropdown({ label, options, value, onChange, disabled = false, arrowOnly = false, width = 160, height = 22 }: {
  label: string; options: string[]; value: number; onChange: (index: number) => void
  disabled?: boolean; arrowOnly?: boolean; width?: number; height?: number
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const search = useRef({ text: '', time: 0 })
  const expanded = open && !disabled
  const show = (keyboard = false) => { setHighlight(keyboard ? value : -1); setOpen(true) }
  const choose = (index: number) => { if (options[index] !== undefined) onChange(index); setOpen(false) }
  return <div className="w95-dropdown" style={{ width: arrowOnly ? 16 : width }} onBlur={() => setOpen(false)}>
    <button type="button" className={`w95-combobox w95-native-text ${arrowOnly ? 'w95-combobox-arrow-only' : 'w95-inset'}`}
      role="combobox" aria-label={label} aria-expanded={expanded} aria-controls={expanded ? id : undefined} aria-haspopup="listbox" style={{ height }}
      aria-activedescendant={expanded && highlight >= 0 ? `${id}-${highlight}` : undefined} disabled={disabled || options.length === 0}
      onClick={event => expanded ? setOpen(false) : show(event.detail === 0)}
      onKeyDown={event => {
        if (event.key === 'Escape') { if (expanded) event.preventDefault(); setOpen(false); return }
        if (event.key === 'Tab') { if (expanded && highlight >= 0) choose(highlight); return }
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'F4' || event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
          event.preventDefault()
          if (expanded) choose(highlight); else show(true)
          return
        }
        let next: number | undefined
        const current = expanded && highlight >= 0 ? highlight : value
        if (event.key === 'ArrowDown') next = Math.min(options.length - 1, current + 1)
        if (event.key === 'ArrowUp') next = Math.max(0, current - 1)
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = options.length - 1
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const now = event.timeStamp
          const text = (now - search.current.time < 700 ? search.current.text : '') + event.key.toLowerCase()
          search.current = { text, time: now }
          const prefix = [...text].every(char => char === text[0]) ? text[0] : text
          const start = prefix.length === 1 ? current + 1 : current
          for (let step = 0; step < options.length; step++) {
            const index = (Math.max(0, start) + step) % options.length
            if (options[index].toLowerCase().startsWith(prefix)) { next = index; break }
          }
        }
        if (next !== undefined && next >= 0) { event.preventDefault(); if (expanded) setHighlight(next); else onChange(next) }
      }}>
      {!arrowOnly && <span className="w95-combobox-value">{options[value] ?? ''}</span>}
      <span className="w95-dropdown-arrow w95-button" data-state={expanded ? 'pressed' : disabled ? 'disabled' : 'normal'} aria-hidden="true" style={{ height: arrowOnly ? height : height - 4 }}><span className="w95-button-frame" /><span className="w95-down-glyph" /></span>
    </button>
    {expanded && <div className="w95-dropdown-menu w95-inset w95-native-text" id={id} role="listbox" onPointerLeave={() => setHighlight(-1)} aria-label={`${label} choices`} style={{ width, top: height }}>
      {options.map((option, index) => <div key={`${option}-${index}`} id={`${id}-${index}`} role="option" aria-selected={value === index} data-highlighted={highlight === index}
        className="w95-dropdown-option" onPointerDown={event => event.preventDefault()} onPointerMove={() => setHighlight(index)} onClick={() => choose(index)}>{option}</div>)}
    </div>}
  </div>
}
