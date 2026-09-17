import type { ComponentPropsWithRef } from 'react'
import { Menu, MenuItem } from './Menu'
import './desktop-controls.css'

export function StartMenu({ items, onSelect, onDismiss, ...props }: Omit<ComponentPropsWithRef<'div'>, 'children' | 'onSelect'> & {
  items: { id: string; label: string; icon: string; disabled?: boolean }[]
  onSelect: (id: string) => void; onDismiss: () => void
}) {
  const separator = 12 + items.length * 37
  return <Menu {...props} variant="window" className={`w95-start-menu ${props.className ?? ''}`} aria-label={props['aria-label'] ?? 'Start menu'}
    style={{ width: 199, height: separator + 42, ...props.style }} onDismiss={onDismiss}>
    <span className="w95-start-rail" aria-hidden="true" style={{ height: separator + 36, paddingTop: separator + 18 }}>95</span>
    {items.map((item, index) => <MenuItem key={item.id} className="w95-start-item" disabled={item.disabled} style={{ top: 7 + index * 37 }} onClick={() => onSelect(item.id)}
      icon={<img src={item.icon} width={32} height={32} alt="" draggable={false} />}><span>{item.label}</span></MenuItem>)}
    <span className="w95-start-separator" aria-hidden="true" style={{ top: separator }} />
    <MenuItem className="w95-start-item w95-show-desktop" style={{ top: separator + 7 }} onClick={() => onSelect('show-desktop')}>Show Desktop</MenuItem>
  </Menu>
}
