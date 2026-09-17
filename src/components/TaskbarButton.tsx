import type { ComponentPropsWithRef } from 'react'
import './controls.css'

export function TaskbarButton({ children, icon, selected = false, start = false, className = '', style, ...props }: Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  children: string; icon: string; selected?: boolean; start?: boolean
}) {
  return <button {...props} type="button" className={`w95-button w95-taskbar-button w95-native-text ${start ? 'w95-start-button' : ''} ${className}`}
    data-selected={selected} data-state={selected ? 'pressed' : 'normal'} style={style}>
    <span className="w95-button-frame" aria-hidden="true" />
    <img src={icon} alt="" draggable={false} width={16} height={start ? 14 : 16} />
    <span className="w95-taskbar-label">{children}</span>
  </button>
}
