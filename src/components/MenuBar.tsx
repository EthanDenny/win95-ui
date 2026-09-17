import type { ComponentPropsWithRef, CSSProperties } from 'react'
import './controls.css'

export type MenuBarItem = { label: string; mnemonic?: string; disabled?: boolean; style?: CSSProperties }
export function MenuBar({ items, selected, onOpen, onDismiss, style, ...props }: Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  items: MenuBarItem[]; selected?: string | null; onOpen: (label: string, keyboard: boolean) => void; onDismiss?: () => void
}) {
  return <div {...props} role="menubar" style={{ display: 'flex', height: 18, ...style }}>{items.map((item, index) => {
    const mnemonic = item.mnemonic ?? item.label[0]
    const underline = item.label.toLowerCase().indexOf(mnemonic.toLowerCase())
    return <button key={item.label} type="button" role="menuitem" disabled={item.disabled} aria-haspopup="menu" aria-expanded={selected === item.label} data-menu-label={item.label} aria-label={item.label}
      className="w95-menu-label w95-native-text" style={item.style} onClick={event => onOpen(item.label, event.detail === 0)}
      onPointerEnter={() => { if (selected && selected !== item.label && !item.disabled) onOpen(item.label, false) }} onKeyDown={event => {
        const buttons = [...event.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>('button')].filter(button => !button.disabled)
        const current = buttons.indexOf(event.currentTarget)
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowLeft' ? -1 : 1) + buttons.length) % buttons.length; buttons[next]?.focus()
        }
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onDismiss?.() }
        if (event.key === 'ArrowDown') { event.preventDefault(); onOpen(items[index].label, true) }
        if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
          const match = items.find(candidate => !candidate.disabled && (candidate.mnemonic ?? candidate.label[0]).toLowerCase() === event.key.toLowerCase())
          if (match) { event.preventDefault(); onOpen(match.label, true) }
        }
      }}>{underline < 0 ? item.label : <>{item.label.slice(0, underline)}<u>{item.label[underline]}</u>{item.label.slice(underline + 1)}</>}</button>
  })}</div>
}
