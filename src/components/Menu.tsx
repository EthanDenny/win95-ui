import type { ComponentPropsWithRef, ReactNode } from 'react'
import './controls.css'

export function Menu({ children, className = '', variant = 'raised', onDismiss, onNavigate, onKeyDown, ...props }: ComponentPropsWithRef<'div'> & {
  variant?: 'raised' | 'window'; onDismiss?: () => void; onNavigate?: (direction: -1 | 1) => void
}) {
  return <div {...props} role="menu" tabIndex={-1} className={`w95-menu w95-native-text ${variant === 'window' ? 'w95-window-frame' : 'w95-app-menu w95-raised'} ${className}`} onKeyDown={event => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=menuitem]:not(:disabled)')]
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault(); event.stopPropagation()
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : index < 0 ? (event.key === 'ArrowUp' ? items.length - 1 : 0) : (index + (event.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length
      items[next]?.focus()
    }
    if (onNavigate && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); event.stopPropagation(); onNavigate(event.key === 'ArrowLeft' ? -1 : 1) }
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onDismiss?.() }
    if (event.key === 'Tab') onDismiss?.()
    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const matches = items.filter(item => (item.dataset.mnemonic ?? item.textContent?.trim()[0] ?? '').toLowerCase() === event.key.toLowerCase())
      if (matches.length) {
        event.preventDefault(); event.stopPropagation()
        if (matches.length === 1) matches[0].click()
        else matches[(matches.indexOf(document.activeElement as HTMLButtonElement) + 1) % matches.length].focus()
      }
    }
  }}>{children}</div>
}
export function MenuItem({ children, shortcut, icon, mnemonic, ...props }: ComponentPropsWithRef<'button'> & { shortcut?: string; icon?: ReactNode; mnemonic?: string }) {
  return <button {...props} type="button" role="menuitem" data-mnemonic={mnemonic}>{icon}{children}{shortcut && <span className="w95-menu-shortcut">{shortcut}</span>}</button>
}
export function MenuSeparator() {
  return <div role="separator" className="w95-rule" style={{ margin: '3px 2px' }} />
}
