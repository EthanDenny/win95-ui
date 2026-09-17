import type { ComponentPropsWithRef, ReactNode } from 'react'
import { StatusField } from './StatusBar'
import './desktop-controls.css'

export function Taskbar({ start, tasks, clock, style, className = '', ...props }: Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  start: ReactNode; tasks: ReactNode; clock: string
}) {
  return <div {...props} className={`w95-desktop-taskbar ${className}`} style={{ position: 'relative', height: 30, ...style }}>
    <div style={{ position: 'absolute', left: 2, top: 4 }}>{start}</div>
    <span className="w95-taskbar-separator" aria-hidden="true" />
    <div style={{ position: 'absolute', left: 64, right: 96, top: 4, display: 'flex', gap: 4, overflow: 'hidden' }}>{tasks}</div>
    <StatusField className="w95-taskbar-clock" aria-label="Clock">{clock}</StatusField>
  </div>
}
